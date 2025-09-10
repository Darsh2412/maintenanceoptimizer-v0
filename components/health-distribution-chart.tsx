"use client"

import { useMemo } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts"
import { Card, CardContent } from "@/components/ui/card"

interface HealthDistributionChartProps {
  dashboardSummary: {
    machine_health_distribution?: {
      excellent?: number
      good?: number
      fair?: number
      poor?: number
      critical?: number
    }
  }
}

export function HealthDistributionChart({ dashboardSummary }: HealthDistributionChartProps) {
  const chartData = useMemo(() => {
    const healthDistribution = dashboardSummary.machine_health_distribution || {
      excellent: 0,
      good: 0,
      fair: 0,
      poor: 0,
      critical: 0,
    }

    return [
      {
        name: "Excellent",
        value: healthDistribution.excellent || 0,
        color: "#10b981", // green
      },
      {
        name: "Good",
        value: healthDistribution.good || 0,
        color: "#22c55e", // lighter green
      },
      {
        name: "Fair",
        value: healthDistribution.fair || 0,
        color: "#facc15", // yellow
      },
      {
        name: "Poor",
        value: healthDistribution.poor || 0,
        color: "#f97316", // orange
      },
      {
        name: "Critical",
        value: healthDistribution.critical || 0,
        color: "#ef4444", // red
      },
    ]
  }, [dashboardSummary])

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card className="border shadow-sm">
          <CardContent className="p-2">
            <p className="text-sm font-medium">{`${payload[0].name}: ${payload[0].value} machines`}</p>
          </CardContent>
        </Card>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
