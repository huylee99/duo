import Image from "next/image";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

const UpdateAvatar: React.FC<{ avatar: string }> = props => {
  return (
    <section className="space-y-4">
      <h4 className="font-semibold text-lg text-primary">Ảnh đại diện</h4>
      <div>
        <div className="border border-border px-6 py-5 rounded-tl-md rounded-tr-md">
          <div className="flex items-center space-x-4">
            <Image src={props.avatar || "/ezreal.png"} width={100} height={100} alt="ezreal" className="aspect-square rounded-full object-cover" priority />
            <div className="space-y-4">
              <p className="max-w-xs text-sm text-muted-foreground">Ấn vào nút bên dưới để đổi ảnh đại diện</p>
              <form>
                <Button asChild className="cursor-pointer" size="sm">
                  <label htmlFor="file">{false && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Đổi ảnh đại diện</label>
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
          <p className="text-sm text-muted-foreground">Ảnh đại diện phải có định dạng .JPG, .JPEG hoặc .PNG và không quá 5MB.</p>
        </footer>
      </div>
    </section>
  );
};

export default UpdateAvatar;
