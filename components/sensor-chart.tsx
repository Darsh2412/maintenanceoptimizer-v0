"use client"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, type TooltipProps } from "recharts"
import { format, parseISO } from "date-fns"

interface SensorDataPoint {
  timestamp: string
  value: number
}

interface SensorChartProps {
  data: SensorDataPoint[]
  metric: string
  machineId: number
}

export function SensorChart({ data, metric, machineId }: SensorChartProps) {
  const getMetricUnit = (metric: string) => {
    switch (metric) {
      case "temperature":
        return "°C"
      case "vibration":
        return ""
      case "load":
        return "%"
      case "rpm":
        return "RPM"
      case "current":
        return "A"
      default:
        return ""
    }
  }

  const getMetricColor = (metric: string) => {
    switch (metric) {
      case "temperature":
        return "#ef4444" // red
      case "vibration":
        return "#8b5cf6" // purple
      case "load":
        return "#f59e0b" // amber
      case "rpm":
        return "#3b82f6" // blue
      case "current":
        return "#10b981" // emerald
      default:
        return "#8884d8"
    }
  }

  const formatXAxis = (tickItem: string) => {
    try {
      return format(parseISO(tickItem), "HH:mm")
    } catch (e) {
      return tickItem
    }
  }

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      try {
        const formattedDate = format(parseISO(label), "MMM dd, yyyy HH:mm:ss")
        return (
          <div className="bg-white dark:bg-gray-800 p-2 sm:p-3 border border-gray-200 dark:border-gray-700 rounded shadow-md text-xs sm:text-sm">
            <p className="text-gray-500 dark:text-gray-400">{formattedDate}</p>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {`${metric.charAt(0).toUpperCase() + metric.slice(1)}: ${payload[0].value.toFixed(2)} ${getMetricUnit(metric)}`}
            </p>
          </div>
        )
      } catch (e) {
        return null
      }
    }
    return null
  }

  // Get domain for Y axis based on metric
  const getYAxisDomain = (metric: string) => {
    switch (metric) {
      case "temperature":
        return [50, 100]
      case "vibration":
        return [0, 3]
      case "load":
        return [40, 100]
      case "rpm":
        return [1000, 3500]
      case "current":
        return [20, 60]
      default:
        return [0, "auto"]
    }
  }

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatXAxis}
            stroke="#6B7280"
            fontSize={10}
            tickCount={5}
            tick={{ fontSize: "0.7rem" }}
          />
          <YAxis
            stroke="#6B7280"
            fontSize={10}
            domain={getYAxisDomain(metric)}
            tickFormatter={(value) => value.toFixed(0)}
            tick={{ fontSize: "0.7rem" }}
            width={30}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={getMetricColor(metric)}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
            name={metric.charAt(0).toUpperCase() + metric.slice(1)}
            animationDuration={500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
