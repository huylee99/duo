import { Area, AreaChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis, TooltipProps, LegendProps } from "recharts";
import { useTheme } from "next-themes";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const CustomTooltip = ({ active, payload, label }: TooltipProps<string, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg bg-background p-4 shadow-md">
        <h4 className="text-muted-foreground mb-2">Ngày 12 tháng 8 năm 2023</h4>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-red-400"></div> <span>Chi tiêu: {payload[0].value} đ</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-green-400"></div> <span>Thu nhập: {payload[1].value} đ</span>
        </div>
      </div>
    );
  }
};

const CustomLegend = (_: LegendProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <ul className="flex items-center space-x-2">
        <li className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-red-400"></div> <span>Chi tiêu</span>
        </li>
        <li className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-green-400"></div> <span>Thu nhập</span>
        </li>
      </ul>

      <Tabs defaultValue="weekly">
        <TabsList>
          <TabsTrigger value="weekly">Tuần</TabsTrigger>
          <TabsTrigger value="monthly">Tháng</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

const Chart = ({ width, height }: { width: number; height: number }) => {
  const { resolvedTheme } = useTheme();

  return (
    <AreaChart data={data} width={width} height={height}>
      <defs>
        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#40FEAE" stopOpacity={0.6} />
          <stop offset="95%" stopColor="#40FEAE" stopOpacity={0} />
        </linearGradient>
        <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#f87171" stopOpacity={0.6} />
          <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
        </linearGradient>
      </defs>
      <Legend layout="horizontal" verticalAlign="top" align="center" iconType="circle" content={<CustomLegend />} />
      <XAxis dataKey="name" tickLine={false} tick={{ fill: "#a3a3a3", fontSize: 14 }} axisLine={false} />
      <YAxis tickLine={false} tick={{ fill: "#a3a3a3", fontSize: 14 }} axisLine={false} />

      <CartesianGrid strokeDasharray="3 3" stroke={resolvedTheme === "dark" ? "#2e2d2d" : "#e1e1e6"} />

      <Tooltip isAnimationActive={false} content={CustomTooltip} />

      <Area type="natural" dataKey="uv" stroke="#4ade80" strokeWidth={2} fillOpacity={1} fill="url(#colorUv)" />
      <Area type="natural" dataKey="pv" stroke="#f87171" strokeWidth={2} fillOpacity={1} fill="url(#colorPv)" />
    </AreaChart>
  );
};

export default Chart;
