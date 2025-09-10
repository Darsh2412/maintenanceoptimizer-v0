"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Zap } from "lucide-react"

interface Alert {
  type: string
  machine_id: number
  message: string
  timestamp: string
  priority: string
}

interface AlertsListProps {
  alerts: Alert[]
}

export function AlertsList({ alerts }: AlertsListProps) {
  const getAlertColor = (priority: string, type: string) => {
    if (type === "energy") {
      return "border-yellow-500 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800"
    }

    switch (priority) {
      case "high":
        return "border-red-500 bg-red-50 dark:bg-red-950 dark:border-red-800"
      case "medium":
        return "border-yellow-500 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800"
      case "low":
        return "border-blue-500 bg-blue-50 dark:bg-blue-950 dark:border-blue-800"
      default:
        return "border-gray-500 bg-gray-50 dark:bg-gray-900 dark:border-gray-700"
    }
  }

  const getPriorityBadgeColor = (priority: string, type: string) => {
    if (type === "energy") {
      return "bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    }

    switch (priority) {
      case "high":
        return "bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "medium":
        return "bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "low":
        return "bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default:
        return "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  const getAlertIcon = (type: string) => {
    if (type === "energy") {
      return <Zap className="w-4 h-4 mr-2 text-yellow-500" />
    }
    return null
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-2 px-4 py-3 sm:px-6 sm:py-4">
        <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
        <CardTitle className="text-base sm:text-lg">Active Alerts</CardTitle>
      </CardHeader>
      <CardContent className="px-3 py-2 sm:px-6 sm:py-4">
        <div className="space-y-2 sm:space-y-3">
          {alerts.slice(0, 5).map((alert, index) => (
            <div key={index} className={`border-l-4 p-2 sm:p-4 rounded ${getAlertColor(alert.priority, alert.type)}`}>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                <div>
                  <p className="text-sm sm:text-base font-medium dark:text-gray-200 flex items-center">
                    {getAlertIcon(alert.type)}
                    {alert.message}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">{alert.timestamp}</p>
                </div>
                <span
                  className={`mt-2 sm:mt-0 px-2 py-1 rounded text-xs font-medium ${getPriorityBadgeColor(alert.priority, alert.type)}`}
                >
                  {alert.type === "energy" ? "ENERGY" : alert.priority.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
          {alerts.length === 0 && <p className="text-gray-500 dark:text-gray-400 text-center py-4">No active alerts</p>}
        </div>
      </CardContent>
    </Card>
  )
}
