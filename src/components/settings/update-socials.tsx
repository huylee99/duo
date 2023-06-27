import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { updateSocialsValidatorSchema, type UpdateSocialsFields } from "~/shared/validators/update-profile-validator";
import { cn } from "~/lib/utils";
import { api } from "~/server/utils/api";
import toast from "react-hot-toast";

type UpdateSocialsProps = {
  facebook: string | null;
  instagram: string | null;
  discord: string | null;
};

const UpdateSocials: React.FC<UpdateSocialsProps> = ({ discord, facebook, instagram }) => {
  const {
    register,
    handleSubmit,
    formState: { isDirty, errors },
    reset,
  } = useForm<UpdateSocialsFields>({ resolver: zodResolver(updateSocialsValidatorSchema), defaultValues: { discord: discord || "", facebook: facebook || "", instagram: instagram || "" } });
  const t = api.useContext();
  const { mutate, isLoading } = api.user.updateSocials.useMutation({
    onSuccess: data => {
      t.user.me.setData(undefined, oldState => {
        if (!oldState) return oldState;
        return {
          ...oldState,
          ...data,
        };
      });
      reset({ ...data });
      toast.success("Cập nhật thành công.");
    },
    onError: () => {
      toast.error("Đã xảy ra lỗi, vui lòng thử lại.");
    },
  });

  const onSubmit = handleSubmit(async data => {
    if (isLoading) return;

    mutate(data);
  });

  const hasError = errors.facebook?.message || errors.instagram?.message || errors.discord?.message;
  const isSafeToSubmit = !isDirty && !hasError;

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h4 className="font-semibold text-primary text-lg">Mạng xã hội</h4>
        <p className="text-sm text-muted-foreground">Thêm Facebook, Instagram, ... để mọi người dễ dàng kết nối với bạn hơn</p>
      </div>
      <form onSubmit={onSubmit}>
        <div className="border border-border rounded-tr-md rounded-tl-md p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-base" htmlFor="facebook">
                Facebook
              </Label>
              <Input {...register("facebook")} type="text" className="focus-visible:border-muted" autoComplete="off" aria-autocomplete="none" placeholder="Ví dụ: https://www.facebook.com/nhathuy.le.587268" />
            </div>
            <div className="space-y-2">
              <Label className="text-base" htmlFor="instagram">
                Instagram
              </Label>
              <Input {...register("instagram")} type="text" className="focus-visible:border-muted" autoComplete="off" aria-autocomplete="none" placeholder="Ví dụ: https://www.instagram.com/thaihoang1991" />
            </div>
            <div className="space-y-2">
              <Label className="text-base" htmlFor="discord">
                Discord
              </Label>
              <Input {...register("discord")} type="text" className="focus-visible:border-muted" autoComplete="off" aria-autocomplete="none" placeholder="Ví dụ: https://discord.gg/8Uu78TPk" />
            </div>
          </div>
        </div>
        <footer className="border flex items-center border-border border-t-transparent rounded-br-md rounded-bl-md px-6 py-3 bg-muted gap-10">
          {hasError && <p className={cn("text-sm", hasError && "text-destructive")}>Đường dẫn không hợp lệ.</p>}

          <Button className="h-8 ml-auto" size="sm" disabled={isSafeToSubmit || isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Lưu
          </Button>
        </footer>
      </form>
    </section>
  );
};

export default UpdateSocials;
