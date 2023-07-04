import { type ColumnDef } from "@tanstack/react-table";
import { formatPrice } from "~/utils/format-price";
import usePagination from "~/hooks/use-pagination";
import DataTable from "../table/data-table";
import { Input } from "../ui/input";

type Transaction = {
  id: string;
  status: string;
  amount: number;
  date: string;
  type: string;
  description: string;
};

const columns: ColumnDef<Transaction>[] = [
  {
    header: "Mã giao dịch",
    id: "id",
    accessorKey: "id",
    cell: props => <span>{props.row.getValue("id")}</span>,
  },
  {
    id: "status",
    header: "Trạng thái",
    accessorKey: "status",
    cell: props => <span>{props.row.getValue("status")}</span>,
  },
  {
    id: "amount",
    header: "Số tiền",
    accessorKey: "amount",
    cell: props => <span>{formatPrice(props.row.getValue("amount"))}</span>,
  },
  {
    id: "date",
    header: "Ngày",
    accessorKey: "date",
    cell: props => <span>{props.row.getValue("date")}</span>,
  },
  {
    id: "type",
    header: "Loại giao dịch",
    accessorKey: "type",
    cell: props => <span>{props.row.getValue("type")}</span>,
  },
  {
    id: "description",
    header: "Mô tả",
    accessorKey: "description",
    cell: props => <span>{props.row.getValue("description")}</span>,
  },
];

const data: Transaction[] = Array.from({ length: 10 }, (_, i) => ({
  amount: 10000000,
  date: "2021-09-01",
  description: "Ngân hàng Vietcombank",
  id: String(i),
  status: "Thành công",
  type: "Nạp tiền",
}));

const TransactionHistoryTable = () => {
  const { pagination, setPagination } = usePagination();

  return (
    <>
      <Input className="mb-4 max-w-xs" placeholder="Tìm kiếm theo mã giao dịch" />
      <DataTable pagination={pagination} setPagination={setPagination} columns={columns} data={data} pageCount={data.length / 10} total={data.length} />
    </>
  );
};

export default TransactionHistoryTable;
