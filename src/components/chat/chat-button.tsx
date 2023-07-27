import { MessagesSquare } from "lucide-react";
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Minus, X, Send } from "lucide-react";

const GreenDot = () => {
  return <div className="w-3 h-3 rounded-full bg-green-400 absolute top-0 right-0 shadow-md border border-green-500"></div>;
};

const ChatAvatar = () => {
  return (
    <TooltipProvider delayDuration={500}>
      <Tooltip>
        <TooltipTrigger className="relative">
          <Image src="https://picsum.photos/200" alt="avatar" className="w-11 h-11 rounded-full aspect-square shadow-md" width={44} height={44} unoptimized />
          <GreenDot />
        </TooltipTrigger>
        <TooltipContent>
          <p>Nhat Huy Le</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const ChatList = () => {
  return (
    <div className="flex items-end gap-4 fixed right-24 bottom-0">
      <div className="w-[336px] h-[432px] bg-primary-foreground rounded-t-lg shadow-md flex flex-col">
        <div className="p-4 flex items-center justify-between border-b border-border/40 flex-1">
          <div className="flex items-center">
            <Image src="https://picsum.photos/200" alt="avatar" className="w-10 h-10 mr-2 rounded-full aspect-square shadow-md" width={40} height={40} unoptimized />
            <div className="flex flex-col space-y-0.5">
              <h3 className="font-medium leading-none">Nhat Huy Le</h3>
              <span className="text-muted-foreground text-sm">@nhathuyle</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-full cursor-pointer transition-[background-color] hover:bg-secondary flex items-center justify-center">
              <Minus className="w-6 h-6 text-pink-500" />
            </div>
            <div className="w-7 h-7 rounded-full cursor-pointer transition-[background-color] hover:bg-secondary flex items-center justify-center">
              <X className="w-6 h-6 text-pink-500" />
            </div>
          </div>
        </div>
        <div className="h-full flex flex-col p-4 gap-4 overflow-auto">
          <div className="px-4 py-3 bg-secondary rounded-lg leading-none max-w-[288px]">
            <span className="leading-normal text-[15px]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed</span>
          </div>
          <div className="px-4 py-3 bg-pink-800 max-w-xs rounded-lg leading-none self-end">
            <span className="leading-normal text-white text-[15px]">Lorem ipsum dolor sit amet</span>
          </div>
          <div className="px-4 py-3 bg-secondary rounded-lg leading-none max-w-[288px]">
            <span className="leading-normal text-[15px]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed</span>
          </div>
          <div className="px-4 py-3 bg-pink-800 max-w-xs rounded-lg leading-none self-end">
            <span className="leading-normal text-white text-[15px]">Lorem ipsum dolor sit amet</span>
          </div>
          <div className="px-4 py-3 bg-secondary rounded-lg leading-none max-w-[288px]">
            <span className="leading-normal text-[15px]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed</span>
          </div>
          <div className="px-4 py-3 bg-pink-800 max-w-xs rounded-lg leading-none self-end">
            <span className="leading-normal text-white text-[15px]">Lorem ipsum dolor sit amet</span>
          </div>
        </div>
        <div className="p-4 flex items-center gap-2 border-t border-border/40">
          <input type="text" className="flex-1 text-primary bg-secondary rounded-full px-4 py-2 text-sm focus:outline-none" placeholder="Aa" />
          <button type="button" className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center">
            <Send className="w-5 h-5 text-pink-500" />
          </button>
        </div>
      </div>
      <div className="w-[336px] h-[432px] bg-primary-foreground rounded-t-lg shadow-md flex flex-col">
        <div className="p-4 flex items-center justify-between border-b border-border/40 flex-1">
          <div className="flex items-center">
            <Image src="https://picsum.photos/200" alt="avatar" className="w-10 h-10 mr-2 rounded-full aspect-square shadow-md" width={40} height={40} unoptimized />
            <div className="flex flex-col space-y-0.5">
              <h3 className="font-medium leading-none">Nhat Huy Le</h3>
              <span className="text-muted-foreground text-sm">@nhathuyle</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-full cursor-pointer transition-[background-color] hover:bg-secondary flex items-center justify-center">
              <Minus className="w-6 h-6 text-pink-500" />
            </div>
            <div className="w-7 h-7 rounded-full cursor-pointer transition-[background-color] hover:bg-secondary flex items-center justify-center">
              <X className="w-6 h-6 text-pink-500" />
            </div>
          </div>
        </div>
        <div className="h-full flex flex-col p-4 gap-4 overflow-auto">
          <div className="px-4 py-3 bg-secondary rounded-lg leading-none max-w-[288px]">
            <span className="leading-normal text-[15px]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed</span>
          </div>
          <div className="px-4 py-3 bg-pink-800 max-w-xs rounded-lg leading-none self-end">
            <span className="leading-normal text-white text-[15px]">Lorem ipsum dolor sit amet</span>
          </div>
          <div className="px-4 py-3 bg-secondary rounded-lg leading-none max-w-[288px]">
            <span className="leading-normal text-[15px]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed</span>
          </div>
          <div className="px-4 py-3 bg-pink-800 max-w-xs rounded-lg leading-none self-end">
            <span className="leading-normal text-white text-[15px]">Lorem ipsum dolor sit amet</span>
          </div>
          <div className="px-4 py-3 bg-secondary rounded-lg leading-none max-w-[288px]">
            <span className="leading-normal text-[15px]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed</span>
          </div>
          <div className="px-4 py-3 bg-pink-800 max-w-xs rounded-lg leading-none self-end">
            <span className="leading-normal text-white text-[15px]">Lorem ipsum dolor sit amet</span>
          </div>
        </div>
        <div className="p-4 flex items-center gap-2 border-t border-border/40">
          <input type="text" className="flex-1 text-primary bg-secondary rounded-full px-4 py-2 text-sm focus:outline-none" placeholder="Aa" />
          <button type="button" className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center">
            <Send className="w-5 h-5 text-pink-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

const ChatButton = () => {
  return (
    <>
      <div className="fixed right-4 bottom-4 z-10">
        <div className="w-16 mb-4 shadow-md bg-primary-foreground flex flex-col h-full max-h-[calc(100vh-170px)] rounded-full items-center py-3 gap-4 no-scrollbar overflow-auto">
          <ChatAvatar />
          <ChatAvatar />
          <ChatAvatar />
          <ChatAvatar />
          <ChatAvatar />
          <ChatAvatar />
        </div>
        <div className="w-16 h-16 rounded-full bg-primary-foreground flex items-center justify-center cursor-pointer shadow-md">
          <MessagesSquare className="w-7 h-7 text-pink-500" />
        </div>
      </div>

      <ChatList />
    </>
  );
};

export default ChatButton;
