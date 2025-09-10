"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface DailyEnergyData {
  date: string
  energy_kwh: number
  machine_id: number
}

interface MachineEnergyData {
  machine_id: number
  daily_energy: DailyEnergyData[]
}

interface EnergyConsumptionChartProps {
  data: MachineEnergyData[]
}

export function EnergyConsumptionChart({ data }: EnergyConsumptionChartProps) {
  // Transform data for stacked bar chart
  const transformData = () => {
    const dateMap = new Map()

    // Initialize with all dates
    if (data[0] && data[0].daily_energy) {
      data[0].daily_energy.forEach((day) => {
        dateMap.set(day.date, { date: day.date })
      })
    }

    // Add machine data for each date
    data.forEach((machine) => {
      machine.daily_energy.forEach((day) => {
        const existingDay = dateMap.get(day.date)
        if (existingDay) {
          existingDay[`Machine ${machine.machine_id}`] = day.energy_kwh
        }
      })
    })

    return Array.from(dateMap.values())
  }

  const chartData = transformData()

  // Generate colors for each machine
  const getBarColor = (index: number) => {
    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"]
    return colors[index % colors.length]
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
        <XAxis dataKey="date" stroke="#6B7280" fontSize={10} tick={{ fontSize: "0.7rem" }} />
        <YAxis
          stroke="#6B7280"
          fontSize={10}
          tickFormatter={(value) => `${value} kWh`}
          tick={{ fontSize: "0.7rem" }}
          width={50}
        />
        <Tooltip formatter={(value) => [`${value.toFixed(1)} kWh`, ""]} contentStyle={{ fontSize: "12px" }} />
        <Legend wrapperStyle={{ fontSize: "12px" }} />
        {data.map((machine, index) => (
          <Bar
            key={machine.machine_id}
            dataKey={`Machine ${machine.machine_id}`}
            stackId="a"
            fill={getBarColor(index)}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}
