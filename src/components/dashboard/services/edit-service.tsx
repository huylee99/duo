import { type InsertRequest } from "~/server/db/validator-schema";
import { api } from "~/server/utils/api";
import { toast } from "react-hot-toast";
import ServiceForm from "./service-form";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader } from "~/components/ui/dialog";

type EditServiceProps = {
  defaultValues?: Partial<InsertRequest>;
  id: string;
  isOpen: boolean;
  setOpen: (value: boolean) => void;
};

const EditService = (props: React.PropsWithChildren<EditServiceProps>) => {
  const { setOpen, isOpen, id, defaultValues } = props;

  const utils = api.useContext();
  const { mutateAsync, isLoading } = api.service.update.useMutation({
    onSuccess: newData => {
      utils.service.getMany.setData(undefined, old => {
        if (old) {
          return old.map(service => {
            if (service.id === id) {
              return { ...service, ...newData };
            }

            return service;
          });
        }

        return old;
      });

      toast.success("Cập nhật dịch vụ thành công");
      props.setOpen(false);
    },
    onError: () => {
      toast.error("Cập nhật dịch vụ thất bại");
    },
  });

  const onSubmit = async (values: InsertRequest) => {
    await mutateAsync({ ...values, id: id });
  };

  return (
    <Dialog onOpenChange={setOpen} open={isOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Sửa dịch vụ</DialogTitle>
          <DialogDescription>Điền những thông tin cần thiết để chỉnh sửa dịch vụ.</DialogDescription>
        </DialogHeader>
        <ServiceForm defaultValues={defaultValues} isLoading={isLoading} onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
};

export default EditService;
