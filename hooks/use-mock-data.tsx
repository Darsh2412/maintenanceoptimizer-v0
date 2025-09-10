"use client"

import { useState, useEffect, useCallback } from "react"

// Enhanced mock data generator with realistic variations and energy data
export function useMockData() {
  const [dashboardSummary, setDashboardSummary] = useState({
    total_machines: 5,
    healthy_machines: 3,
    warning_machines: 1,
    critical_machines: 1,
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

  const [machineStatus, setMachineStatus] = useState([])
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
      1: 1.0, // Healthy
      2: 1.0, // Healthy
      3: 1.2, // Warning
      4: 1.0, // Healthy
      5: 1.5, // Critical
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
      const trend = (i / (days * 24)) * config.trend * machineHealthFactor[machineId]

      // Random noise
      const noise = (Math.random() - 0.5) * config.noise

      // Occasional spikes (0.5% chance)
      const spike = Math.random() < 0.005 ? Math.random() * config.amplitude : 0

      // Calculate final value
      let value =
        config.base * machineHealthFactor[machineId] +
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
  const generateMachineStatus = useCallback(() => {
    const machines = [
      {
        machine_id: 1,
        health_score: 90 + (Math.random() * 5 - 2.5),
        status: "Healthy",
        temperature: 65 + (Math.random() * 3 - 1.5),
        vibration: 0.3 + (Math.random() * 0.1 - 0.05),
        load: 75 + (Math.random() * 6 - 3),
        rpm: 2200 + (Math.random() * 100 - 50),
        current: 32 + (Math.random() * 2 - 1),
        energy_kw: 10.2 + (Math.random() * 1 - 0.5),
        idle_time_pct: 12 + (Math.random() * 3 - 1.5),
        rul_days: 180 + (Math.random() * 10 - 5),
      },
      {
        machine_id: 2,
        health_score: 85 + (Math.random() * 5 - 2.5),
        status: "Healthy",
        temperature: 68 + (Math.random() * 3 - 1.5),
        vibration: 0.4 + (Math.random() * 0.1 - 0.05),
        load: 80 + (Math.random() * 6 - 3),
        rpm: 2150 + (Math.random() * 100 - 50),
        current: 35 + (Math.random() * 2 - 1),
        energy_kw: 11.5 + (Math.random() * 1 - 0.5),
        idle_time_pct: 15 + (Math.random() * 3 - 1.5),
        rul_days: 165 + (Math.random() * 10 - 5),
      },
      {
        machine_id: 3,
        health_score: 71 + (Math.random() * 5 - 2.5),
        status: "Warning",
        temperature: 72 + (Math.random() * 3 - 1.5),
        vibration: 0.6 + (Math.random() * 0.15 - 0.075),
        load: 85 + (Math.random() * 6 - 3),
        rpm: 2050 + (Math.random() * 100 - 50),
        current: 38 + (Math.random() * 2 - 1),
        energy_kw: 13.8 + (Math.random() * 1.5 - 0.75),
        idle_time_pct: 18 + (Math.random() * 4 - 2),
        rul_days: 95 + (Math.random() * 10 - 5),
      },
      {
        machine_id: 4,
        health_score: 88 + (Math.random() * 5 - 2.5),
        status: "Healthy",
        temperature: 63 + (Math.random() * 3 - 1.5),
        vibration: 0.35 + (Math.random() * 0.1 - 0.05),
        load: 70 + (Math.random() * 6 - 3),
        rpm: 2300 + (Math.random() * 100 - 50),
        current: 30 + (Math.random() * 2 - 1),
        energy_kw: 9.8 + (Math.random() * 1 - 0.5),
        idle_time_pct: 14 + (Math.random() * 3 - 1.5),
        rul_days: 200 + (Math.random() * 10 - 5),
      },
      {
        machine_id: 5,
        health_score: 45 + (Math.random() * 5 - 2.5),
        status: "Critical",
        temperature: 78 + (Math.random() * 4 - 2),
        vibration: 1.2 + (Math.random() * 0.2 - 0.1),
        load: 90 + (Math.random() * 6 - 3),
        rpm: 1900 + (Math.random() * 100 - 50),
        current: 42 + (Math.random() * 3 - 1.5),
        energy_kw: 16.5 + (Math.random() * 2 - 1),
        idle_time_pct: 25 + (Math.random() * 5 - 2.5),
        rul_days: 25 + (Math.random() * 5 - 2.5),
      },
    ]

    return machines
  }, [])

  // Generate energy data with realistic patterns
  const generateEnergyData = useCallback(() => {
    const machines = generateMachineStatus()

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
  }, [generateMachineStatus])

  // Generate anomalies with realistic patterns
  const generateAnomalies = useCallback((machineId = 1) => {
    // More anomalies for machines in worse condition
    const anomalyCount = machineId === 5 ? 3 : machineId === 3 ? 2 : 1

    const anomalies = []
    const now = new Date()

    for (let i = 0; i < anomalyCount; i++) {
      // Distribute anomalies over the last 24 hours
      const hoursAgo = Math.floor(Math.random() * 24)
      const timestamp = new Date(now.getTime() - hoursAgo * 3600000)

      // Generate anomaly data based on machine condition
      let temperature, vibration, load, rpm, current, energy_kw, anomalyScore

      if (machineId === 5) {
        // Critical machine - severe anomalies
        temperature = 78 + Math.random() * 8
        vibration = 1.2 + Math.random() * 0.8
        load = 90 + Math.random() * 5
        rpm = 1900 - Math.random() * 200
        current = 42 + Math.random() * 8
        energy_kw = 16.5 + Math.random() * 3
        anomalyScore = 0.8 + Math.random() * 0.2
      } else if (machineId === 3) {
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
        health_score: machineId === 5 ? 45 : machineId === 3 ? 71 : 85,
      })
    }

    // Sort by timestamp (most recent first)
    return anomalies.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }, [])

  // Generate production insights with realistic efficiency patterns
  const generateProductionInsights = useCallback(() => {
    // Efficiency by machine with small variations
    const efficiencyByMachine = [
      { machine_id: 1, avg_efficiency: 92 + (Math.random() * 4 - 2) },
      { machine_id: 2, avg_efficiency: 85 + (Math.random() * 4 - 2) },
      { machine_id: 3, avg_efficiency: 78 + (Math.random() * 4 - 2) },
      { machine_id: 4, avg_efficiency: 88 + (Math.random() * 4 - 2) },
      { machine_id: 5, avg_efficiency: 65 + (Math.random() * 4 - 2) },
    ]

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
    const defectsByMachine = [
      { machine_id: 1, avg_defect_rate: 0.8 + (Math.random() * 0.4 - 0.2) },
      { machine_id: 2, avg_defect_rate: 1.2 + (Math.random() * 0.4 - 0.2) },
      { machine_id: 3, avg_defect_rate: 2.1 + (Math.random() * 0.6 - 0.3) },
      { machine_id: 4, avg_defect_rate: 1.0 + (Math.random() * 0.4 - 0.2) },
      { machine_id: 5, avg_defect_rate: 3.5 + (Math.random() * 0.8 - 0.4) },
    ]

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
    const recommendations = [
      `Machine 5 is a bottleneck with ${efficiencyByMachine[4].avg_efficiency.toFixed(1)}% efficiency. Consider maintenance or load redistribution.`,
      `Produce ${mostEfficientProduct.product_type} on Machine ${mostEfficientMachine.machine_id} for best efficiency (${mostEfficientMachine.avg_efficiency.toFixed(1)}%).`,
      `${highestEnergyProduct.product_type} consumes the most energy (${highestEnergyProduct.avg_energy_consumption.toFixed(1)} kWh). Consider scheduling during off-peak hours.`,
      `Machine ${defectsByMachine[4].machine_id} has the highest defect rate (${defectsByMachine[4].avg_defect_rate.toFixed(1)}%). Quality inspection recommended.`,
      `Machine ${highestIdleMachine.machine_id} has ${highestIdleMachine.idle_time_pct}% idle time, wasting ${highestIdleMachine.energy_waste_kwh} kWh. Potential savings: $${highestIdleMachine.potential_savings_usd}/week.`,
      `Reducing idle time across all machines could save approximately $${energyData.roi_data.energy_savings_per_year} per year.`,
    ]

    return {
      efficiency_by_machine: efficiencyByMachine,
      efficiency_by_product: efficiencyByProduct,
      energy_by_product: energyByProduct,
      defects_by_machine: defectsByMachine,
      recommendations,
    }
  }, [generateEnergyData])

  // Generate RUL prediction with slight variations
  const generateRulPrediction = useCallback((machineId = 1) => {
    const rulMap = {
      1: { rul_days: 180, health_score: 92 },
      2: { rul_days: 165, health_score: 85 },
      3: { rul_days: 95, health_score: 71 },
      4: { rul_days: 200, health_score: 88 },
      5: { rul_days: 25, health_score: 45 },
    }

    const base = rulMap[machineId]

    return {
      machine_id: machineId,
      rul_days: base.rul_days + (Math.random() * 10 - 5),
      health_score: base.health_score + (Math.random() * 3 - 1.5),
      last_updated: new Date().toLocaleString(),
    }
  }, [])

  // Generate alerts with realistic messages including energy alerts
  const generateAlerts = useCallback(() => {
    const now = new Date()
    const energyData = generateEnergyData()

    const alerts = [
      {
        type: "critical",
        machine_id: 5,
        message: `Machine 5 health is critical (${(45 + (Math.random() * 3 - 1.5)).toFixed(1)}%)`,
        timestamp: new Date(now.getTime() - Math.random() * 3600000).toLocaleString(),
        priority: "high",
      },
      {
        type: "maintenance",
        machine_id: 5,
        message: `Machine 5 needs maintenance soon (RUL: ${(25 + (Math.random() * 3 - 1.5)).toFixed(0)} days)`,
        timestamp: new Date(now.getTime() - Math.random() * 7200000).toLocaleString(),
        priority: "high",
      },
      {
        type: "warning",
        machine_id: 3,
        message: `Machine 3 health needs attention (${(71 + (Math.random() * 3 - 1.5)).toFixed(1)}%)`,
        timestamp: new Date(now.getTime() - Math.random() * 10800000).toLocaleString(),
        priority: "medium",
      },
    ]

    // Add energy-related alerts
    const highestIdleMachine = [...energyData.idle_time_waste].sort(
      (a, b) => Number.parseFloat(b.idle_time_pct) - Number.parseFloat(a.idle_time_pct),
    )[0]

    alerts.push({
      type: "energy",
      machine_id: Number.parseInt(highestIdleMachine.machine_id),
      message: `High idle time on Machine ${highestIdleMachine.machine_id} (${highestIdleMachine.idle_time_pct}%). Wasting ${highestIdleMachine.energy_waste_kwh} kWh/week.`,
      timestamp: new Date(now.getTime() - Math.random() * 5400000).toLocaleString(),
      priority: "medium",
    })

    // Find machine with abnormal energy consumption
    const machineWithEnergyAnomaly = Math.floor(Math.random() * 5) + 1

    if (machineWithEnergyAnomaly !== Number.parseInt(highestIdleMachine.machine_id)) {
      alerts.push({
        type: "energy",
        machine_id: machineWithEnergyAnomaly,
        message: `Abnormal energy consumption on Machine ${machineWithEnergyAnomaly}. 15% above baseline.`,
        timestamp: new Date(now.getTime() - Math.random() * 9000000).toLocaleString(),
        priority: "medium",
      })
    }

    // Add a random alert occasionally
    if (Math.random() < 0.3) {
      const randomMachine = Math.floor(Math.random() * 5) + 1
      alerts.push({
        type: "anomaly",
        machine_id: randomMachine,
        message: `Anomaly detected on Machine ${randomMachine} (score: ${(0.7 + Math.random() * 0.2).toFixed(2)})`,
        timestamp: new Date(now.getTime() - Math.random() * 14400000).toLocaleString(),
        priority: randomMachine === 5 ? "high" : randomMachine === 3 ? "medium" : "low",
      })
    }

    return alerts.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  }, [generateEnergyData])

  // Update dashboard summary with realistic variations
  const updateDashboardSummary = useCallback(() => {
    const healthyMachines = 3 + (Math.random() < 0.2 ? -1 : 0)
    const warningMachines = 1 + (Math.random() < 0.2 ? 1 : 0)
    const criticalMachines = 5 - healthyMachines - warningMachines

    const energyData = generateEnergyData()
    const totalEnergyConsumption = 4250 + (Math.random() * 200 - 100)
    const potentialEnergySavings = Number.parseFloat(
      energyData.idle_time_waste
        .reduce((sum, machine) => sum + Number.parseFloat(machine.energy_waste_kwh), 0)
        .toFixed(0),
    )

    // Calculate ROI days based on energy savings and maintenance savings
    const dailySavings = Number.parseFloat(energyData.roi_data.total_savings_per_year) / 365
    const initialInvestment = 50000
    const estimatedRoiDays = Math.round(initialInvestment / dailySavings)

    setDashboardSummary({
      total_machines: 5,
      healthy_machines: healthyMachines,
      warning_machines: warningMachines,
      critical_machines: criticalMachines,
      avg_health_score: 78.5 + (Math.random() * 3 - 1.5),
      recent_anomalies: 2 + (Math.random() < 0.3 ? 1 : 0),
      total_batches: 45 + (Math.random() * 4 - 2),
      avg_efficiency: 85.2 + (Math.random() * 2 - 1),
      total_defects: 12 + (Math.random() * 3 - 1.5),
      total_energy_consumption: totalEnergyConsumption,
      potential_energy_savings: potentialEnergySavings,
      estimated_roi_days: estimatedRoiDays,
      last_updated: new Date().toLocaleString(),
    })
  }, [generateEnergyData])

  // Generate plant data
  const generatePlantData = useCallback(() => {
    const plants = [
      {
        plant_id: 1,
        plant_name: "Plant 1",
        location: "East Wing",
        total_machines: 3,
        healthy_machines: 2,
        warning_machines: 1,
        critical_machines: 0,
        avg_health_score: 87.5 + (Math.random() * 3 - 1.5),
        avg_energy_consumption: 1250 + (Math.random() * 100 - 50),
        avg_efficiency: 88.2 + (Math.random() * 2 - 1),
      },
      {
        plant_id: 2,
        plant_name: "Plant 2",
        location: "West Wing",
        total_machines: 2,
        healthy_machines: 1,
        warning_machines: 0,
        critical_machines: 1,
        avg_health_score: 65.8 + (Math.random() * 3 - 1.5),
        avg_energy_consumption: 980 + (Math.random() * 100 - 50),
        avg_efficiency: 72.5 + (Math.random() * 2 - 1),
      },
    ]

    // Map machines to plants
    const machineToPlantMap = {
      1: 1, // Machine 1 belongs to Plant 1
      2: 1, // Machine 2 belongs to Plant 1
      3: 1, // Machine 3 belongs to Plant 1
      4: 2, // Machine 4 belongs to Plant 2
      5: 2, // Machine 5 belongs to Plant 2
    }

    return { plants, machineToPlantMap }
  }, [])

  const [plantData, setPlantData] = useState({ plants: [], machineToPlantMap: {} })

  // Function to refresh all data
  const refreshData = useCallback(() => {
    updateDashboardSummary()
    setMachineStatus(generateMachineStatus())
    setAlerts(generateAlerts())
    setSensorHistory(generateSensorData(selectedMachineId, selectedMetric))
    setAnomalies(generateAnomalies(selectedMachineId))
    setProductionInsights(generateProductionInsights())
    setRulPrediction(generateRulPrediction(selectedMachineId))
    setEnergyData(generateEnergyData())
    setPlantData(generatePlantData())
  }, [
    generateMachineStatus,
    generateAlerts,
    generateSensorData,
    generateAnomalies,
    generateProductionInsights,
    generateRulPrediction,
    generateEnergyData,
    generatePlantData,
    updateDashboardSummary,
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

  // Initialize data on component mount
  useEffect(() => {
    refreshData()

    // Optional: Set up an interval to refresh data periodically
    const intervalId = setInterval(() => {
      refreshData()
    }, 60000) // Refresh every minute

    return () => clearInterval(intervalId)
  }, [refreshData])

  return {
    dashboardSummary,
    machineStatus,
    alerts,
    sensorHistory,
    anomalies,
    productionInsights,
    rulPrediction,
    energyData,
    plantData,
    refreshData,
    updateSensorData,
  }
}
