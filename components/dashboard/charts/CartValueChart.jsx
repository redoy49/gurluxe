"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartTooltip from "./ChartTooltip";
import EmptyChartState from "./EmptyChartState";
import { CHART_COLORS } from "./chartTheme";

function truncate(name, max = 22) {
  return name.length > max ? `${name.slice(0, max - 1)}…` : name;
}

export default function CartValueChart({ data }) {
  if (!data || data.length === 0) {
    return <EmptyChartState message="Carts are empty right now." />;
  }

  const chartData = data.map((d) => ({ ...d, shortName: truncate(d.name) }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 4, right: 24, bottom: 4, left: 0 }}
        barCategoryGap={16}
      >
        <CartesianGrid horizontal={false} stroke={CHART_COLORS.grid} strokeDasharray="3 3" />
        <XAxis
          type="number"
          tick={{ fill: CHART_COLORS.mutedText, fontSize: 12 }}
          axisLine={{ stroke: CHART_COLORS.axis }}
          tickLine={false}
          tickFormatter={(v) => `৳${v}`}
        />
        <YAxis
          type="category"
          dataKey="shortName"
          width={140}
          tick={{ fill: CHART_COLORS.secondaryText, fontSize: 12 }}
          axisLine={{ stroke: CHART_COLORS.axis }}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: "rgba(11,11,11,0.04)" }}
          content={
            <ChartTooltip
              formatter={(v, entry) =>
                entry.dataKey === "value" ? `৳ ${v.toLocaleString()}` : v
              }
            />
          }
          labelFormatter={(_, payload) => payload?.[0]?.payload?.name}
        />
        <Bar dataKey="value" name="Cart value" radius={[0, 4, 4, 0]} maxBarSize={22}>
          {chartData.map((entry) => (
            <Cell key={entry.name} fill={CHART_COLORS.series1} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
