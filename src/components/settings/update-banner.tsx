import Image from "next/image";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

const UpdateBanner = () => {
  return (
    <section className="space-y-4">
      <h4 className="font-semibold text-primary text-lg">Ảnh bìa</h4>
      <div>
        <div className="border border-border rounded-tr-md rounded-tl-md p-6">
          <div className="flex items-center space-x-6">
            <Image src={"/bg.png"} width={320} height={180} alt="ezreal" className="aspect-video object-cover rounded-md" priority />
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Ấn vào nút bên dưới để đổi ảnh bìa (Hình nên có tỉ lệ 16:9 để hiển thị tốt nhất)</p>
              <form>
                <Button asChild className="cursor-pointer" size="sm">
                  <label htmlFor="file">{false && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Đổi ảnh bìa</label>
                </Button>
                {/* <input
                        type="file"
                        id="file"
                        className="sr-only"
                        {...register("file", {
                            onChange: (event) => {
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                                if (event.target.value !== "") {
                                    buttonRef.current?.click();
                                }
                            }
                        })} />
                    <button ref={(ref) => (buttonRef.current = ref)} type="submit" className="sr-only"></button> */}
              </form>
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
