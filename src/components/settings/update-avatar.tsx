import Image from "next/image";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { useUpload } from "~/hooks/use-upload";
import { ChangeEvent, useRef } from "react";
import { toast } from "react-hot-toast";
import { api } from "~/server/utils/api";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { genImageUrl } from "~/utils/image-url";

const UpdateAvatar: React.FC<{ avatar: string }> = props => {
  const [isLoading, setIsLoading] = useState(false);
  const t = api.useContext();
  const { update } = useSession();
  const { mutate } = api.user.updateAvatar.useMutation({
    onSuccess: () => {
      update();
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const fileRef = useRef<HTMLInputElement>(null);
  const { uploadFiles } = useUpload({
    allowedFileTypes: ["image/png", "image/jpeg", "image/webp"],
    maxFileSize: 5 * 1024 * 1024,
    onError() {
      toast.error("Đã xảy ra lỗi, vui lòng thử lại");
    },
    onUploadCompleted(result) {
      mutate({ image: result[0].fileKey });
      t.user.me.setData(undefined, oldData => {
        if (!oldData) return;

        return {
          ...oldData,
          image: result[0].fileKey,
        };
      });
    },
    onSettled() {
      if (fileRef.current) {
        fileRef.current.value = "";
      }
    },
  });

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || isLoading) return;
    setIsLoading(true);
    const files = Array.from(event.target.files);
    await uploadFiles(files);
  };

  return (
    <section className="space-y-4">
      <h4 className="font-semibold text-lg text-primary">Ảnh đại diện</h4>
      <div>
        <div className="border border-border px-6 py-5 rounded-tl-md rounded-tr-md">
          <div className="flex items-center space-x-4">
            <Image src={genImageUrl(props.avatar)} width={100} height={100} alt="ezreal" className="aspect-square rounded-full object-cover" priority />
            <div className="space-y-4">
              <p className="max-w-xs text-sm text-muted-foreground">Ấn vào nút bên dưới để đổi ảnh đại diện</p>

              <Button type="button" className="cursor-pointer p-0" size="sm" disabled={isLoading}>
                <label htmlFor="file" className="flex items-center h-9 px-3 cursor-pointer">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Đổi ảnh đại diện
                </label>
              </Button>
              <input type="file" id="file" ref={fileRef} className="sr-only" onChange={handleUpload} />
            </div>
          </div>
        </div>
        <footer className="border flex justify-between items-center border-border border-t-transparent rounded-br-md rounded-bl-md px-6 py-3 bg-muted">
          <p className="text-sm text-muted-foreground">Ảnh đại diện phải có định dạng .JPG, .JPEG hoặc .PNG và không quá 5MB.</p>
        </footer>
      </div>
    </section>
  );
};

export default UpdateAvatar;
