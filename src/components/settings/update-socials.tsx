import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

const UpdateSocials = () => {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h4 className="font-semibold text-primary text-lg">Mạng xã hội</h4>
        <p className="text-sm text-muted-foreground">Thêm Facebook, Instagram, ... để mọi người dễ dàng kết nối với bạn hơn</p>
      </div>
      <div>
        <div className="border border-border rounded-tr-md rounded-tl-md p-6">
          <form>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base" htmlFor="facebook">
                  Facebook
                </Label>
                <Input type="text" id="facebook" className="focus-visible:border-muted" autoComplete="off" aria-autocomplete="none" placeholder="https://www.facebook.com/nhathuy.le.587268" />
                {/* {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>} */}
              </div>
              <div className="space-y-2">
                <Label className="text-base" htmlFor="instagram">
                  Instagram
                </Label>
                <Input id="instagram" type="text" className="focus-visible:border-muted" autoComplete="off" aria-autocomplete="none" placeholder="https://www.instagram.com/thaihoang1991" />
                {/* {errors.newPassword && <span className="text-xs text-red-500">{errors.newPassword.message}</span>} */}
              </div>
              <div className="space-y-2">
                <Label className="text-base" htmlFor="discord">
                  Discord
                </Label>
                <Input id="discord" type="text" className="focus-visible:border-muted" autoComplete="off" aria-autocomplete="none" placeholder="https://discord.gg/8Uu78TPk" />
                {/* {errors.newPassword && <span className="text-xs text-red-500">{errors.newPassword.message}</span>} */}
              </div>
            </div>
          </form>
        </div>
        <footer className="border flex justify-end items-center border-border border-t-transparent rounded-br-md rounded-bl-md px-6 py-3 bg-muted">
          <Button className="h-8" size="sm">
            Lưu
          </Button>
        </footer>
      </div>
    </section>
  );
};

export default UpdateSocials;
