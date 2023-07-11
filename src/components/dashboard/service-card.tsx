import { MoreHorizontal, Gem, Clock5 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "../ui/dropdown-menu";
import useToggle from "~/hooks/use-toggle";
import { Service } from "~/server/db/schema";
import { formatPrice } from "~/utils/format-price";
import { formatTime } from "~/utils/format-time";

type ServiceCardProps = {
  service: Service;
};

const ServiceCard = (props: ServiceCardProps) => {
  const { service } = props;

  const startTime = service.start_time !== null && formatTime(service.start_time);
  const endTime = service.end_time !== null && formatTime(service.end_time);

  const schedule = service.apply_schedule === "all-day" ? "Cả ngày" : `${startTime} - ${endTime}`;

  return (
    <div className="border border-border rounded-md shadow-sm p-4 bg-primary-foreground">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-primary font-medium">{service.service_name}</h2>
        <MoreDropdown />
      </div>
      <p className="text-sm text-muted-foreground mb-3">{!service.service_desc ? "Chưa cập nhật" : service.service_desc}</p>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Gem className="w-4 h-4" /> <span className="text-sm">Giá tiền</span>
          </div>
          <span className="text-sm font-medium">
            {formatPrice(service.service_price)} / {service.unit === "game" ? "game" : "giờ"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock5 className="w-4 h-4" /> <span className="text-sm">Thời gian</span>
          </div>

          <span className="text-sm font-medium">{schedule}</span>
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
