import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { updateProfileValidatorSchema, type UpdateProfileFields } from "~/shared/validators/update-profile-validator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "~/lib/utils";
import { api } from "~/server/utils/api";
import toast from "react-hot-toast";

type UpdateProfileProps = {
  name: string | null;
  shortBio: string | null;
};

const UpdateProfile: React.FC<UpdateProfileProps> = ({ name, shortBio }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<UpdateProfileFields>({
    resolver: zodResolver(updateProfileValidatorSchema),
    defaultValues: { name: name || "", shortBio: shortBio || "" },
  });
  const t = api.useContext();
  const { mutate, isLoading } = api.user.updateProfile.useMutation({
    onSuccess: data => {
      t.user.me.setData(undefined, oldState => {
        if (!oldState) return oldState;

        return {
          ...oldState,
          ...data,
        };
      });

      reset({ ...data });
      toast.success("Cập nhật thông tin thành công.");
    },
    onError: () => {
      toast.error("Đã xảy ra lỗi, vui lòng thử lại.");
    },
  });

  const hasError = errors.name?.message || errors.shortBio?.message;
  const isSafeToSubmit = !hasError && !isDirty;

  const onSubmit = handleSubmit(async data => {
    if (isLoading) return;

    mutate(data);
  });

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h4 className="font-semibold text-primary text-lg">Thông tin</h4>
        <p className="text-sm text-muted-foreground">Thông tin này sẽ hiện trên trang cá nhân.</p>
      </div>
      <form onSubmit={onSubmit}>
        <div className="border border-border rounded-tr-md rounded-tl-md p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-base" htmlFor="name">
                Tên hiển thị
              </Label>
              <Input {...register("name")} type="text" className="focus-visible:border-muted" placeholder="Tên hoặc nickname" autoComplete="off" aria-autocomplete="none" disabled={isLoading} />
            </div>
            <div className="space-y-2">
              <Label className="text-base" htmlFor="shortBio">
                Mô tả ngắn
              </Label>
              <Input {...register("shortBio")} type="text" className="focus-visible:border-muted" placeholder={`Ví dụ: "Xinh đẹp, ngoan hiền, dễ thương, chơi game giỏi 💕"`} disabled={isLoading} />
            </div>
          </div>
        </div>
        <footer className="border flex justify-between items-center border-border border-t-transparent rounded-br-md rounded-bl-md px-6 py-3 bg-muted gap-10">
          <p className={cn("text-sm", hasError ? "text-destructive" : "text-muted-foreground")}>Tên hiển thị tối đa 32 kí tự, và mô tả tối đa 64 kí tự.</p>
          <Button className="h-8" size="sm" type="submit" disabled={isSafeToSubmit || isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Lưu
          </Button>
        </footer>
      </form>
    </section>
  );
};

export default UpdateProfile;
