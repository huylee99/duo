import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { updateUsernameValidatorSchema, type UpdateUsernameFields } from "~/shared/validators/update-profile-validator";
import { cn } from "~/lib/utils";
import { api } from "~/server/utils/api";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

type UpdateUsernameProps = {
  username: string | null;
};

const UpdateUsername: React.FC<UpdateUsernameProps> = ({ username }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<UpdateUsernameFields>({ resolver: zodResolver(updateUsernameValidatorSchema), defaultValues: { username: username || "" } });
  const t = api.useContext();
  const { mutate, isLoading } = api.user.updateUsername.useMutation({
    onSuccess: username => {
      t.user.me.setData(undefined, oldData => {
        if (!oldData) return;

        return {
          ...oldData,
          username: username,
        };
      });
      reset({ username: username });
      toast.success("Cập nhật username thành công");
    },
    onError: error => {
      toast.error(error.message);
    },
  });
  const onSubmit = handleSubmit(async data => {
    if (isLoading) return;
    mutate({ username: data.username });
  });

  const error = errors.username?.message;
  const isSafeToSubmit = !error && !isDirty;

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h4 className="font-semibold text-primary text-lg">Username</h4>
        <p className="text-sm text-muted-foreground">Thay đổi username sẽ thay đổi đường dẫn vào trang cá nhân của bạn</p>
      </div>
      <form onSubmit={onSubmit}>
        <div className="border border-border rounded-tr-md rounded-tl-md px-6 py-5">
          <div className="space-y-2">
            <Label className="text-base" htmlFor="username">
              Username
            </Label>
            <div className="flex w-80 max-w-full rounded-md overflow-hidden">
              <div className="flex justify-center items-center py-2 px-3 bg-muted border border-border rounded-tl-md rounded-bl-md">
                <span className="text-muted-foreground text-sm">chưa biết.gg/</span>
              </div>
              <div className="flex-1 flex justify-center">
                <input type="text" {...register("username")} className="w-full rounded-tr-md rounded-br-md border border-border border-l-transparent px-3 text-sm bg-transparent" autoComplete="off" aria-autocomplete="none" disabled={isLoading} />
              </div>
            </div>
          </div>
        </div>
        <footer className="border flex justify-between items-center border-border border-t-transparent rounded-br-md rounded-bl-md px-6 py-2 bg-muted gap-10">
          <p className={cn("text-sm", error ? "text-destructive" : "text-muted-foreground")}>{!error ? "Username chỉ được phép tối đa 32 kí tự." : error}</p>
          <Button size="sm" className="h-8" disabled={isSafeToSubmit || isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Lưu
          </Button>
        </footer>
      </form>
    </section>
  );
};

export default UpdateUsername;
