import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogHeader } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import useToggle from "~/hooks/use-toggle";
import DiscountForm from "./discount-form";
import { api } from "~/server/utils/api";
import toast from "react-hot-toast";
import { type InsertDiscountRequest } from "~/server/db/validator-schema";

const AddDiscount = () => {
  const utils = api.useContext();
  const { onChange, value, onClose } = useToggle();
  const { mutateAsync, isLoading } = api.discount.create.useMutation({
    onSuccess: newData => {
      utils.discount.getMany.setData(undefined, old => {
        if (old) {
          return [...old, newData];
        }
        return [newData];
      });

      toast.success("Tạo khuyến mãi thành công!");
      onClose();
    },
    onError: () => {
      toast.error("Tạo khuyến mãi thất bại!");
    },
  });

  const onSubmit = async (values: InsertDiscountRequest) => {
    await mutateAsync(values);
  };

  return (
    <Dialog onOpenChange={onChange} open={value}>
      <DialogTrigger asChild>
        <Button size={"lg"}>Thêm khuyến mãi</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Thêm khuyến mãi</DialogTitle>
          <DialogDescription>Điền những thông tin cần thiết để tạo khuyến mãi.</DialogDescription>
        </DialogHeader>
        <DiscountForm onSubmit={onSubmit} isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  );
};

export default AddDiscount;
