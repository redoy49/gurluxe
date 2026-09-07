"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartTooltip from "./ChartTooltip";
import EmptyChartState from "./EmptyChartState";
import { CHART_COLORS } from "./chartTheme";

export default function CustomerGrowthChart({ data }) {
  if (!data || data.length === 0) {
    return <EmptyChartState message="No customers yet." />;
  }

  // A trend line over a single month reads as a slope that isn't there.
  if (data.length < 2) {
    const point = data[0];
    return (
      <div className="flex h-[220px] flex-col items-center justify-center gap-1 text-center">
        <p className="text-3xl font-bold text-gray-900">{point.total}</p>
        <p className="text-sm text-gray-500">
          customer{point.total === 1 ? "" : "s"} signed up in {point.month}
        </p>
        <p className="mt-2 text-xs text-gray-400">
          Trend will appear once signups span more than one month.
        </p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="customerGrowthFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CHART_COLORS.series1} stopOpacity={0.25} />
            <stop offset="100%" stopColor={CHART_COLORS.series1} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke={CHART_COLORS.grid} strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          tick={{ fill: CHART_COLORS.mutedText, fontSize: 12 }}
          axisLine={{ stroke: CHART_COLORS.axis }}
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fill: CHART_COLORS.mutedText, fontSize: 12 }}
          axisLine={{ stroke: CHART_COLORS.axis }}
          tickLine={false}
          width={28}
        />
        <Tooltip
          cursor={{ stroke: CHART_COLORS.axis, strokeDasharray: "3 3" }}
          content={<ChartTooltip formatter={(v) => `${v} total`} />}
        />
        <Area
          type="monotone"
          dataKey="total"
          name="Customers"
          stroke={CHART_COLORS.series1}
          strokeWidth={2}
          fill="url(#customerGrowthFill)"
          dot={{ r: 4, fill: CHART_COLORS.series1, strokeWidth: 0 }}
          activeDot={{ r: 5 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
