import { cn } from "~/lib/utils";
import { useEditor, EditorContent } from "@tiptap/react";
import type { Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Link } from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
import { Color } from "@tiptap/extension-color";
import { Youtube } from "@tiptap/extension-youtube";
import { Unlink, Pilcrow, Quote, LinkIcon, Strikethrough, Bold, ListOrdered, List, Italic, YoutubeIcon, Heading1, Heading2, Heading3, Eye } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { sanitizeHtml } from "~/utils/sanitize-html";

const EditorMenu: React.FC<{ editor: Editor }> = ({ editor }) => {
  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href as string;
    const url = window.prompt("Đường dẫn muốn chèn vào", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  const addYoutubeVideo = () => {
    const url = window.prompt("Vui lòng nhập link youtube");

    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
      });
    }
  };

  return (
    <div className="flex flex-wrap items-center space-x-2 bg-muted/40 py-2 px-3 relative">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} className={cn(editor.isActive("bold") ? "bg-accent" : "", "flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent")}>
        <span className="sr-only">Bold</span>
        <Bold className="w-4 h-4 text-primary" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()} className={cn(editor.isActive("italic") ? "bg-accent" : "", "flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent")}>
        <span className="sr-only">Italic</span>
        <Italic className="w-4 h-4 text-primary" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} disabled={!editor.can().chain().focus().toggleStrike().run()} className={cn(editor.isActive("strike") ? "bg-accent" : "", "flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent")}>
        <span className="sr-only">Strike through</span>
        <Strikethrough className="text-primary w-4 h-4" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().setParagraph().run()} disabled={!editor.can().chain().focus().setParagraph().run()} className={cn(editor.isActive("paragraph") ? "bg-accent" : "", "flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent")}>
        <span className="sr-only">Pilcrow</span>
        <Pilcrow className="text-primary w-4 h-4" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={cn(editor.isActive("heading", { level: 1 }) ? "bg-accent" : "", "flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent")}>
        <span className="sr-only">Heading 1</span>
        <Heading1 className="text-primary w-4 h-4" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={cn(editor.isActive("heading", { level: 2 }) ? "bg-accent" : "", "flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent")}>
        <span className="sr-only">Heading 2</span>
        <Heading2 className="text-primary w-4 h-4" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={cn(editor.isActive("heading", { level: 3 }) ? "bg-accent" : "", "flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent")}>
        <span className="sr-only">Heading 3</span>
        <Heading3 className="text-primary w-4 h-4" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={cn(editor.isActive("bulletList") ? "bg-accent" : "", "flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent")}>
        <span className="sr-only">Unordered list</span>
        <List className="w-4 h-4 text-primary" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={cn(editor.isActive("orderedList") ? "bg-accent" : "", "flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent")}>
        <span className="sr-only">Ordered list</span>
        <ListOrdered className="text-primary w-4 h-4" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={cn(editor.isActive("blockquote") ? "bg-accent" : "", "flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent")}>
        <span className="sr-only">Blockquote</span>
        <Quote className="text-primary w-4 h-4" />
      </button>
      <button type="button" onClick={setLink} className={cn(editor.isActive("link") ? "bg-accent" : "", "flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent")}>
        <span className="sr-only">Link</span>
        <LinkIcon className="w-4 h-4 text-primary" />
      </button>
      <button type="button" onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.isActive("link")} className={"flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent disabled:pointer-events-none"}>
        <span className="sr-only">Unlink</span>
        <Unlink className="w-4 h-4 text-primary" />
      </button>

      <button type="button" onClick={addYoutubeVideo} className={"flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent disabled:pointer-events-none"}>
        <span className="sr-only">Youtube</span>
        <YoutubeIcon className="w-4 h-4 text-destructive" />
      </button>
    </div>
  );
};

const PreviewPost: React.FC<{ editor: Editor }> = ({ editor }) => {
  const [open, setOpen] = useState(false);

  let content = "";

  if (open) {
    content = sanitizeHtml(editor.getHTML());
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant={"ghost"} type="button" className="h-8" size="sm">
            Xem trước
          </Button>
        </DialogTrigger>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Xem trước bài viết</DialogTitle>
          </DialogHeader>
          <div className="prose text-primary">
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

type BioEditorProps = {
  content: string;
};

const Bio: React.FC<BioEditorProps> = ({ content }) => {
  const [bio, setBio] = useState("");

  const editor = useEditor({
    editorProps: {
      attributes: {
        class: "p-4 py-2 prose text-primary focus:outline-none outline-none max-w-full border-none prose-p:mt-[1em] prose-p:mb-[1em] h-96 overflow-auto",
      },
    },
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      // @ts-expect-error error from lib
      TextStyle.configure({ types: [ListItem.name] }),
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      Link.configure({
        openOnClick: false,
        validate: href => /^https?:\/\//.test(href),
      }),
      Youtube,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      setBio(editor.getHTML());
    },
  });

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h4 className="font-semibold text-primary text-lg">Giới thiệu</h4>
        <p className="text-sm text-muted-foreground">Bài giới thiệu sẽ hiện trên trang cá nhân của bạn.</p>
      </div>
      <div>
        <div className="border border-border rounded-tr-md rounded-tl-md overflow-hidden">
          {editor && (
            <>
              <EditorMenu editor={editor} />
              <EditorContent editor={editor} />
            </>
          )}
        </div>
        <footer className="border flex justify-between items-center border-border border-t-transparent rounded-br-md rounded-bl-md px-6 py-3 bg-muted">
          <p className="text-sm text-muted-foreground">Bài giới thiệu không quá 2000 kí tự.</p>
          <div className="flex items-center space-x-2 relative">
            {editor && <PreviewPost editor={editor} />}
            <Button className="h-8" size="sm">
              Lưu
            </Button>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default Bio;
