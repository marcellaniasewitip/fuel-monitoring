import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { time: "00:00", level: 8500, temp: 32 },
  { time: "04:00", level: 8480, temp: 28 },
  { time: "08:00", level: 8200, temp: 34 },
  { time: "10:00", level: 7900, temp: 38 },
  { time: "12:00", level: 7600, temp: 42 },
  { time: "14:00", level: 7400, temp: 40 },
  { time: "16:00", level: 7100, temp: 37 },
  { time: "18:00", level: 7050, temp: 33 },
  { time: "20:00", level: 7020, temp: 30 },
  { time: "22:00", level: 6800, temp: 29 },
];

const FuelChart = () => {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          Fuel Level — 24h Trend
        </h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-secondary text-secondary-foreground">
          TANK-01
        </span>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fuelGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(200, 80%, 50%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(200, 80%, 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 20%)" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fill: "hsl(220, 10%, 55%)", fontFamily: "JetBrains Mono" }}
              axisLine={{ stroke: "hsl(220, 15%, 20%)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "hsl(220, 10%, 55%)", fontFamily: "JetBrains Mono" }}
              axisLine={{ stroke: "hsl(220, 15%, 20%)" }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(220, 18%, 13%)",
                border: "1px solid hsl(220, 15%, 20%)",
                borderRadius: "6px",
                fontFamily: "JetBrains Mono",
                fontSize: "11px",
              }}
            />
            <Area
              type="monotone"
              dataKey="level"
              stroke="hsl(200, 80%, 50%)"
              fill="url(#fuelGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FuelChart;
