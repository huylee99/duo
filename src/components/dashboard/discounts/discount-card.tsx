import { type Discount } from "~/server/db/schema";
import { formatDate } from "~/utils/format-time";
import { Calendar, MoreHorizontal, ToggleRight } from "lucide-react";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import EditDiscount from "./edit-discount";
import DeleteDiscount from "./remove-discount";

type DiscountCardProps = {
  discount: Omit<Discount, "created_at" | "deleted_at">;
};

const DiscountCard = (props: DiscountCardProps) => {
  const { discount } = props;

  const startTime = discount.start_date !== null && formatDate(discount.start_date);
  const endTime = discount.end_date !== null && formatDate(discount.end_date);

  return (
    <div className="border border-border rounded-md shadow-sm p-4 bg-primary-foreground">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-primary font-medium">Giảm giá {discount.discount_percent}%</h2>
        <MoreDropdown discount={discount} />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <ToggleRight className="w-4 h-4 mr-2" /> <span className="text-sm">Trạng thái</span>
          </div>
          <span className="text-sm font-medium">{discount.is_active ? "Đang sử dụng" : "Chưa sử dụng"}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" /> <span className="text-sm">Thời gian áp dụng</span>
          </div>
          <span className="text-sm font-medium">
            {discount.apply_schedule === "custom" ? (
              <>
                {startTime} - {endTime}
              </>
            ) : (
              "Tự quản lý"
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

const MoreDropdown = (props: DiscountCardProps) => {
  const [open, setOpen] = useState<"edit" | "delete">();

  const setOpenEdit = (value: boolean) => {
    if (value) {
      setOpen("edit");
    } else {
      setOpen(undefined);
    }
  };

  const setOpenDelete = (value: boolean) => {
    if (value) {
      setOpen("delete");
    } else {
      setOpen(undefined);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <MoreHorizontal className="w-4 h-4 text-primary hover:text-primary/70 cursor-pointer" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Menu</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onSelect={() => {
                setOpen("edit");
              }}
            >
              Chỉnh sửa
              <DropdownMenuShortcut>Ctrl + E</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                setOpen("delete");
              }}
            >
              Xóa
              <DropdownMenuShortcut>Ctrl + D</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {open === "edit" && <EditDiscount id={props.discount.id} defaultValues={props.discount} setOpen={setOpenEdit} isOpen={open === "edit"} />}
      {open === "delete" && <DeleteDiscount id={props.discount.id} setOpen={setOpenDelete} isOpen={open === "delete"} />}
    </>
  );
};

export default DiscountCard;
