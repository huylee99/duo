import { MoreHorizontal, Gem, Clock5 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "../ui/dropdown-menu";
import useToggle from "~/hooks/use-toggle";

const ServiceCard = () => {
  return (
    <div className="border border-border rounded-md shadow-sm p-4 bg-primary-foreground">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-primary font-medium">Chơi game cùng nhau</h2>
        <MoreDropdown />
      </div>
      <p className="text-sm text-muted-foreground mb-3">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione, odio?</p>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Gem className="w-4 h-4" /> <span className="text-sm">Giá tiền</span>
          </div>
          <span className="text-sm font-medium">20.000đ / giờ</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock5 className="w-4 h-4" /> <span className="text-sm">Thời gian</span>
          </div>
          <span className="text-sm font-medium">11:00 PM - 6:00 AM</span>
        </div>
      </div>
    </div>
  );
};

const MoreDropdown = () => {
  const { onChange, value } = useToggle();

  return (
    <DropdownMenu onOpenChange={onChange} open={value}>
      <DropdownMenuTrigger asChild>
        <MoreHorizontal className="w-4 h-4 text-primary hover:text-primary/70 cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Menu</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Chỉnh sửa
            <DropdownMenuShortcut>Ctrl + E</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Xóa
            <DropdownMenuShortcut>Ctrl + D</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ServiceCard;
