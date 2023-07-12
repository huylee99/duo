import { FormField, FormItem, FormLabel, FormControl, Form } from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import { CalendarIcon, Loader2 } from "lucide-react";
import { DialogFooter } from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type InsertDiscountRequest, insertDiscountRequestSchema } from "~/server/db/validator-schema";
import { Switch } from "~/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Calendar } from "~/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "~/components/ui/popover";
import { cn } from "~/lib/utils";

type ApplySchedule = InsertDiscountRequest["apply_schedule"];

const baseDefaultValues: Partial<InsertDiscountRequest> = {
  discount_percent: 5,
  is_active: false,
};

type DiscountFormProps = {
  defaultValues?: Partial<InsertDiscountRequest>;
  onSubmit?: (values: InsertDiscountRequest) => Promise<void> | void;
  isLoading?: boolean;
};

const DiscountForm = (props: DiscountFormProps) => {
  const { defaultValues = baseDefaultValues, isLoading, onSubmit } = props;

  const form = useForm<InsertDiscountRequest>({
    defaultValues,
    resolver: zodResolver(insertDiscountRequestSchema),
    mode: "onChange",
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async values => {
          try {
            form.reset();
          } catch (error) {
            console.log(error);
          }
        })}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="discount_percent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phần trăm khuyến mãi (%)</FormLabel>
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
                  placeholder="Nhập phần trăm khuyến mãi"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between space-y-0">
              <FormLabel className="mb-0">Kích hoạt khuyến mãi</FormLabel>
              <FormControl>
                <Switch className="space-y-0" checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="apply_schedule"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between space-y-0">
              <FormLabel>Thời gian khuyến mãi</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={value => field.onChange(value as ApplySchedule)} value={field.value} className="flex items-center">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="option-one" />
                    <Label htmlFor="option-one" className="font-normal">
                      Tự quản lý
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="option-two" />
                    <Label htmlFor="option-two" className="font-normal">
                      Tùy chỉnh
                    </Label>
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
              name="start_date"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Thời gian bắt đầu</FormLabel>
                  <Popover modal={true}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                          {field.value ? field.value.toLocaleDateString("vi-VN") : <span>Chọn ngày bắt đầu</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value ? field.value : undefined} onSelect={field.onChange} disabled={(date: Date) => date > new Date() || date < new Date("1900-01-01")} initialFocus />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="end_date"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Thời gian kết thúc</FormLabel>
                  <Popover modal={true}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                          {field.value ? field.value.toLocaleDateString("vi-VN") : <span>Chọn ngày kết thúc</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value ? field.value : undefined} onSelect={field.onChange} disabled={(date: Date) => date > new Date() || date < new Date("1900-01-01")} initialFocus />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
          </div>
        )}
        <DialogFooter>
          <Button type="submit" disabled={isLoading} size={"lg"} className="h-9 mt-4">
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Lưu
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default DiscountForm;
