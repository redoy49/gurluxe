"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartTooltip from "./ChartTooltip";
import EmptyChartState from "./EmptyChartState";
import { CHART_COLORS } from "./chartTheme";

function truncate(name, max = 14) {
  return name.length > max ? `${name.slice(0, max - 1)}…` : name;
}

export default function StockSoldChart({ data }) {
  if (!data || data.length === 0) {
    return <EmptyChartState message="No products yet." />;
  }

  const chartData = data.map((d) => ({ ...d, shortName: truncate(d.name) }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={chartData}
        margin={{ top: 4, right: 8, bottom: 8, left: 0 }}
        barGap={4}
      >
        <CartesianGrid
          vertical={false}
          stroke={CHART_COLORS.grid}
          strokeDasharray="3 3"
        />
        <XAxis
          dataKey="shortName"
          tick={{ fill: CHART_COLORS.mutedText, fontSize: 11 }}
          axisLine={{ stroke: CHART_COLORS.axis }}
          tickLine={false}
          interval={0}
          angle={-25}
          textAnchor="end"
          height={56}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fill: CHART_COLORS.mutedText, fontSize: 12 }}
          axisLine={{ stroke: CHART_COLORS.axis }}
          tickLine={false}
          width={32}
        />
        <Tooltip
          cursor={{ fill: "rgba(11,11,11,0.04)" }}
          content={
            <ChartTooltip
              formatter={(v) => `${v} units`}
            />
          }
          labelFormatter={(_, payload) => payload?.[0]?.payload?.name}
        />
        <Legend
          wrapperStyle={{ fontSize: 12, color: CHART_COLORS.secondaryText }}
          iconType="circle"
          iconSize={8}
        />
        <Bar
          dataKey="stock"
          name="In stock"
          fill={CHART_COLORS.series1}
          radius={[4, 4, 0, 0]}
          maxBarSize={18}
        />
        <Bar
          dataKey="sold"
          name="Sold"
          fill={CHART_COLORS.series2}
          radius={[4, 4, 0, 0]}
          maxBarSize={18}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
