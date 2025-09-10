"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface EfficiencyData {
  machine_id: number
  avg_efficiency: number
}

interface EfficiencyChartProps {
  data: EfficiencyData[]
}

export function EfficiencyChart({ data }: EfficiencyChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
        <XAxis
          dataKey="machine_id"
          stroke="#6B7280"
          fontSize={10}
          tickFormatter={(value) => `M${value}`}
          tick={{ fontSize: "0.7rem" }}
        />
        <YAxis
          stroke="#6B7280"
          fontSize={10}
          domain={[0, 100]}
          tickFormatter={(value) => `${value}%`}
          tick={{ fontSize: "0.7rem" }}
          width={30}
        />
        <Tooltip
          formatter={(value) => [`${value}%`, "Efficiency"]}
          labelFormatter={(value) => `Machine ${value}`}
          contentStyle={{ fontSize: "12px" }}
        />
        <Bar dataKey="avg_efficiency" fill="#8884d8" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
