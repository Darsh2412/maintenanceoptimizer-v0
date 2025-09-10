"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "@/contexts/session-context"

// Enhanced machine interface with plant and type
interface EnhancedMachine {
  machine_id: number
  plant: string
  type: "Slitter" | "Inspection"
  health_score: number
  status: string
  temperature: number
  vibration: number
  load: number
  rpm: number
  current: number
  energy_kw: number
  idle_time_pct: number
  rul_days: number
}

// Enhanced mock data generator with realistic variations and energy data
export function useMockData() {
  const { selectedPlant, selectedMachineType, simulatedMode, currentUser } = useSession()

  const [dashboardSummary, setDashboardSummary] = useState({
    total_machines: 14,
    healthy_machines: 8,
    warning_machines: 3,
    critical_machines: 3,
    avg_health_score: 78.5,
    recent_anomalies: 2,
    total_batches: 45,
    avg_efficiency: 85.2,
    total_defects: 12,
    total_energy_consumption: 4250, // kWh
    potential_energy_savings: 680, // kWh
    estimated_roi_days: 145, // days
    last_updated: new Date().toLocaleString(),
  })

  const [baseMachineStatus, setBaseMachineStatus] = useState<EnhancedMachine[]>([])
  const [machineStatus, setMachineStatus] = useState<EnhancedMachine[]>([])
  const [alerts, setAlerts] = useState([])
  const [sensorHistory, setSensorHistory] = useState([])
  const [anomalies, setAnomalies] = useState([])
  const [productionInsights, setProductionInsights] = useState({})
  const [rulPrediction, setRulPrediction] = useState({})
  const [energyData, setEnergyData] = useState({})
  const [selectedMachineId, setSelectedMachineId] = useState(1)
  const [selectedMetric, setSelectedMetric] = useState("temperature")

  // Generate realistic sensor data with patterns and variations
  const generateSensorData = useCallback((machineId = 1, metric = "temperature", days = 7) => {
    const now = new Date()
    const data = []

    // Define base values and ranges for different metrics
    const metricConfig = {
      temperature: { base: 65, amplitude: 5, noise: 2, unit: "°C", trend: 0.05 },
      vibration: { base: 0.5, amplitude: 0.2, noise: 0.1, unit: "", trend: 0.01 },
      load: { base: 75, amplitude: 10, noise: 5, unit: "%", trend: 0.1 },
      rpm: { base: 2200, amplitude: 200, noise: 50, unit: "RPM", trend: 0.5 },
      current: { base: 35, amplitude: 5, noise: 2, unit: "A", trend: 0.02 },
      energy: { base: 12, amplitude: 4, noise: 1, unit: "kW", trend: 0.03 },
    }

    // Adjust base values based on machine health
    const machineHealthFactor = {
      1: 1.0,
      2: 1.0,
      3: 1.2,
      4: 1.0,
      5: 1.5,
      6: 1.0,
      7: 1.1,
      8: 1.0,
      9: 1.3,
      10: 1.0,
      11: 1.2,
      12: 1.0,
      13: 1.4,
      14: 1.0,
    }

    const config = metricConfig[metric]

    // Generate data points for each hour
    for (let i = 0; i < days * 24; i++) {
      const timestamp = new Date(now.getTime() - (days * 24 - i) * 3600000)

      // Time-based patterns
      const hourOfDay = timestamp.getHours()
      const dayOfWeek = timestamp.getDay()

      // Working hours pattern (higher during working hours)
      const workingHoursFactor = hourOfDay >= 8 && hourOfDay <= 18 ? 1.0 : 0.7

      // Weekend pattern (lower on weekends)
      const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.8 : 1.0

      // Daily cycle pattern (sinusoidal)
      const dailyCycle = Math.sin((hourOfDay / 24) * Math.PI * 2)

      // Progressive trend (slight increase over time)
      const trend = (i / (days * 24)) * config.trend * (machineHealthFactor[machineId] || 1.0)

      // Random noise
      const noise = (Math.random() - 0.5) * config.noise

      // Occasional spikes (0.5% chance)
      const spike = Math.random() < 0.005 ? Math.random() * config.amplitude : 0

      // Calculate final value
      let value =
        config.base * (machineHealthFactor[machineId] || 1.0) +
        dailyCycle * config.amplitude * workingHoursFactor * weekendFactor +
        trend +
        noise +
        spike

      // Ensure value stays within reasonable bounds
      if (metric === "temperature") {
        value = Math.max(50, Math.min(100, value))
      } else if (metric === "vibration") {
        value = Math.max(0.1, Math.min(3.0, value))
      } else if (metric === "load") {
        value = Math.max(40, Math.min(95, value))
      } else if (metric === "rpm") {
        value = Math.max(1000, Math.min(3500, value))
      } else if (metric === "current") {
        value = Math.max(20, Math.min(60, value))
      } else if (metric === "energy") {
        value = Math.max(5, Math.min(25, value))
      }

      data.push({
        timestamp: timestamp.toISOString(),
        value: value,
      })
    }

    return data
  }, [])

  // Generate machine status with realistic health scores and energy data
  const generateBaseMachineStatus = useCallback((): EnhancedMachine[] => {
    const machines: EnhancedMachine[] = [
      // Plant A - 4 machines (2 Slitter, 2 Inspection)
      {
        machine_id: 1,
        plant: "Plant A",
        type: "Slitter",
        health_score: 90,
        status: "Healthy",
        temperature: 65,
        vibration: 0.3,
        load: 75,
        rpm: 2200,
        current: 32,
        energy_kw: 10.2,
        idle_time_pct: 12,
        rul_days: 180,
      },
      {
        machine_id: 2,
        plant: "Plant A",
        type: "Slitter",
        health_score: 85,
        status: "Healthy",
        temperature: 68,
        vibration: 0.4,
        load: 80,
        rpm: 2150,
        current: 35,
        energy_kw: 11.5,
        idle_time_pct: 15,
        rul_days: 165,
      },
      {
        machine_id: 3,
        plant: "Plant A",
        type: "Inspection",
        health_score: 71,
        status: "Warning",
        temperature: 72,
        vibration: 0.6,
        load: 85,
        rpm: 2050,
        current: 38,
        energy_kw: 13.8,
        idle_time_pct: 18,
        rul_days: 95,
      },
      {
        machine_id: 4,
        plant: "Plant A",
        type: "Inspection",
        health_score: 88,
        status: "Healthy",
        temperature: 63,
        vibration: 0.35,
        load: 70,
        rpm: 2300,
        current: 30,
        energy_kw: 9.8,
        idle_time_pct: 14,
        rul_days: 200,
      },
      // Plant B - 3 machines (2 Slitter, 1 Inspection)
      {
        machine_id: 5,
        plant: "Plant B",
        type: "Slitter",
        health_score: 45,
        status: "Critical",
        temperature: 78,
        vibration: 1.2,
        load: 90,
        rpm: 1900,
        current: 42,
        energy_kw: 16.5,
        idle_time_pct: 25,
        rul_days: 25,
      },
      {
        machine_id: 6,
        plant: "Plant B",
        type: "Slitter",
        health_score: 92,
        status: "Healthy",
        temperature: 64,
        vibration: 0.28,
        load: 73,
        rpm: 2250,
        current: 31,
        energy_kw: 10.1,
        idle_time_pct: 11,
        rul_days: 210,
      },
      {
        machine_id: 7,
        plant: "Plant B",
        type: "Inspection",
        health_score: 76,
        status: "Warning",
        temperature: 70,
        vibration: 0.55,
        load: 82,
        rpm: 2100,
        current: 36,
        energy_kw: 12.8,
        idle_time_pct: 17,
        rul_days: 120,
      },
      // Plant C - 5 machines (3 Slitter, 2 Inspection)
      {
        machine_id: 8,
        plant: "Plant C",
        type: "Slitter",
        health_score: 89,
        status: "Healthy",
        temperature: 66,
        vibration: 0.32,
        load: 76,
        rpm: 2180,
        current: 33,
        energy_kw: 10.5,
        idle_time_pct: 13,
        rul_days: 175,
      },
      {
        machine_id: 9,
        plant: "Plant C",
        type: "Slitter",
        health_score: 58,
        status: "Critical",
        temperature: 75,
        vibration: 0.95,
        load: 88,
        rpm: 1950,
        current: 40,
        energy_kw: 15.2,
        idle_time_pct: 22,
        rul_days: 45,
      },
      {
        machine_id: 10,
        plant: "Plant C",
        type: "Slitter",
        health_score: 94,
        status: "Healthy",
        temperature: 62,
        vibration: 0.25,
        load: 68,
        rpm: 2320,
        current: 29,
        energy_kw: 9.5,
        idle_time_pct: 10,
        rul_days: 220,
      },
      {
        machine_id: 11,
        plant: "Plant C",
        type: "Inspection",
        health_score: 73,
        status: "Warning",
        temperature: 71,
        vibration: 0.58,
        load: 84,
        rpm: 2080,
        current: 37,
        energy_kw: 13.2,
        idle_time_pct: 16,
        rul_days: 110,
      },
      {
        machine_id: 12,
        plant: "Plant C",
        type: "Inspection",
        health_score: 87,
        status: "Healthy",
        temperature: 67,
        vibration: 0.38,
        load: 77,
        rpm: 2160,
        current: 34,
        energy_kw: 11.1,
        idle_time_pct: 14,
        rul_days: 185,
      },
      // Plant D - 2 machines (1 Slitter, 1 Inspection)
      {
        machine_id: 13,
        plant: "Plant D",
        type: "Slitter",
        health_score: 52,
        status: "Critical",
        temperature: 76,
        vibration: 1.1,
        load: 89,
        rpm: 1920,
        current: 41,
        energy_kw: 15.8,
        idle_time_pct: 24,
        rul_days: 35,
      },
      {
        machine_id: 14,
        plant: "Plant D",
        type: "Inspection",
        health_score: 91,
        status: "Healthy",
        temperature: 65,
        vibration: 0.3,
        load: 74,
        rpm: 2200,
        current: 32,
        energy_kw: 10.3,
        idle_time_pct: 12,
        rul_days: 195,
      },
    ]

    return machines
  }, [])

  // Apply random walk simulation to a value
  const applyRandomWalk = useCallback((currentValue: number, min: number, max: number, step = 1) => {
    const change = (Math.random() - 0.5) * step
    return Math.max(min, Math.min(max, currentValue + change))
  }, [])

  // Simulate machine data updates
  const simulateMachineUpdates = useCallback(
    (machines: EnhancedMachine[]): EnhancedMachine[] => {
      return machines.map((machine) => {
        const newHealthScore = applyRandomWalk(machine.health_score, 40, 95, 2)
        const newTemperature = applyRandomWalk(machine.temperature, 60, 80, 1)
        const newEnergyKw = applyRandomWalk(machine.energy_kw, 8, 16, 0.5)
        const newIdleTimePct = applyRandomWalk(machine.idle_time_pct, 10, 30, 1)
        const newRulDays = Math.max(0, machine.rul_days - Math.random() * 0.1) // Slowly decrement

        // Determine status based on health score
        let status = "Healthy"
        if (newHealthScore < 50) status = "Critical"
        else if (newHealthScore < 75) status = "Warning"

        return {
          ...machine,
          health_score: newHealthScore,
          status,
          temperature: newTemperature,
          energy_kw: newEnergyKw,
          idle_time_pct: newIdleTimePct,
          rul_days: newRulDays,
          vibration: applyRandomWalk(machine.vibration, 0.1, 2.0, 0.1),
          load: applyRandomWalk(machine.load, 40, 95, 2),
          rpm: applyRandomWalk(machine.rpm, 1000, 3500, 50),
          current: applyRandomWalk(machine.current, 20, 60, 1),
        }
      })
    },
    [applyRandomWalk],
  )

  // Filter machines based on current selections and user permissions
  const getFilteredMachines = useCallback(
    (machines: EnhancedMachine[]) => {
      return machines.filter((machine) => {
        // Filter by user's assigned plants
        if (!currentUser.assignedPlants.includes(machine.plant)) {
          return false
        }

        // Filter by user's allowed machine types
        if (!currentUser.allowedTypes.includes(machine.type)) {
          return false
        }

        // For Admin users, show all accessible machines regardless of selected plant
        if (currentUser.role === "Admin") {
          // Only filter by machine type if not "All"
          if (selectedMachineType !== "All" && machine.type !== selectedMachineType) {
            return false
          }
          return true
        }

        // For non-Admin users, filter by selected plant
        if (machine.plant !== selectedPlant) {
          return false
        }

        // Filter by selected machine type
        if (selectedMachineType !== "All" && machine.type !== selectedMachineType) {
          return false
        }

        return true
      })
    },
    [currentUser, selectedPlant, selectedMachineType],
  )

  // Get all accessible machines (for plant overview - not filtered by selected plant)
  const getAllAccessibleMachines = useCallback(
    (machines: EnhancedMachine[]) => {
      return machines.filter((machine) => {
        // Filter by user's assigned plants
        if (!currentUser.assignedPlants.includes(machine.plant)) {
          return false
        }

        // Filter by user's allowed machine types
        if (!currentUser.allowedTypes.includes(machine.type)) {
          return false
        }

        return true
      })
    },
    [currentUser],
  )

  // Update dashboard summary based on filtered machines
  const updateDashboardSummary = useCallback(
    (filteredMachines: EnhancedMachine[]) => {
      const healthyMachines = filteredMachines.filter((m) => m.status === "Healthy").length
      const warningMachines = filteredMachines.filter((m) => m.status === "Warning").length
      const criticalMachines = filteredMachines.filter((m) => m.status === "Critical").length

      const avgHealthScore =
        filteredMachines.length > 0
          ? filteredMachines.reduce((sum, m) => sum + m.health_score, 0) / filteredMachines.length
          : 0

      const totalEnergyConsumption = filteredMachines.reduce((sum, m) => sum + m.energy_kw, 0) * 24 * 7 // Weekly consumption
      const avgEfficiency =
        filteredMachines.length > 0
          ? filteredMachines.reduce((sum, m) => sum + (100 - m.idle_time_pct), 0) / filteredMachines.length
          : 0

      let recentAnomalies = dashboardSummary.recent_anomalies
      if (simulatedMode) {
        recentAnomalies = Math.max(0, recentAnomalies + Math.floor((Math.random() - 0.5) * 2))
      }

      setDashboardSummary({
        total_machines: filteredMachines.length,
        healthy_machines: healthyMachines,
        warning_machines: warningMachines,
        critical_machines: criticalMachines,
        avg_health_score: avgHealthScore,
        recent_anomalies: recentAnomalies,
        total_batches: 45 + Math.floor(Math.random() * 10 - 5),
        avg_efficiency: avgEfficiency,
        total_defects: 12 + Math.floor(Math.random() * 6 - 3),
        total_energy_consumption: totalEnergyConsumption,
        potential_energy_savings: totalEnergyConsumption * 0.15, // 15% potential savings
        estimated_roi_days: 145,
        last_updated: new Date().toLocaleString(),
      })
    },
    [dashboardSummary.recent_anomalies, simulatedMode],
  )

  // Generate energy data with realistic patterns
  const generateEnergyData = useCallback(() => {
    const machines = getFilteredMachines(machineStatus)

    // Calculate daily energy consumption for each machine (last 7 days)
    const dailyEnergyByMachine = machines.map((machine) => {
      const dailyData = []
      const now = new Date()

      for (let i = 6; i >= 0; i--) {
        const date = new Date(now)
        date.setDate(date.getDate() - i)
        const dayOfWeek = date.getDay()

        // Weekend factor (less energy on weekends)
        const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.7 : 1.0

        // Base energy plus random variation
        const baseEnergy = machine.energy_kw * 24 * weekendFactor
        const randomFactor = 0.9 + Math.random() * 0.2 // 90% to 110%

        dailyData.push({
          date: date.toISOString().split("T")[0],
          energy_kwh: baseEnergy * randomFactor,
          machine_id: machine.machine_id,
        })
      }

      return {
        machine_id: machine.machine_id,
        daily_energy: dailyData,
      }
    })

    // Calculate idle time energy waste
    const idleTimeWaste = machines.map((machine) => {
      const hourlyRate = machine.energy_kw * 0.3 // Assume idle consumption is 30% of normal
      const hoursIdle = 24 * 7 * (machine.idle_time_pct / 100)
      const totalWaste = hourlyRate * hoursIdle

      return {
        machine_id: machine.machine_id,
        idle_hours: hoursIdle.toFixed(1),
        idle_time_pct: machine.idle_time_pct,
        energy_waste_kwh: totalWaste.toFixed(1),
        potential_savings_usd: (totalWaste * 0.12).toFixed(2), // Assuming $0.12 per kWh
      }
    })

    // Calculate energy efficiency (energy per production unit)
    const energyEfficiency = machines.map((machine) => {
      // Lower is better - kWh per production unit
      const efficiency = (machine.energy_kw / (machine.load / 100)) * (1 + machine.idle_time_pct / 100)

      return {
        machine_id: machine.machine_id,
        energy_per_unit: efficiency.toFixed(2),
        efficiency_score: (100 - efficiency * 10).toFixed(1), // Convert to 0-100 score (higher is better)
      }
    })

    // Calculate ROI data
    const initialInvestment = 50000 // Example: $50,000 for the system
    const energySavingsPerYear = idleTimeWaste.reduce(
      (sum, machine) => sum + Number.parseFloat(machine.potential_savings_usd) * 52,
      0,
    ) // Yearly savings
    const maintenanceSavingsPerYear = 15000 // Example: $15,000 saved from predictive maintenance
    const totalSavingsPerYear = energySavingsPerYear + maintenanceSavingsPerYear
    const roiYears = initialInvestment / totalSavingsPerYear
    const roiMonths = roiYears * 12

    const roiData = {
      initial_investment: initialInvestment,
      energy_savings_per_year: energySavingsPerYear.toFixed(2),
      maintenance_savings_per_year: maintenanceSavingsPerYear.toFixed(2),
      total_savings_per_year: totalSavingsPerYear.toFixed(2),
      roi_years: roiYears.toFixed(2),
      roi_months: roiMonths.toFixed(1),
      payback_date: new Date(Date.now() + roiMonths * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    }

    return {
      daily_energy_by_machine: dailyEnergyByMachine,
      idle_time_waste: idleTimeWaste,
      energy_efficiency: energyEfficiency,
      roi_data: roiData,
    }
  }, [machineStatus, getFilteredMachines])

  // Generate anomalies with realistic patterns
  const generateAnomalies = useCallback(
    (machineId = 1) => {
      const machine = machineStatus.find((m) => m.machine_id === machineId)
      if (!machine) return []

      // More anomalies for machines in worse condition
      const anomalyCount = machine.status === "Critical" ? 3 : machine.status === "Warning" ? 2 : 1

      const anomalies = []
      const now = new Date()

      for (let i = 0; i < anomalyCount; i++) {
        // Distribute anomalies over the last 24 hours
        const hoursAgo = Math.floor(Math.random() * 24)
        const timestamp = new Date(now.getTime() - hoursAgo * 3600000)

        // Generate anomaly data based on machine condition
        let temperature, vibration, load, rpm, current, energy_kw, anomalyScore

        if (machine.status === "Critical") {
          // Critical machine - severe anomalies
          temperature = 78 + Math.random() * 8
          vibration = 1.2 + Math.random() * 0.8
          load = 90 + Math.random() * 5
          rpm = 1900 - Math.random() * 200
          current = 42 + Math.random() * 8
          energy_kw = 16.5 + Math.random() * 3
          anomalyScore = 0.8 + Math.random() * 0.2
        } else if (machine.status === "Warning") {
          // Warning machine - moderate anomalies
          temperature = 72 + Math.random() * 6
          vibration = 0.6 + Math.random() * 0.4
          load = 85 + Math.random() * 5
          rpm = 2050 - Math.random() * 150
          current = 38 + Math.random() * 5
          energy_kw = 13.8 + Math.random() * 2
          anomalyScore = 0.6 + Math.random() * 0.2
        } else {
          // Healthy machines - mild anomalies
          temperature = 65 + Math.random() * 5
          vibration = 0.3 + Math.random() * 0.3
          load = 75 + Math.random() * 5
          rpm = 2200 - Math.random() * 100
          current = 32 + Math.random() * 3
          energy_kw = 10.2 + Math.random() * 1.5
          anomalyScore = 0.4 + Math.random() * 0.2
        }

        anomalies.push({
          machine_id: machineId,
          timestamp: timestamp.toLocaleString(),
          temperature,
          vibration,
          load,
          rpm,
          current,
          energy_kw,
          anomaly_score: anomalyScore,
          health_score: machine.health_score,
        })
      }

      // Sort by timestamp (most recent first)
      return anomalies.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    },
    [machineStatus],
  )

  // Generate production insights with realistic efficiency patterns
  const generateProductionInsights = useCallback(() => {
    const filteredMachines = getFilteredMachines(machineStatus)

    // Efficiency by machine with small variations
    const efficiencyByMachine = filteredMachines.map((machine) => ({
      machine_id: machine.machine_id,
      avg_efficiency: 100 - machine.idle_time_pct + (Math.random() * 4 - 2),
    }))

    // Efficiency by product with variations
    const efficiencyByProduct = [
      { product_type: "Product A", avg_efficiency: 90 + (Math.random() * 4 - 2) },
      { product_type: "Product B", avg_efficiency: 85 + (Math.random() * 4 - 2) },
      { product_type: "Product C", avg_efficiency: 78 + (Math.random() * 4 - 2) },
      { product_type: "Product D", avg_efficiency: 82 + (Math.random() * 4 - 2) },
      { product_type: "Product E", avg_efficiency: 75 + (Math.random() * 4 - 2) },
    ]

    // Energy consumption by product with variations
    const energyByProduct = [
      { product_type: "Product A", avg_energy_consumption: 120 + (Math.random() * 10 - 5) },
      { product_type: "Product B", avg_energy_consumption: 135 + (Math.random() * 10 - 5) },
      { product_type: "Product C", avg_energy_consumption: 110 + (Math.random() * 10 - 5) },
      { product_type: "Product D", avg_energy_consumption: 125 + (Math.random() * 10 - 5) },
      { product_type: "Product E", avg_energy_consumption: 150 + (Math.random() * 10 - 5) },
    ]

    // Defect rates by machine with variations
    const defectsByMachine = filteredMachines.map((machine) => ({
      machine_id: machine.machine_id,
      avg_defect_rate:
        machine.status === "Critical"
          ? 3.5 + (Math.random() * 0.8 - 0.4)
          : machine.status === "Warning"
            ? 2.1 + (Math.random() * 0.6 - 0.3)
            : 0.8 + (Math.random() * 0.4 - 0.2),
    }))

    // Find the most efficient machine
    const mostEfficientMachine = [...efficiencyByMachine].sort((a, b) => b.avg_efficiency - a.avg_efficiency)[0]

    // Find the most efficient product
    const mostEfficientProduct = [...efficiencyByProduct].sort((a, b) => b.avg_efficiency - a.avg_efficiency)[0]

    // Find the highest energy consuming product
    const highestEnergyProduct = [...energyByProduct].sort(
      (a, b) => b.avg_energy_consumption - a.avg_energy_consumption,
    )[0]

    // Get energy data
    const energyData = generateEnergyData()

    // Find machine with highest idle time
    const highestIdleMachine = [...energyData.idle_time_waste].sort(
      (a, b) => Number.parseFloat(b.idle_time_pct) - Number.parseFloat(a.idle_time_pct),
    )[0]

    // Generate dynamic recommendations
    const recommendations = []

    if (filteredMachines.length > 0) {
      const criticalMachines = filteredMachines.filter((m) => m.status === "Critical")
      if (criticalMachines.length > 0) {
        recommendations.push(`Machine ${criticalMachines[0].machine_id} is critical and needs immediate attention.`)
      }

      if (mostEfficientMachine) {
        recommendations.push(
          `Machine ${mostEfficientMachine.machine_id} is performing best with ${mostEfficientMachine.avg_efficiency.toFixed(1)}% efficiency.`,
        )
      }

      if (highestIdleMachine) {
        recommendations.push(
          `Machine ${highestIdleMachine.machine_id} has high idle time (${highestIdleMachine.idle_time_pct}%). Consider workflow optimization.`,
        )
      }
    }

    return {
      efficiency_by_machine: efficiencyByMachine,
      efficiency_by_product: efficiencyByProduct,
      energy_by_product: energyByProduct,
      defects_by_machine: defectsByMachine,
      recommendations,
    }
  }, [machineStatus, getFilteredMachines, generateEnergyData])

  // Generate RUL prediction with slight variations
  const generateRulPrediction = useCallback(
    (machineId = 1) => {
      const machine = machineStatus.find((m) => m.machine_id === machineId)
      if (!machine)
        return { machine_id: machineId, rul_days: 0, health_score: 0, last_updated: new Date().toLocaleString() }

      return {
        machine_id: machineId,
        rul_days: machine.rul_days + (Math.random() * 10 - 5),
        health_score: machine.health_score + (Math.random() * 3 - 1.5),
        last_updated: new Date().toLocaleString(),
      }
    },
    [machineStatus],
  )

  // Generate alerts with realistic messages including energy alerts
  const generateAlerts = useCallback(() => {
    const now = new Date()
    const filteredMachines = getFilteredMachines(machineStatus)
    const alerts = []

    filteredMachines.forEach((machine) => {
      if (machine.status === "Critical") {
        alerts.push({
          type: "critical",
          machine_id: machine.machine_id,
          message: `Machine ${machine.machine_id} health is critical (${machine.health_score.toFixed(1)}%)`,
          timestamp: new Date(now.getTime() - Math.random() * 3600000).toLocaleString(),
          priority: "high",
        })

        alerts.push({
          type: "maintenance",
          machine_id: machine.machine_id,
          message: `Machine ${machine.machine_id} needs maintenance soon (RUL: ${machine.rul_days.toFixed(0)} days)`,
          timestamp: new Date(now.getTime() - Math.random() * 7200000).toLocaleString(),
          priority: "high",
        })
      } else if (machine.status === "Warning") {
        alerts.push({
          type: "warning",
          machine_id: machine.machine_id,
          message: `Machine ${machine.machine_id} health needs attention (${machine.health_score.toFixed(1)}%)`,
          timestamp: new Date(now.getTime() - Math.random() * 10800000).toLocaleString(),
          priority: "medium",
        })
      }

      // Add energy-related alerts for high idle time
      if (machine.idle_time_pct > 20) {
        alerts.push({
          type: "energy",
          machine_id: machine.machine_id,
          message: `High idle time on Machine ${machine.machine_id} (${machine.idle_time_pct.toFixed(1)}%). Energy waste detected.`,
          timestamp: new Date(now.getTime() - Math.random() * 5400000).toLocaleString(),
          priority: "medium",
        })
      }
    })

    return alerts.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  }, [machineStatus, getFilteredMachines])

  // Function to refresh all data
  const refreshData = useCallback(() => {
    const filtered = getFilteredMachines(machineStatus)
    updateDashboardSummary(filtered)
    setAlerts(generateAlerts())
    setSensorHistory(generateSensorData(selectedMachineId, selectedMetric))
    setAnomalies(generateAnomalies(selectedMachineId))
    setProductionInsights(generateProductionInsights())
    setRulPrediction(generateRulPrediction(selectedMachineId))
    setEnergyData(generateEnergyData())
  }, [
    machineStatus,
    getFilteredMachines,
    updateDashboardSummary,
    generateAlerts,
    generateSensorData,
    generateAnomalies,
    generateProductionInsights,
    generateRulPrediction,
    generateEnergyData,
    selectedMachineId,
    selectedMetric,
  ])

  // Function to update sensor data for a specific machine and metric
  const updateSensorData = useCallback(
    (machineId, metric) => {
      setSelectedMachineId(machineId)
      setSelectedMetric(metric)
      setSensorHistory(generateSensorData(machineId, metric))
      setAnomalies(generateAnomalies(machineId))
      setRulPrediction(generateRulPrediction(machineId))
    },
    [generateSensorData, generateAnomalies, generateRulPrediction],
  )

  // Initialize base machine data
  useEffect(() => {
    const baseData = generateBaseMachineStatus()
    setBaseMachineStatus(baseData)
    setMachineStatus(baseData)
  }, [generateBaseMachineStatus])

  // Update filtered data when filters change
  useEffect(() => {
    if (baseMachineStatus.length > 0) {
      const currentMachines = simulatedMode ? machineStatus : baseMachineStatus
      const filtered = getFilteredMachines(currentMachines)
      updateDashboardSummary(filtered)
      setAlerts(generateAlerts())
      setProductionInsights(generateProductionInsights())
      setEnergyData(generateEnergyData())
    }
  }, [
    selectedPlant,
    selectedMachineType,
    currentUser,
    baseMachineStatus,
    simulatedMode,
    machineStatus,
    getFilteredMachines,
    updateDashboardSummary,
    generateAlerts,
    generateProductionInsights,
    generateEnergyData,
  ])

  // Simulation interval
  useEffect(() => {
    if (!simulatedMode || baseMachineStatus.length === 0) return

    const intervalId = setInterval(() => {
      setMachineStatus((prevMachines) => {
        const updatedMachines = simulateMachineUpdates(prevMachines)
        return updatedMachines
      })
    }, 2000) // Update every 2 seconds

    return () => clearInterval(intervalId)
  }, [simulatedMode, baseMachineStatus, simulateMachineUpdates])

  // Initial data load
  useEffect(() => {
    if (baseMachineStatus.length > 0) {
      refreshData()
    }
  }, [baseMachineStatus, refreshData])

  return {
    dashboardSummary,
    machineStatus: getFilteredMachines(machineStatus),
    // Export all accessible machines for plant overview (not filtered by selected plant)
    allMachineStatus: getAllAccessibleMachines(simulatedMode ? machineStatus : baseMachineStatus),
    alerts,
    sensorHistory,
    anomalies,
    productionInsights,
    rulPrediction,
    energyData,
    refreshData,
    updateSensorData,
  }
}
