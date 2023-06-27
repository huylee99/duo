import Image from "next/image";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import { api } from "~/server/utils/api";
import { toast } from "react-hot-toast";
import { useUpload } from "~/hooks/use-upload";
import { genImageUrl } from "~/utils/image-url";

type UpdateBannerProps = {
  banner: string | null;
};

const UpdateBanner: React.FC<UpdateBannerProps> = ({ banner }) => {
  const [isLoading, setIsLoading] = useState(false);
  const t = api.useContext();
  const fileRef = useRef<HTMLInputElement>(null);

  const { mutate } = api.user.updateBanner.useMutation({
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const { uploadFiles } = useUpload({
    allowedFileTypes: ["image/png", "image/jpeg", "image/webp"],
    maxFileSize: 5 * 1024 * 1024,
    onError() {
      toast.error("Đã xảy ra lỗi, vui lòng thử lại");
    },
    isMultiple: false,
    onUploadCompleted(result) {
      mutate({ image: result[0].fileKey });
      t.user.me.setData(undefined, oldData => {
        if (!oldData) return;

        return {
          ...oldData,
          banner: result[0].fileKey,
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
      <h4 className="font-semibold text-primary text-lg">Ảnh bìa</h4>
      <div>
        <div className="border border-border rounded-tr-md rounded-tl-md p-6">
          <div className="flex items-center space-x-6">
            <Image src={banner ? genImageUrl(banner) : "/placeholder.png"} width={320} height={180} alt="ezreal" className="aspect-video object-contain rounded-md w-full h-auto" priority quality={100} />
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Ấn vào nút bên dưới để đổi ảnh bìa (Hình nên có tỉ lệ 16:9 để hiển thị tốt nhất)</p>
              <Button disabled={isLoading} className="cursor-pointer p-0" size="sm">
                <label htmlFor="file-banner" className="flex items-center h-9 px-3 cursor-pointer">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Đổi ảnh bìa
                </label>
              </Button>
              <input type="file" id="file-banner" ref={fileRef} onChange={handleUpload} className="sr-only" />
            </div>
          </div>
        </div>
        <footer className="border flex justify-between items-center border-border border-t-transparent rounded-br-md rounded-bl-md px-6 py-3 bg-muted">
          <p className="text-sm text-muted-foreground">Ảnh bìa phải có định dạng .JPG, .JPEG hoặc .PNG và không quá 5MB.</p>
        </footer>
      </div>
    </section>
  );
};

export default UpdateBanner;
