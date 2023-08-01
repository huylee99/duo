import { MessagesSquare } from "lucide-react";
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { X, Send, Loader2 } from "lucide-react";
import { api } from "~/server/utils/api";
import { useSession } from "next-auth/react";
import { RouterOutputs } from "~/server/utils/api";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import { cn } from "~/lib/utils";
import { pusherClient } from "~/lib/pusher-client";
import useEvent from "~/hooks/use-event";
import { useClickOutside } from "~/hooks/use-click-outside";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import useDebounce from "~/hooks/use-debounce";

type Conversation = RouterOutputs["chat"]["getConversations"][number];
type Message = RouterOutputs["chat"]["getMessages"][number];

const GreenDot = () => {
  return <div className="w-3 h-3 rounded-full bg-green-400 absolute top-0 right-0 shadow-md border border-green-500"></div>;
};

const ChatAvatar: React.FC<{ conversation: Conversation; selectConversation: (conversation_id: string) => void }> = props => {
  const session = useSession();
  const senderId = session.data?.user.id!;

  const { conversation, selectConversation } = props;

  const otherUser = conversation.user1.id === senderId ? conversation.user2 : conversation.user1;

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger className="relative">
          <Image onClick={() => selectConversation(conversation.id)} src={otherUser.image} alt="avatar" className="w-11 h-11 rounded-full aspect-square shadow-md" width={44} height={44} unoptimized />
          <GreenDot />
        </TooltipTrigger>
        <TooltipContent>
          <span>{otherUser.name ?? otherUser.username}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

type ChatPanelProps = {
  conversation: Conversation;
  closeConversation: (conversation_id: string) => void;
};

const ChatPanel: React.FC<ChatPanelProps> = props => {
  const { conversation, closeConversation } = props;
  const t = api.useContext();

  const [isFocused, setIsFocused] = useState(false);

  const chatPanelRef = useRef<HTMLDivElement>(null);

  useClickOutside(chatPanelRef, () => setIsFocused(false));

  const session = useSession();
  const senderId = session.data?.user.id!;
  const otherUser = conversation.user1.id === senderId ? conversation.user2 : conversation.user1;

  const { isLoading, data } = api.chat.getMessages.useQuery(
    {
      conversation_id: conversation.id,
    },
    {
      refetchOnMount: true,
    }
  );

  const { mutate } = api.chat.markAsRead.useMutation({
    onSuccess: () => {
      t.chat.getConversations.setData(undefined, prev => {
        if (!prev) return prev;

        return prev.map(conversation => {
          if (conversation.id === conversation.id) {
            return { ...conversation, unreadCount: 0 };
          }
          return conversation;
        });
      });
    },
  });

  const setMessage = useEvent((data: Message) => {
    t.chat.getMessages.setData({ conversation_id: conversation.id }, prev => {
      if (!prev) return [data];

      if (data.sender_id === senderId) return prev.map(message => (message.id === "temporary" ? data : message));

      return prev.concat(data);
    });

    if (data.recipient_id === senderId && isFocused) {
      mutate({ conversation_id: conversation.id });
    } else {
      t.chat.getConversations.setData(undefined, prev => {
        if (!prev) return prev;

        return prev.map(conversation => {
          if (conversation.id === data.conversation_id) {
            return { ...conversation, unreadCount: conversation.unreadCount + 1 };
          }
          return conversation;
        });
      });
    }
  });

  useEffect(() => {
    if (isFocused && conversation.unreadCount > 0) {
      mutate({ conversation_id: conversation.id });
    }
  }, [isFocused, mutate, conversation.id, conversation.unreadCount]);

  useEffect(() => {
    const channelName = `private-chat-${conversation.id}`;
    const channel = pusherClient.subscribe(channelName);
    channel.bind("new-message", setMessage);

    return () => {
      pusherClient.unsubscribe(channelName);
      pusherClient.unbind("new-message", setMessage);
    };
  }, [setMessage, conversation.id]);

  return (
    <div onClick={() => setIsFocused(true)} className="w-[336px] h-[432px] bg-primary-foreground rounded-t-lg shadow-md flex flex-col" ref={chatPanelRef}>
      <div className="p-4 flex items-center justify-between border-b border-border/40 flex-1">
        <div className="flex items-center">
          <Image src={otherUser.image} alt="avatar" className="w-10 h-10 mr-2 rounded-full aspect-square shadow-md" width={40} height={40} unoptimized />
          <div className="flex flex-col space-y-0.5">
            <h3 className="font-medium leading-none">{otherUser.name ?? otherUser.username}</h3>
            <span className="text-muted-foreground text-sm">@{otherUser.username}</span>
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-7 h-7 rounded-full cursor-pointer transition-[background-color] hover:bg-secondary flex items-center justify-center" onClick={() => closeConversation(conversation.id)}>
            <X className={cn("w-6 h-6", !isFocused ? "text-muted-foreground" : "text-pink-500")} />
          </div>
        </div>
      </div>
      <div className="h-full items-start flex flex-col p-4 gap-2 overflow-auto">
        {!isLoading && data && data.length > 0
          ? data.map(message => (
              <div key={message.id} className={cn("py-1 px-2 rounded-md leading-none max-w-[288px]", message.sender_id === senderId ? "self-end bg-pink-800" : "bg-secondary", message.id === "temporary" && "animate-pulse")}>
                <span className="leading-normal text-[15px]">{message.message}</span>
              </div>
            ))
          : ""}
      </div>
      <SendMessage conversation_id={conversation.id} isFocused={isFocused} recipientId={otherUser.id} senderId={senderId} />
    </div>
  );
};

const SendMessage: React.FC<{ conversation_id: string; isFocused: boolean; recipientId: string; senderId: string }> = props => {
  const t = api.useContext();
  const { isFocused, conversation_id } = props;
  const { isLoading, mutate } = api.chat.sendMessage.useMutation({
    onMutate: async ({ conversation_id, message, recipient_id }) => {
      const data = {
        id: "temporary",
        sender_id: props.senderId,
        recipient_id,
        conversation_id,
        message,
        seen: false,
        created_at: new Date(),
      };

      t.chat.getMessages.setData({ conversation_id }, prev => {
        if (!prev) return [data];

        return [...prev, data];
      });
    },
  });

  const [message, setMessage] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (message.trim() === "" || isLoading) return;

    mutate({ conversation_id, message, recipient_id: props.recipientId });
    setMessage("");
  };

  return (
    <div className="p-4 border-t border-border/40">
      <form onSubmit={onSubmit} className="flex items-center gap-2">
        <input value={message} onChange={event => setMessage(event.target.value)} type="text" className="flex-1 text-primary bg-secondary rounded-full px-4 py-2 text-sm focus:outline-none" placeholder="Aa" />
        <button type="submit" className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center">
          <Send className={cn("w-5 h-5", !isFocused ? "text-muted-foreground" : "text-pink-500")} />
        </button>
      </form>
    </div>
  );
};

const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");
  const [selectedUser, setSelectedUser] = useState<null | string>(null);

  const debouncedValue = useDebounce(value, 400);

  const { data, isFetching, isRefetching } = api.chat.searchUsers.useQuery({ query: debouncedValue }, { enabled: debouncedValue !== "", keepPreviousData: true });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="w-16 h-16 rounded-full bg-primary-foreground flex items-center justify-center cursor-pointer shadow-md">
          <MessagesSquare className="w-7 h-7 text-pink-500" />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tin nhắn mới</DialogTitle>
          <DialogDescription>Nhập tên hoặc username để tìm người trò chuyện</DialogDescription>
        </DialogHeader>
        <div className="relative">
          <Input value={value} onChange={event => setValue(event.target.value)} placeholder="Tìm kiếm" />
        </div>
        {(isFetching || isRefetching) && <Loader2 className="absolute animate-spin w-5 h-5 text-secondary right-0 top-1/4 mr-2" />}
        {data &&
          (data.length > 0 ? (
            <div className="flex flex-col space-y-2 my-2">
              {data.map(user => (
                <div onClick={() => setSelectedUser(user.id)} key={user.id} className={cn("flex items-center cursor-pointer hover:bg-primary-foreground p-2 rounded-lg", selectedUser === user.id && "bg-primary-foreground")}>
                  <Image src={user.image} alt="avatar" className="w-10 h-10 mr-2 rounded-full aspect-square shadow-md border border-border" width={40} height={40} unoptimized />
                  <div className="flex flex-1 flex-col space-y-0.5">
                    <h3 className="font-medium leading-none text-sm">{user.name ?? user.username}</h3>
                    <span className="text-muted-foreground text-sm">@{user.username}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-muted-foreground text-sm">Không tìm thấy người dùng nào</span>
          ))}

        <DialogFooter>
          <Button type="submit">Bắt đầu trò chuyện</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Chat = () => {
  const t = api.useContext();
  const { data, isLoading } = api.chat.getConversations.useQuery(undefined);
  const [selectedConversations, setSelectedConversations] = React.useState<Conversation[]>([]);

  const selectConversation = (conversation_id: string) => {
    if (!selectedConversations.find(conversation => conversation.id === conversation_id)) {
      return setSelectedConversations(prev => [...prev, data?.find(conversation => conversation.id === conversation_id)!]);
    }
  };

  const closeConversation = (conversation_id: string) => {
    setSelectedConversations(prev => prev.filter(conversation => conversation.id !== conversation_id));
  };

  // const updateConversation = useEvent((conversation: Conversation) => {

  // });

  const markAsRead = useEvent(({ conversation_id }: { conversation_id: string }) => {
    t.chat.getMessages.setData({ conversation_id }, prev => {
      if (!prev) return prev;

      return prev.map(message => ({ ...message, seen: true }));
    });

    t.chat.getConversations.setData(undefined, prev => {
      if (!prev) return prev;

      return prev.map(conversation => {
        if (conversation.id === conversation_id) {
          return { ...conversation, unreadCount: 0 };
        }
        return conversation;
      });
    });
  });

  useEffect(() => {
    // pusherClient.bind("conversation:update", updateConversation);
    pusherClient.bind("conversation:read", markAsRead);

    return () => {
      // pusherClient.unbind("conversation:update", updateConversation);
      pusherClient.unbind("conversation:read", markAsRead);
    };
  }, [markAsRead]);

  return (
    <>
      <div className="fixed right-4 bottom-4 z-20">
        {!isLoading && data && data.length > 0 && (
          <div className="w-16 mb-4 shadow-md bg-primary-foreground flex flex-col h-full max-h-[calc(100vh-170px)] rounded-full items-center py-3 gap-4 no-scrollbar overflow-auto">
            {data.map(conversation => (
              <ChatAvatar selectConversation={selectConversation} conversation={conversation} key={conversation.id} />
            ))}
          </div>
        )}

        <ChatButton />
      </div>

      {selectedConversations.length > 0 && (
        <div className="flex items-end gap-4 fixed z-10 right-24 bottom-0">
          {selectedConversations.map(conversation => (
            <ChatPanel key={conversation.id} conversation={conversation} closeConversation={closeConversation} />
          ))}
        </div>
      )}
    </>
  );
};

export default Chat;
