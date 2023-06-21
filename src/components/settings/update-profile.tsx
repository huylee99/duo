import Image from "next/image";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

const UpdateProfile = () => {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h4 className="font-semibold text-primary text-lg">Thông tin</h4>
        <p className="text-sm text-muted-foreground">Thông tin này sẽ hiện trên trang cá nhân.</p>
      </div>
      <div>
        <div className="border border-border rounded-tr-md rounded-tl-md p-6">
          <form>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base" htmlFor="name">
                  Tên hiển thị
                </Label>
                <Input type="text" id="name" className="focus-visible:border-muted" placeholder="Tên hoặc nickname" autoComplete="off" aria-autocomplete="none" />
                {/* {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>} */}
              </div>
              <div className="space-y-2">
                <Label className="text-base" htmlFor="shortBio">
                  Mô tả ngắn
                </Label>
                <Input id="shortBio" type="text" className="focus-visible:border-muted" placeholder="Ví dụ: Xinh đẹp, ngoan hiền, dễ thương, chơi game giỏi 💕" />
                {/* {errors.newPassword && <span className="text-xs text-red-500">{errors.newPassword.message}</span>} */}
              </div>
            </div>
          </form>
        </div>
        <footer className="border flex justify-between items-center border-border border-t-transparent rounded-br-md rounded-bl-md px-6 py-3 bg-muted">
          <p className="text-sm text-muted-foreground">Tên hiển thị tối đa 32 kí tự, và mô tả tối đa 64 kí tự.</p>
          <Button className="h-8" size="sm">
            Lưu
          </Button>
        </footer>
      </div>
    </section>
  );
};

export default UpdateProfile;
