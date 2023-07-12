import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogHeader } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import useToggle from "~/hooks/use-toggle";
import DiscountForm from "./discount-form";

const AddDiscount = () => {
  const { onChange, value, onClose } = useToggle();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={"lg"}>Thêm khuyến mãi</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Thêm khuyến mãi</DialogTitle>
          <DialogDescription>Điền những thông tin cần thiết để tạo khuyến mãi.</DialogDescription>
        </DialogHeader>
        <DiscountForm />
      </DialogContent>
    </Dialog>
  );
};

export default AddDiscount;
