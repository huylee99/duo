import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogDescription } from "~/components/ui/dialog";
import toast from "react-hot-toast";
import { type InsertDiscountRequest } from "~/server/db/validator-schema";
import { api } from "~/server/utils/api";
import DiscountForm from "./discount-form";

type EditDiscountProps = {
  defaultValues?: Partial<InsertDiscountRequest>;
  id: string;
  isOpen: boolean;
  setOpen: (value: boolean) => void;
};

const EditDiscount = (props: EditDiscountProps) => {
  const { setOpen, isOpen, id, defaultValues } = props;

  const utils = api.useContext();
  const { mutateAsync, isLoading } = api.discount.update.useMutation({
    onSuccess: newData => {
      utils.discount.getMany.setData(undefined, old => {
        if (old) {
          return old.map(discount => {
            if (discount.id === id) {
              return { ...discount, ...newData };
            }

            return discount;
          });
        }

        return old;
      });

      toast.success("Cập nhật khuyến mãi thành công");
      props.setOpen(false);
    },
    onError: () => {
      toast.error("Cập nhật khuyến mãi thất bại");
    },
  });

  const onSubmit = async (values: InsertDiscountRequest) => {
    await mutateAsync({ ...values, id: id });
  };

  return (
    <Dialog onOpenChange={setOpen} open={isOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Sửa khuyến mãi</DialogTitle>
          <DialogDescription>Điền những thông tin cần thiết để chỉnh sửa khuyến mãi.</DialogDescription>
        </DialogHeader>
        <DiscountForm defaultValues={defaultValues} isLoading={isLoading} onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
};

export default EditDiscount;
