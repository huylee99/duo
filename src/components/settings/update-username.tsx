import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { updateUsernameValidatorSchema, type UpdateUsernameFields } from "~/shared/validators/update-profile-validator";
import { zodResolver } from "@hookform/resolvers/zod";

const UpdateUsername = () => {
  const { register, handleSubmit, formState } = useForm<UpdateUsernameFields>({ resolver: zodResolver(updateUsernameValidatorSchema) });

  const onSubmit = handleSubmit(async data => {
    console.log(data);
  });

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h4 className="font-semibold text-primary text-lg">Username</h4>
        <p className="text-sm text-muted-foreground">Thay đổi username sẽ thay đổi đường dẫn vào trang cá nhân của bạn</p>
      </div>
      <form>
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
                <input type="text" id="username" className="w-full rounded-tr-md rounded-br-md border border-border border-l-transparent px-3 text-sm bg-transparent" autoComplete="off" aria-autocomplete="none" />
              </div>
            </div>
          </div>
        </div>
        <footer className="border flex justify-between items-center border-border border-t-transparent rounded-br-md rounded-bl-md px-6 py-2 bg-muted">
          <p className="text-sm text-muted-foreground">Username chỉ được phép tối đa 32 kí tự.</p>
          <Button size="sm" className="h-8">
            Lưu
          </Button>
        </footer>
      </form>
    </section>
  );
};

export default UpdateUsername;
