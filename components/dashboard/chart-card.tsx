"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

export type ChartDatum = { label: string; value: number }

const COLORS = ["#5C53FE", "#8F88FF", "#22C55E", "#F59E0B", "#EF4444", "#38BDF8"]

export function BarChartCard({ data, height = 240 }: { data: ChartDatum[]; height?: number }) {
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: -20 }}>
          <CartesianGrid stroke="#ffffff10" vertical={false} />
          <XAxis dataKey="label" tick={{ fill: "#6E6E78", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#6E6E78", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: "#ffffff08" }}
            contentStyle={{ background: "#141418", border: "1px solid #ffffff20", borderRadius: 8, color: "#EDEDEF" }}
          />
          <Bar dataKey="value" fill="#5C53FE" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function PieChartCard({ data, height = 240 }: { data: ChartDatum[]; height?: number }) {
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="label" innerRadius={55} outerRadius={85} paddingAngle={3}>
            {data.map((entry, index) => (
              <Cell key={entry.label} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ background: "#141418", border: "1px solid #ffffff20", borderRadius: 8, color: "#EDEDEF" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
