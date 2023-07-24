import { Button } from "~/components/ui/button";
import { Loader2 } from "lucide-react";
import { api } from "~/server/utils/api";
import { toast } from "react-hot-toast";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "~/components/ui/alert-dialog";

type DeleteServiceProps = {
  id: string;
  isOpen: boolean;
  setOpen: (value: boolean) => void;
};

const DeleteDiscount = (props: DeleteServiceProps) => {
  const { setOpen, isOpen, id } = props;
  const utils = api.useContext();

  const { mutate, isLoading } = api.discount.remove.useMutation({
    onSuccess: id => {
      utils.discount.getMany.setData(undefined, old => {
        if (old) {
          return old.filter(discount => discount.id !== id);
        }
        return old;
      });

      toast.success("Xóa thành công");
      setOpen(false);
    },
    onError: () => {
      toast.error("Xóa thất bại");
    },
  });

  return (
    <AlertDialog onOpenChange={setOpen} open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn chắc chắn muốn xóa dịch vụ này?</AlertDialogTitle>
          <AlertDialogDescription>Dịch vụ sẽ bị xóa vĩnh viễn và không thể hồi phục lại.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)} disabled={isLoading}>
            Hủy
          </AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={() => {
              mutate({ id: id });
            }}
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Xóa
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDiscount;
