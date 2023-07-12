import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogHeader } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import useToggle from "~/hooks/use-toggle";
import { type InsertRequest } from "~/server/db/validator-schema";
import { api } from "~/server/utils/api";
import { toast } from "react-hot-toast";
import ServiceForm from "./service-form";

const AddService = () => {
  const { onChange, value, onClose } = useToggle();
  const utils = api.useContext();

  const { mutateAsync, isLoading } = api.service.create.useMutation({
    onSuccess: newData => {
      utils.service.getMany.setData(undefined, old => {
        if (old) {
          return [...old, newData];
        }
        return [newData];
      });

      toast.success("Thêm dịch vụ thành công");
      onClose();
    },
    onError: () => {
      toast.error("Thêm dịch vụ thất bại");
    },
  });

  const onSubmit = async (values: InsertRequest) => {
    await mutateAsync(values);
  };

  return (
    <Dialog onOpenChange={onChange} open={value}>
      <DialogTrigger asChild>
        <Button size={"lg"}>Thêm dịch vụ</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Thêm dịch vụ</DialogTitle>
          <DialogDescription>Điền những thông tin cần thiết để tạo dịch vụ.</DialogDescription>
        </DialogHeader>
        <ServiceForm isLoading={isLoading} onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
};

export default AddService;
