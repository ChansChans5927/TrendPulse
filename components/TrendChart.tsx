import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendItem } from "../types";

interface TrendChartProps {
  data: TrendItem[];
  color: string;
}

const TrendChart: React.FC<TrendChartProps> = ({ data, color }) => {
  return (
    <div style={{ width: "100%", height: 256, marginTop: "1rem" }}>
      <ResponsiveContainer width="100%" height={256}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={true}
            vertical={false}
            stroke="#334155"
          />
          <XAxis type="number" hide domain={[0, 100]} />
          <YAxis
            type="category"
            dataKey="keyword"
            width={100}
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            interval={0}
          />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.05)" }}
            contentStyle={{
              backgroundColor: "#1e293b",
              borderColor: "#334155",
              color: "#f8fafc",
            }}
          />
          <Bar dataKey="volume" radius={[0, 4, 4, 0]} fill={color} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;
