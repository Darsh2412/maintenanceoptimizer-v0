"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

interface IdleTimeData {
  machine_id: number | string
  idle_hours: string
  idle_time_pct: number
  energy_waste_kwh: string
  potential_savings_usd: string
}

interface IdleTimeChartProps {
  data: IdleTimeData[]
}

export function IdleTimeChart({ data }: IdleTimeChartProps) {
  // Sort data by idle time percentage (descending)
  const sortedData = [...data].sort(
    (a, b) => Number.parseFloat(b.idle_time_pct.toString()) - Number.parseFloat(a.idle_time_pct.toString()),
  )

  // Transform data for the chart
  const chartData = sortedData.map((item) => ({
    machine: `Machine ${item.machine_id}`,
    idle_pct: Number.parseFloat(item.idle_time_pct.toString()),
    energy_waste: Number.parseFloat(item.energy_waste_kwh),
    savings: Number.parseFloat(item.potential_savings_usd),
  }))

  // Color based on idle time percentage
  const getBarColor = (idle_pct: number) => {
    if (idle_pct > 20) return "#ef4444" // red
    if (idle_pct > 15) return "#f59e0b" // amber
    return "#10b981" // green
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-2 sm:p-3 border border-gray-200 dark:border-gray-700 rounded shadow-md text-xs sm:text-sm">
          <p className="font-medium">{payload[0].payload.machine}</p>
          <p className="text-gray-700 dark:text-gray-300">Idle Time: {payload[0].value.toFixed(1)}%</p>
          <p className="text-gray-700 dark:text-gray-300">
            Energy Waste: {payload[0].payload.energy_waste.toFixed(1)} kWh
          </p>
          <p className="text-gray-700 dark:text-gray-300">Potential Savings: ${payload[0].payload.savings}</p>
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} horizontal={false} />
        <XAxis
          type="number"
          domain={[0, 100]}
          stroke="#6B7280"
          fontSize={10}
          tickFormatter={(value) => `${value}%`}
          tick={{ fontSize: "0.7rem" }}
        />
        <YAxis
          dataKey="machine"
          type="category"
          stroke="#6B7280"
          fontSize={10}
          tick={{ fontSize: "0.7rem" }}
          width={70}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="idle_pct" radius={[0, 4, 4, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getBarColor(entry.idle_pct)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
