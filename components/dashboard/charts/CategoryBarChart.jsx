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

export default function CategoryBarChart({ data }) {
  if (!data || data.length === 0) {
    return <EmptyChartState message="No categories yet." />;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 24, bottom: 4, left: 0 }}
        barCategoryGap={14}
      >
        <CartesianGrid
          horizontal={false}
          stroke={CHART_COLORS.grid}
          strokeDasharray="3 3"
        />
        <XAxis
          type="number"
          allowDecimals={false}
          tick={{ fill: CHART_COLORS.mutedText, fontSize: 12 }}
          axisLine={{ stroke: CHART_COLORS.axis }}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={110}
          tick={{ fill: CHART_COLORS.secondaryText, fontSize: 12 }}
          axisLine={{ stroke: CHART_COLORS.axis }}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: "rgba(11,11,11,0.04)" }}
          content={<ChartTooltip formatter={(v) => `${v} products`} />}
        />
        <Bar dataKey="count" name="Products" radius={[0, 4, 4, 0]} maxBarSize={22}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={CHART_COLORS.series1} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
