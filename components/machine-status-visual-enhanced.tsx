"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Activity,
  Thermometer,
  Zap,
  Clock,
  Timer,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  BarChart4,
  Download,
  Search,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface Machine {
  machine_id: number
  status: string
  health_score: number
  rul_days: number
  temperature: number
  energy_kw: number
  idle_time_pct: number
  vibration?: number
  load?: number
  rpm?: number
  current?: number
}

interface MachineStatusVisualEnhancedProps {
  machines: Machine[]
}

export function MachineStatusVisualEnhanced({ machines }: MachineStatusVisualEnhancedProps) {
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("id")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [showFilters, setShowFilters] = useState<boolean>(false)

  // Helper function to format numbers with max 2 decimal places
  const formatNumber = (value: number, maxDecimals = 2): string => {
    if (Number.isInteger(value)) {
      return value.toString()
    }
    return Number(value.toFixed(maxDecimals)).toString()
  }

  // Helper function to determine color based on value and thresholds
  const getColorClass = (value: number, goodThreshold: number, warningThreshold: number, inverse = false) => {
    if (inverse) {
      return value < goodThreshold ? "text-emerald-600" : value < warningThreshold ? "text-amber-600" : "text-red-600"
    } else {
      return value > goodThreshold ? "text-emerald-600" : value > warningThreshold ? "text-amber-600" : "text-red-600"
    }
  }

  // Get progress color based on value
  const getProgressColor = (value: number, goodThreshold: number, warningThreshold: number, inverse = false) => {
    if (inverse) {
      return value < goodThreshold ? "bg-emerald-500" : value < warningThreshold ? "bg-amber-500" : "bg-red-500"
    } else {
      return value > goodThreshold ? "bg-emerald-500" : value > warningThreshold ? "bg-amber-500" : "bg-red-500"
    }
  }

  // Get status badge color
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Healthy":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800"
      case "Warning":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800"
      case "Critical":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800"
    }
  }

  // Generate trend indicator
  const getTrendIndicator = (isPositive: boolean) => {
    return isPositive ? (
      <ArrowUpRight className="w-4 h-4 text-emerald-500" />
    ) : (
      <ArrowDownRight className="w-4 h-4 text-red-500" />
    )
  }

  // Generate mock trend data
  const generateTrendData = (metric: string, machine: Machine) => {
    const now = new Date()
    const data = []

    // Get base value based on metric
    let baseValue = 0
    switch (metric) {
      case "health":
        baseValue = machine.health_score
        break
      case "temperature":
        baseValue = machine.temperature
        break
      case "energy":
        baseValue = machine.energy_kw
        break
      case "idle":
        baseValue = machine.idle_time_pct
        break
      default:
        baseValue = 50
    }

    // Generate 24 hours of data with slight variations
    for (let i = 24; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000)
      const variation = (Math.random() - 0.5) * 5 // Random variation between -2.5 and 2.5

      data.push({
        time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        value: Math.max(0, baseValue + variation),
      })
    }

    return data
  }

  // Filter and sort machines
  const filteredMachines = machines
    .filter((machine) => {
      // Filter by status
      if (filterStatus !== "all" && machine.status !== filterStatus) {
        return false
      }

      // Filter by search term
      if (searchTerm && !`Machine ${machine.machine_id}`.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }

      return true
    })
    .sort((a, b) => {
      // Sort by selected criteria
      switch (sortBy) {
        case "id":
          return a.machine_id - b.machine_id
        case "health":
          return b.health_score - a.health_score
        case "rul":
          return b.rul_days - a.rul_days
        case "temperature":
          return a.temperature - b.temperature
        case "energy":
          return a.energy_kw - b.energy_kw
        case "idle":
          return a.idle_time_pct - b.idle_time_pct
        default:
          return a.machine_id - b.machine_id
      }
    })

  return (
    <Card className="shadow-sm border-gray-200 dark:border-gray-800">
      <CardHeader className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Machine Status Overview
          </CardTitle>

          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            {showFilters && (
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="text"
                    placeholder="Search machines..."
                    className="pl-8 h-9 w-full sm:w-[180px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button className="absolute right-2.5 top-2.5" onClick={() => setSearchTerm("")}>
                      <X className="h-4 w-4 text-gray-500" />
                    </button>
                  )}
                </div>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-[130px] h-9">
                    <SelectValue placeholder="Filter status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Healthy">Healthy</SelectItem>
                    <SelectItem value="Warning">Warning</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[130px] h-9">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="id">Machine ID</SelectItem>
                    <SelectItem value="health">Health Score</SelectItem>
                    <SelectItem value="rul">RUL Days</SelectItem>
                    <SelectItem value="temperature">Temperature</SelectItem>
                    <SelectItem value="energy">Energy</SelectItem>
                    <SelectItem value="idle">Idle Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-9" onClick={() => setShowFilters(!showFilters)}>
                {showFilters ? <X className="h-4 w-4 mr-1" /> : <Filter className="h-4 w-4 mr-1" />}
                {showFilters ? "Hide Filters" : "Filters"}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9">
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Export as CSV</DropdownMenuItem>
                  <DropdownMenuItem>Export as PDF</DropdownMenuItem>
                  <DropdownMenuItem>Export as Image</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" size="sm" className="h-9">
                <BarChart4 className="h-4 w-4 mr-1" />
                Compare
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {filteredMachines.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No machines match your filters</p>
            <Button
              variant="link"
              onClick={() => {
                setFilterStatus("all")
                setSearchTerm("")
              }}
            >
              Reset filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {filteredMachines.map((machine) => (
              <Dialog key={machine.machine_id}>
                <DialogTrigger asChild>
                  <div
                    className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                    onClick={() => setSelectedMachine(machine)}
                  >
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Machine {machine.machine_id}
                      </h3>
                      <Badge
                        variant="outline"
                        className={`text-xs font-medium px-3 py-1 ${getStatusBadgeClass(machine.status)}`}
                      >
                        {machine.status}
                      </Badge>
                    </div>

                    {/* Health Score */}
                    <div className="mb-5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Activity className="w-4 h-4 mr-2 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Health Score</span>
                        </div>
                        <div className="flex items-center">
                          <span className={`text-sm font-bold ${getColorClass(machine.health_score, 80, 60)}`}>
                            {formatNumber(machine.health_score)}%
                          </span>
                          {getTrendIndicator(Math.random() > 0.3)}
                        </div>
                      </div>
                      <div className="h-2 relative w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getProgressColor(machine.health_score, 80, 60)} rounded-full transition-all duration-500 ease-out`}
                          style={{ width: `${machine.health_score}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* RUL Days */}
                    <div className="mb-5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Timer className="w-4 h-4 mr-2 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">RUL</span>
                        </div>
                        <div className="flex items-center">
                          <span className={`text-sm font-bold ${getColorClass(machine.rul_days, 150, 90)}`}>
                            {formatNumber(machine.rul_days, 0)} days
                          </span>
                          {getTrendIndicator(Math.random() > 0.3)}
                        </div>
                      </div>
                      <div className="h-2 relative w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getProgressColor(machine.rul_days, 150, 90)} rounded-full transition-all duration-500 ease-out`}
                          style={{ width: `${Math.min(100, (machine.rul_days / 365) * 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Temperature */}
                    <div className="mb-5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Thermometer className="w-4 h-4 mr-2 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Temperature</span>
                        </div>
                        <div className="flex items-center">
                          <span className={`text-sm font-bold ${getColorClass(machine.temperature, 70, 75, true)}`}>
                            {formatNumber(machine.temperature)}°C
                          </span>
                          {getTrendIndicator(machine.temperature < 70)}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500 mr-2 w-8">50°C</span>
                        <div className="h-2 flex-grow relative bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getProgressColor(machine.temperature, 70, 75, true)} rounded-full transition-all duration-500 ease-out`}
                            style={{ width: `${Math.min(100, Math.max(0, ((machine.temperature - 50) / 50) * 100))}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 ml-2 w-10">100°C</span>
                      </div>
                    </div>

                    {/* Energy Consumption */}
                    <div className="mb-5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Zap className="w-4 h-4 mr-2 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Energy</span>
                        </div>
                        <div className="flex items-center">
                          <span className={`text-sm font-bold ${getColorClass(machine.energy_kw, 12, 15, true)}`}>
                            {formatNumber(machine.energy_kw)} kW
                          </span>
                          {getTrendIndicator(machine.energy_kw < 12)}
                        </div>
                      </div>
                      <div className="h-2 relative w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getProgressColor(machine.energy_kw, 12, 15, true)} rounded-full transition-all duration-500 ease-out`}
                          style={{ width: `${Math.min(100, (machine.energy_kw / 20) * 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Idle Time */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Idle Time</span>
                        </div>
                        <div className="flex items-center">
                          <span className={`text-sm font-bold ${getColorClass(machine.idle_time_pct, 15, 20, true)}`}>
                            {formatNumber(machine.idle_time_pct)}%
                          </span>
                          {getTrendIndicator(machine.idle_time_pct < 15)}
                        </div>
                      </div>
                      <div className="h-2 relative w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getProgressColor(machine.idle_time_pct, 15, 20, true)} rounded-full transition-all duration-500 ease-out`}
                          style={{ width: `${machine.idle_time_pct}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </DialogTrigger>

                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                      <span>Machine {machine.machine_id} Details</span>
                      <Badge className={getStatusBadgeClass(machine.status)}>{machine.status}</Badge>
                    </DialogTitle>
                    <DialogDescription>Detailed metrics and historical trends</DialogDescription>
                  </DialogHeader>

                  <Tabs defaultValue="overview">
                    <TabsList className="grid grid-cols-3 mb-4">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="trends">Trends</TabsTrigger>
                      <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Health Score */}
                        <Card>
                          <CardHeader className="py-3 px-4">
                            <CardTitle className="text-sm font-medium flex items-center">
                              <Activity className="w-4 h-4 mr-2" />
                              Health Score
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="py-2 px-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className={`text-3xl font-bold ${getColorClass(machine.health_score, 80, 60)}`}>
                                {formatNumber(machine.health_score)}%
                              </span>
                              <div className="flex items-center">
                                {getTrendIndicator(Math.random() > 0.3)}
                                <span className="text-sm text-gray-500 ml-1">vs last week</span>
                              </div>
                            </div>
                            <div className="h-3 relative w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${getProgressColor(machine.health_score, 80, 60)} rounded-full`}
                                style={{ width: `${machine.health_score}%` }}
                              ></div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* RUL */}
                        <Card>
                          <CardHeader className="py-3 px-4">
                            <CardTitle className="text-sm font-medium flex items-center">
                              <Timer className="w-4 h-4 mr-2" />
                              Remaining Useful Life
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="py-2 px-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className={`text-3xl font-bold ${getColorClass(machine.rul_days, 150, 90)}`}>
                                {formatNumber(machine.rul_days, 0)} days
                              </span>
                              <div className="flex items-center">
                                {getTrendIndicator(Math.random() > 0.3)}
                                <span className="text-sm text-gray-500 ml-1">vs last week</span>
                              </div>
                            </div>
                            <div className="h-3 relative w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${getProgressColor(machine.rul_days, 150, 90)} rounded-full`}
                                style={{ width: `${Math.min(100, (machine.rul_days / 365) * 100)}%` }}
                              ></div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Temperature */}
                        <Card>
                          <CardHeader className="py-3 px-4">
                            <CardTitle className="text-sm font-medium flex items-center">
                              <Thermometer className="w-4 h-4 mr-2" />
                              Temperature
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="py-2 px-4">
                            <div className="flex items-center justify-between mb-2">
                              <span
                                className={`text-3xl font-bold ${getColorClass(machine.temperature, 70, 75, true)}`}
                              >
                                {formatNumber(machine.temperature)}°C
                              </span>
                              <div className="flex items-center">
                                {getTrendIndicator(machine.temperature < 70)}
                                <span className="text-sm text-gray-500 ml-1">vs last hour</span>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <span className="text-xs text-gray-500 mr-2">50°C</span>
                              <div className="h-3 flex-grow relative bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${getProgressColor(machine.temperature, 70, 75, true)} rounded-full`}
                                  style={{
                                    width: `${Math.min(100, Math.max(0, ((machine.temperature - 50) / 50) * 100))}%`,
                                  }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-500 ml-2">100°C</span>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Energy */}
                        <Card>
                          <CardHeader className="py-3 px-4">
                            <CardTitle className="text-sm font-medium flex items-center">
                              <Zap className="w-4 h-4 mr-2" />
                              Energy Consumption
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="py-2 px-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className={`text-3xl font-bold ${getColorClass(machine.energy_kw, 12, 15, true)}`}>
                                {formatNumber(machine.energy_kw)} kW
                              </span>
                              <div className="flex items-center">
                                {getTrendIndicator(machine.energy_kw < 12)}
                                <span className="text-sm text-gray-500 ml-1">vs last hour</span>
                              </div>
                            </div>
                            <div className="h-3 relative w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${getProgressColor(machine.energy_kw, 12, 15, true)} rounded-full`}
                                style={{ width: `${Math.min(100, (machine.energy_kw / 20) * 100)}%` }}
                              ></div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Idle Time */}
                        <Card>
                          <CardHeader className="py-3 px-4">
                            <CardTitle className="text-sm font-medium flex items-center">
                              <Clock className="w-4 h-4 mr-2" />
                              Idle Time
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="py-2 px-4">
                            <div className="flex items-center justify-between mb-2">
                              <span
                                className={`text-3xl font-bold ${getColorClass(machine.idle_time_pct, 15, 20, true)}`}
                              >
                                {formatNumber(machine.idle_time_pct)}%
                              </span>
                              <div className="flex items-center">
                                {getTrendIndicator(machine.idle_time_pct < 15)}
                                <span className="text-sm text-gray-500 ml-1">vs last week</span>
                              </div>
                            </div>
                            <div className="h-3 relative w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${getProgressColor(machine.idle_time_pct, 15, 20, true)} rounded-full`}
                                style={{ width: `${machine.idle_time_pct}%` }}
                              ></div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Additional Metrics */}
                        <Card>
                          <CardHeader className="py-3 px-4">
                            <CardTitle className="text-sm font-medium">Additional Metrics</CardTitle>
                          </CardHeader>
                          <CardContent className="py-2 px-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-500">Vibration</p>
                                <p className="text-lg font-semibold">{formatNumber(machine.vibration || 0.5)}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Load</p>
                                <p className="text-lg font-semibold">{formatNumber(machine.load || 75)}%</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">RPM</p>
                                <p className="text-lg font-semibold">{formatNumber(machine.rpm || 2200, 0)}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Current</p>
                                <p className="text-lg font-semibold">{formatNumber(machine.current || 35)} A</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="trends">
                      <div className="space-y-6">
                        {/* Health Score Trend */}
                        <Card>
                          <CardHeader className="py-3 px-4">
                            <CardTitle className="text-sm font-medium flex items-center">
                              <Activity className="w-4 h-4 mr-2" />
                              Health Score Trend (24h)
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="py-2 px-4">
                            <div className="h-64">
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={generateTrendData("health", machine)}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                  <XAxis dataKey="time" />
                                  <YAxis domain={[0, 100]} />
                                  <Tooltip />
                                  <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#10b981"
                                    fill="#10b981"
                                    fillOpacity={0.2}
                                  />
                                </AreaChart>
                              </ResponsiveContainer>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Temperature Trend */}
                        <Card>
                          <CardHeader className="py-3 px-4">
                            <CardTitle className="text-sm font-medium flex items-center">
                              <Thermometer className="w-4 h-4 mr-2" />
                              Temperature Trend (24h)
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="py-2 px-4">
                            <div className="h-64">
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={generateTrendData("temperature", machine)}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                  <XAxis dataKey="time" />
                                  <YAxis domain={[50, 100]} />
                                  <Tooltip />
                                  <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#f59e0b"
                                    fill="#f59e0b"
                                    fillOpacity={0.2}
                                  />
                                </AreaChart>
                              </ResponsiveContainer>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="maintenance">
                      <div className="space-y-4">
                        <Card>
                          <CardHeader className="py-3 px-4">
                            <CardTitle className="text-sm font-medium">Maintenance History</CardTitle>
                          </CardHeader>
                          <CardContent className="py-2 px-4">
                            <div className="space-y-4">
                              <div className="flex items-start border-l-2 border-emerald-500 pl-4 pb-4">
                                <div>
                                  <p className="text-sm font-medium">Routine Maintenance</p>
                                  <p className="text-xs text-gray-500">2023-05-15</p>
                                  <p className="text-sm mt-1">Replaced filters and performed calibration</p>
                                </div>
                              </div>
                              <div className="flex items-start border-l-2 border-amber-500 pl-4 pb-4">
                                <div>
                                  <p className="text-sm font-medium">Minor Repair</p>
                                  <p className="text-xs text-gray-500">2023-03-22</p>
                                  <p className="text-sm mt-1">Fixed loose connection in control panel</p>
                                </div>
                              </div>
                              <div className="flex items-start border-l-2 border-blue-500 pl-4">
                                <div>
                                  <p className="text-sm font-medium">Major Overhaul</p>
                                  <p className="text-xs text-gray-500">2022-11-10</p>
                                  <p className="text-sm mt-1">Complete system overhaul and parts replacement</p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="py-3 px-4">
                            <CardTitle className="text-sm font-medium">Recommended Actions</CardTitle>
                          </CardHeader>
                          <CardContent className="py-2 px-4">
                            <div className="space-y-3">
                              {machine.status === "Critical" && (
                                <div className="bg-red-50 dark:bg-red-950 p-3 rounded-lg border border-red-200 dark:border-red-900">
                                  <p className="text-sm font-medium text-red-800 dark:text-red-300">
                                    Urgent Maintenance Required
                                  </p>
                                  <p className="text-xs text-red-700 dark:text-red-400 mt-1">
                                    Schedule immediate maintenance to prevent failure. Estimated downtime: 4-6 hours.
                                  </p>
                                </div>
                              )}

                              {machine.status === "Warning" && (
                                <div className="bg-amber-50 dark:bg-amber-950 p-3 rounded-lg border border-amber-200 dark:border-amber-900">
                                  <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                                    Maintenance Recommended
                                  </p>
                                  <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                                    Schedule maintenance within the next 7 days. Estimated downtime: 2-3 hours.
                                  </p>
                                </div>
                              )}

                              {machine.idle_time_pct > 15 && (
                                <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg border border-blue-200 dark:border-blue-900">
                                  <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                                    Optimize Idle Time
                                  </p>
                                  <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                                    High idle time detected. Consider workflow optimization to reduce energy waste.
                                  </p>
                                </div>
                              )}

                              {machine.status === "Healthy" && machine.idle_time_pct <= 15 && (
                                <div className="bg-emerald-50 dark:bg-emerald-950 p-3 rounded-lg border border-emerald-200 dark:border-emerald-900">
                                  <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                                    Routine Maintenance
                                  </p>
                                  <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
                                    Schedule next routine maintenance in {Math.floor(machine.rul_days / 3)} days.
                                  </p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
