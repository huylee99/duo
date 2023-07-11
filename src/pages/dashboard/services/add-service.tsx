import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import useToggle from "~/hooks/use-toggle";
import { type InsertRequest, insertServiceFormValidator } from "~/server/db/validator-schema";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "~/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel } from "~/components/ui/form";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { api } from "~/server/utils/api";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { Service } from "~/server/db/schema";

type Unit = InsertRequest["unit"];
type ApplySchedule = InsertRequest["apply_schedule"];

const defaultValues: Partial<InsertRequest> = {
  minimum_hour: 1,
  apply_schedule: "all-day",
  service_desc: "",
  service_name: "",
  unit: "time",
};

const AddService = () => {
  const { onChange, value, onClose } = useToggle();

  const { mutate, isLoading } = api.service.create.useMutation({
    onSuccess: () => {
      toast.success("Thêm dịch vụ thành công");
      form.reset(defaultValues);
      onClose();
    },
  });

  const form = useForm<InsertRequest>({
    resolver: zodResolver(insertServiceFormValidator),
    defaultValues,
    mode: "onChange",
  });

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

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(values => {
              mutate(values);
            })}
            className="space-y-3"
          >
            <FormField
              control={form.control}
              name="service_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên dịch vụ</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nhập tên dịch vụ" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="service_desc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} placeholder="Nhập mô tả" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="service_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá tiền</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={event => {
                        if (event.target.value !== "" && Number.isNaN(Number.parseInt(event.target.value))) {
                          return;
                        }
                        const value = event.target.value === "" ? 0 : Number.parseInt(event.target.value);
                        field.onChange(value);
                      }}
                      value={String(field.value ?? 0)}
                      placeholder="Ví dụ: 50000"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tính tiền theo</FormLabel>
                  <Select onValueChange={value => field.onChange(value as Unit)} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn tính tiền theo giờ hoặc game" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="game">Game</SelectItem>
                      <SelectItem value="time">Giờ</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="minimum_hour"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số {form.watch("unit") === "game" ? "game" : "giờ"} thuê tối thiểu</FormLabel>
                  <Select onValueChange={value => field.onChange(Number.parseInt(value))} value={String(field.value)}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Array.from({ length: 5 }, (_, index) => (
                        <SelectItem key={index} value={`${index + 1}`}>
                          {index + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="apply_schedule"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Khung giờ thuê</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={value => field.onChange(value as ApplySchedule)} value={field.value}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all-day" id="option-one" />
                        <Label htmlFor="option-one">Cả ngày</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="custom" id="option-two" />
                        <Label htmlFor="option-two">Tùy chỉnh</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch("apply_schedule") === "custom" && (
              <div className="flex items-center space-x-4">
                <FormField
                  control={form.control}
                  name="start_time"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Thời gian bắt đầu</FormLabel>
                      <Select onValueChange={value => field.onChange(Number.parseInt(value))} value={String(field.value)}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn giờ" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-96">
                          {Array.from({ length: 24 }, (_, index) => (
                            <SelectItem key={index} value={`${index}`}>
                              {index < 10 ? `0${index}` : index}:00
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="end_time"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Thời gian kết thúc</FormLabel>
                      <Select onValueChange={value => field.onChange(Number.parseInt(value))} value={String(field.value)}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn giờ" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-96">
                          {Array.from({ length: 24 }, (_, index) => (
                            <SelectItem key={index} value={`${index}`}>
                              {index < 10 ? `0${index}` : index}:00
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
            )}
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Tạo
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddService;
