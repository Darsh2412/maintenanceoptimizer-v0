"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Download, FileText, Building, AlertCircle, Settings } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"

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

interface ReportGeneratorProps {
  machines: Machine[]
  dashboardSummary: any
  alerts: any[]
  energyData: any
  productionInsights: any
}

export function ReportGenerator({
  machines,
  dashboardSummary,
  alerts,
  energyData,
  productionInsights,
}: ReportGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loadingState, setLoadingState] = useState<"idle" | "generating" | "downloading" | "error">("idle")
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [errorMessage, setErrorMessage] = useState("")
  const [reportConfig, setReportConfig] = useState({
    reportType: "comprehensive",
    includeCharts: true,
    includeMachineDetails: true,
    includeAlerts: true,
    includeEnergyAnalysis: true,
    includeRecommendations: true,
    customerName: "",
    reportTitle: "Machine Status & Performance Report",
    selectedMachines: machines.map((m) => m.machine_id.toString()),
    colorTheme: "default",
    paperSize: "a4",
    orientation: "portrait",
  })

  const handleMachineSelection = (machineId: string, checked: boolean) => {
    setReportConfig((prev) => ({
      ...prev,
      selectedMachines: checked
        ? [...prev.selectedMachines, machineId]
        : prev.selectedMachines.filter((id) => id !== machineId),
    }))
  }

  const selectAllMachines = () => {
    setReportConfig((prev) => ({
      ...prev,
      selectedMachines: machines.map((m) => m.machine_id.toString()),
    }))
  }

  const deselectAllMachines = () => {
    setReportConfig((prev) => ({
      ...prev,
      selectedMachines: [],
    }))
  }

  const handleGenerateReport = async () => {
    try {
      setLoadingState("generating")
      setLoadingProgress(10)
      setErrorMessage("")

      // Filter machines based on selection
      const selectedMachines = machines.filter((m) => reportConfig.selectedMachines.includes(m.machine_id.toString()))

      if (selectedMachines.length === 0) {
        throw new Error("Please select at least one machine to include in the report")
      }

      // Load jsPDF dynamically to avoid SSR issues
      const jsPDFModule = await import("jspdf")
      const jsPDF = jsPDFModule.default

      setLoadingProgress(30)

      // Create new PDF document with proper orientation
      const orientation = reportConfig.orientation === "landscape" ? "l" : "p"
      const pdf = new jsPDF(orientation, "mm", reportConfig.paperSize)

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      let currentY = 20 // Initial Y position for content

      // Helper function to format numbers
      const formatNumber = (value: number, decimals = 1) => {
        if (isNaN(value) || value === null || typeof value === "undefined") return "0"
        return Number(value.toFixed(decimals)).toString()
      }

      // Helper function to safely add text to PDF
      const safeText = (text: string, x: number, y: number, options?: any) => {
        try {
          // Replace special characters that might cause issues
          const safeString = String(text === null || typeof text === "undefined" ? "" : text).replace(
            /[^\x00-\x7F]/g,
            "",
          )
          pdf.text(safeString, x, y, options)
        } catch (error) {
          console.error("Error adding text to PDF:", error)
          // Add fallback text if there's an error
          pdf.text("(text error)", x, y, options)
        }
      }

      // Helper function to add new page if needed
      const checkPageBreak = (requiredHeight: number) => {
        if (currentY + requiredHeight > pageHeight - 20) {
          pdf.addPage()
          currentY = 20 // Reset Y to top margin for the new page
          return true
        }
        return false
      }

      // 1. HEADER WITH LOGO
      pdf.setFontSize(24)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(100, 100, 100) // Gray for FAULT
      safeText("FAULT", 20, currentY)
      pdf.setTextColor(59, 130, 246) // Blue for ZERO
      safeText("ZERO", 75, currentY)
      currentY += 15

      // Report title
      pdf.setFontSize(18)
      pdf.setTextColor(0, 0, 0)
      safeText(reportConfig.reportTitle || "Machine Status Report", 20, currentY)
      currentY += 10

      // Customer name and date
      pdf.setFontSize(12)
      pdf.setFont("helvetica", "normal")
      if (reportConfig.customerName) {
        safeText(`Customer: ${reportConfig.customerName}`, 20, currentY)
        currentY += 6
      }
      safeText(`Generated: ${new Date().toLocaleDateString()}`, 20, currentY)
      currentY += 15

      setLoadingProgress(40)

      // 2. EXECUTIVE SUMMARY
      pdf.setFontSize(16)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(30, 58, 138) // Dark blue
      safeText("Executive Summary", 20, currentY)
      currentY += 10

      pdf.setFontSize(10)
      pdf.setFont("helvetica", "normal")
      pdf.setTextColor(0, 0, 0)

      const summaryData = [
        ["Total Machines", String(dashboardSummary?.total_machines || 0)],
        ["Healthy Machines", String(dashboardSummary?.healthy_machines || 0)],
        ["Warning Machines", String(dashboardSummary?.warning_machines || 0)],
        ["Critical Machines", String(dashboardSummary?.critical_machines || 0)],
        ["Average Health Score", `${formatNumber(dashboardSummary?.avg_health_score || 0)}%`],
        ["Recent Anomalies", String(dashboardSummary?.recent_anomalies || 0)],
      ]

      const summaryRowHeight = 8
      summaryData.forEach(([label, value], index) => {
        if (index % 2 === 0) {
          pdf.setFillColor(240, 249, 255) // Light blue background
          pdf.rect(20, currentY - 3, pageWidth - 40, summaryRowHeight, "F")
        }
        safeText(label, 25, currentY + 2)
        safeText(value, pageWidth - 60, currentY + 2, { align: "right" })
        currentY += summaryRowHeight
      })
      currentY += 15

      setLoadingProgress(50)

      // 3. MACHINE STATUS OVERVIEW
      if (reportConfig.includeMachineDetails && selectedMachines.length > 0) {
        checkPageBreak(30)
        pdf.setFontSize(16)
        pdf.setFont("helvetica", "bold")
        pdf.setTextColor(30, 58, 138) // Dark blue
        safeText("Machine Status Overview", 20, currentY)
        currentY += 10

        const machineTableHeaders = ["ID", "Status", "Health", "RUL", "Temp", "Energy", "Idle"]
        const machineColWidths = [20, 30, 25, 25, 25, 25, 25]
        const machineRowHeight = 8

        // Draw table headers
        pdf.setFontSize(9)
        pdf.setFont("helvetica", "bold")
        pdf.setFillColor(59, 130, 246, 0.2) // Light blue header
        pdf.rect(20, currentY - 5, pageWidth - 40, machineRowHeight, "F")

        let headerX = 22
        machineTableHeaders.forEach((header, index) => {
          pdf.setTextColor(30, 58, 138) // Dark blue text
          safeText(header, headerX, currentY)
          headerX += machineColWidths[index]
        })
        currentY += machineRowHeight
        pdf.setFont("helvetica", "normal")
        pdf.setFontSize(9)

        // Draw table rows
        selectedMachines.forEach((machine, index) => {
          if (checkPageBreak(machineRowHeight)) {
            // Redraw headers on new page
            pdf.setFontSize(9)
            pdf.setFont("helvetica", "bold")
            pdf.setFillColor(59, 130, 246, 0.2)
            pdf.rect(20, currentY - 5, pageWidth - 40, machineRowHeight, "F")

            let headerX = 22
            machineTableHeaders.forEach((header, i) => {
              pdf.setTextColor(30, 58, 138)
              safeText(header, headerX, currentY)
              headerX += machineColWidths[i]
            })
            currentY += machineRowHeight
            pdf.setFont("helvetica", "normal")
            pdf.setFontSize(9)
          }

          if (index % 2 === 0) {
            pdf.setFillColor(245, 245, 245) // Light gray for alternating rows
            pdf.rect(20, currentY - 3, pageWidth - 40, machineRowHeight, "F")
          }

          const rowData = [
            String(machine.machine_id),
            machine.status || "Unknown",
            `${formatNumber(machine.health_score || 0)}%`,
            `${formatNumber(machine.rul_days || 0, 0)}d`,
            `${formatNumber(machine.temperature || 0)}°C`,
            `${formatNumber(machine.energy_kw || 0)}kW`,
            `${formatNumber(machine.idle_time_pct || 0)}%`,
          ]

          let dataX = 22
          rowData.forEach((data, i) => {
            pdf.setTextColor(0, 0, 0) // Default text color
            if (i === 1) {
              // Status column
              const status = machine.status ? machine.status.toLowerCase() : ""
              if (status === "healthy")
                pdf.setTextColor(34, 139, 34) // Green
              else if (status === "warning")
                pdf.setTextColor(255, 165, 0) // Orange
              else if (status === "critical") pdf.setTextColor(220, 20, 60) // Red
            }
            safeText(data, dataX, currentY + 2)
            dataX += machineColWidths[i]
          })
          currentY += machineRowHeight
        })
        currentY += 15
      }

      setLoadingProgress(70)

      // 4. ALERTS AND ANOMALIES
      if (reportConfig.includeAlerts && alerts && alerts.length > 0) {
        checkPageBreak(30)
        pdf.setFontSize(16)
        pdf.setFont("helvetica", "bold")
        pdf.setTextColor(30, 58, 138) // Dark blue
        safeText("Active Alerts & Anomalies", 20, currentY)
        currentY += 10

        const alertItemHeight = 18
        alerts.slice(0, 10).forEach((alert) => {
          checkPageBreak(alertItemHeight)

          // Alert details
          pdf.setFontSize(10)
          pdf.setFont("helvetica", "bold")
          const priority = (alert.priority || "normal").toLowerCase()
          if (priority === "high")
            pdf.setTextColor(220, 20, 60) // Red
          else if (priority === "medium")
            pdf.setTextColor(255, 165, 0) // Orange
          else pdf.setTextColor(59, 130, 246) // Blue

          safeText(`${(alert.priority || "").toUpperCase()} - Machine ${alert.machine_id || "N/A"}`, 25, currentY)

          pdf.setTextColor(0, 0, 0)
          pdf.setFont("helvetica", "normal")
          pdf.setFontSize(9)
          const alertMessage = alert.message || "No message."
          const alertMessageLines = pdf.splitTextToSize(alertMessage, pageWidth - 50)
          safeText(alertMessageLines, 25, currentY + 5)

          const messageHeight = alertMessageLines.length * 4 // Approximate height

          pdf.setFontSize(8)
          pdf.setTextColor(100, 100, 100)
          safeText(
            alert.timestamp ? new Date(alert.timestamp).toLocaleString() : "No timestamp",
            25,
            currentY + 5 + messageHeight + 2,
          )

          currentY += alertItemHeight
        })
        currentY += 10
      }

      setLoadingProgress(85)

      // 5. ENERGY ANALYSIS
      if (reportConfig.includeEnergyAnalysis && energyData) {
        checkPageBreak(30)
        pdf.setFontSize(16)
        pdf.setFont("helvetica", "bold")
        pdf.setTextColor(30, 58, 138) // Dark blue
        safeText("Energy Analysis", 20, currentY)
        currentY += 10

        pdf.setFontSize(10)
        pdf.setFont("helvetica", "normal")
        pdf.setTextColor(0, 0, 0)

        // Energy metrics
        const energyMetrics = [
          ["Total Energy Consumption", `${formatNumber(dashboardSummary?.total_energy_consumption || 0, 2)} kWh`],
          [
            "Average Energy per Machine",
            `${formatNumber((dashboardSummary?.total_energy_consumption || 0) / (dashboardSummary?.total_machines || 1), 2)} kWh`,
          ],
          ["Potential Energy Savings", `${formatNumber(dashboardSummary?.potential_energy_savings || 0, 2)} kWh`],
          ["Estimated Cost Savings", `$${formatNumber((dashboardSummary?.potential_energy_savings || 0) * 0.12, 2)}`],
        ]

        const energyRowHeight = 8
        energyMetrics.forEach(([label, value], index) => {
          if (index % 2 === 0) {
            pdf.setFillColor(240, 249, 255) // Light blue background
            pdf.rect(20, currentY - 3, pageWidth - 40, energyRowHeight, "F")
          }
          safeText(label, 25, currentY + 2)
          safeText(value, pageWidth - 60, currentY + 2, { align: "right" })
          currentY += energyRowHeight
        })
        currentY += 15
      }

      setLoadingProgress(95)

      // 6. AI RECOMMENDATIONS
      if (
        reportConfig.includeRecommendations &&
        productionInsights &&
        productionInsights.recommendations &&
        productionInsights.recommendations.length > 0
      ) {
        checkPageBreak(30)
        pdf.setFontSize(16)
        pdf.setFont("helvetica", "bold")
        pdf.setTextColor(30, 58, 138) // Dark blue
        safeText("AI-Powered Recommendations", 20, currentY)
        currentY += 10

        pdf.setFont("helvetica", "normal")
        pdf.setFontSize(10)
        productionInsights.recommendations.forEach((recommendation: string, index: number) => {
          const recommendationText = recommendation || "No specific recommendation provided."
          const splitRec = pdf.splitTextToSize(recommendationText, pageWidth - 50)
          const recommendationHeight = splitRec.length * 4 + 5

          checkPageBreak(recommendationHeight)

          pdf.setTextColor(59, 130, 246) // Blue for numbering
          safeText(`${index + 1}.`, 25, currentY)

          pdf.setTextColor(0, 0, 0) // Black for text
          safeText(splitRec, 35, currentY)

          currentY += recommendationHeight
        })
      }

      // Add footer to all pages
      const totalPages = pdf.getNumberOfPages()
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i)
        pdf.setFontSize(8)
        pdf.setTextColor(100, 100, 100)
        const footerText = `Page ${i} of ${totalPages} | Generated by FaultZero | ${new Date().toLocaleDateString()}`
        safeText(footerText, 20, pageHeight - 10)

        // Add footer line
        pdf.setDrawColor(200, 200, 200)
        pdf.line(20, pageHeight - 15, pageWidth - 20, pageHeight - 15)
      }

      setLoadingState("downloading")
      setLoadingProgress(98)

      // Save the PDF
      const safeCustomerName = reportConfig.customerName
        ? String(reportConfig.customerName)
            .replace(/\s+/g, "_")
            .replace(/[^\w.-]/g, "") + "_"
        : ""
      const fileName = `${safeCustomerName}Machine_Report_${new Date().toISOString().split("T")[0]}.pdf`
      pdf.save(fileName)

      setLoadingProgress(100)
      setLoadingState("idle")
      setIsOpen(false)
      toast({
        title: "Report Generated Successfully",
        description: "Your PDF report has been downloaded to your device.",
      })
    } catch (error) {
      console.error("Error generating report:", error)
      setLoadingState("error")
      setErrorMessage(error instanceof Error ? error.message : "Failed to generate report")
      toast({
        title: "Report Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate report",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-9">
          <Download className="h-4 w-4 mr-1" />
          Export Report
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Generate PDF Report
          </DialogTitle>
          <DialogDescription>Create a comprehensive PDF report with machine data and analytics</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Report Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Building className="w-4 h-4" />
                Report Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer/Company Name</Label>
                <Input
                  id="customerName"
                  placeholder="Enter customer name"
                  value={reportConfig.customerName}
                  onChange={(e) => setReportConfig((prev) => ({ ...prev, customerName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reportTitle">Report Title</Label>
                <Input
                  id="reportTitle"
                  placeholder="Enter report title"
                  value={reportConfig.reportTitle}
                  onChange={(e) => setReportConfig((prev) => ({ ...prev, reportTitle: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Document Settings */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Document Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paperSize">Paper Size</Label>
                  <Select
                    value={reportConfig.paperSize}
                    onValueChange={(value) => setReportConfig((prev) => ({ ...prev, paperSize: value }))}
                  >
                    <SelectTrigger id="paperSize">
                      <SelectValue placeholder="Select paper size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a4">A4</SelectItem>
                      <SelectItem value="letter">Letter</SelectItem>
                      <SelectItem value="legal">Legal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="orientation">Orientation</Label>
                  <Select
                    value={reportConfig.orientation}
                    onValueChange={(value) => setReportConfig((prev) => ({ ...prev, orientation: value }))}
                  >
                    <SelectTrigger id="orientation">
                      <SelectValue placeholder="Select orientation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="portrait">Portrait</SelectItem>
                      <SelectItem value="landscape">Landscape</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Machine Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Machine Selection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-3">
                <Button variant="outline" size="sm" onClick={selectAllMachines} className="text-xs h-7">
                  Select All
                </Button>
                <Button variant="outline" size="sm" onClick={deselectAllMachines} className="text-xs h-7">
                  Deselect All
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[200px] overflow-y-auto p-1">
                {machines.map((machine) => (
                  <div key={machine.machine_id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`machine-${machine.machine_id}`}
                      checked={reportConfig.selectedMachines.includes(machine.machine_id.toString())}
                      onCheckedChange={(checked) =>
                        handleMachineSelection(machine.machine_id.toString(), checked as boolean)
                      }
                    />
                    <Label htmlFor={`machine-${machine.machine_id}`} className="text-sm font-normal">
                      Machine {machine.machine_id}
                      <span
                        className={`ml-1 text-xs ${
                          machine.status.toLowerCase() === "healthy"
                            ? "text-emerald-600"
                            : machine.status.toLowerCase() === "warning"
                              ? "text-amber-600"
                              : "text-red-600"
                        }`}
                      >
                        ({machine.status})
                      </span>
                    </Label>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                {reportConfig.selectedMachines.length} of {machines.length} machines selected
              </div>
            </CardContent>
          </Card>

          {/* Report Sections */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Report Sections</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeMachineDetails"
                  checked={reportConfig.includeMachineDetails}
                  onCheckedChange={(checked) =>
                    setReportConfig((prev) => ({ ...prev, includeMachineDetails: checked as boolean }))
                  }
                />
                <Label htmlFor="includeMachineDetails">Machine Details & Metrics</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeAlerts"
                  checked={reportConfig.includeAlerts}
                  onCheckedChange={(checked) =>
                    setReportConfig((prev) => ({ ...prev, includeAlerts: checked as boolean }))
                  }
                />
                <Label htmlFor="includeAlerts">Alerts & Anomalies</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeEnergyAnalysis"
                  checked={reportConfig.includeEnergyAnalysis}
                  onCheckedChange={(checked) =>
                    setReportConfig((prev) => ({ ...prev, includeEnergyAnalysis: checked as boolean }))
                  }
                />
                <Label htmlFor="includeEnergyAnalysis">Energy Analysis</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeRecommendations"
                  checked={reportConfig.includeRecommendations}
                  onCheckedChange={(checked) =>
                    setReportConfig((prev) => ({ ...prev, includeRecommendations: checked as boolean }))
                  }
                />
                <Label htmlFor="includeRecommendations">AI Recommendations</Label>
              </div>
            </CardContent>
          </Card>

          {/* Generate Button */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={loadingState !== "idle" && loadingState !== "error"}
              className="h-9"
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerateReport}
              disabled={
                (loadingState !== "idle" && loadingState !== "error") || reportConfig.selectedMachines.length === 0
              }
              className="min-w-[140px] h-9"
            >
              {loadingState === "idle" || loadingState === "error" ? (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Generate PDF
                </>
              ) : (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {loadingState === "generating" ? "Generating..." : "Downloading..."}
                </>
              )}
            </Button>
          </div>

          {loadingState !== "idle" && loadingState !== "error" && (
            <div className="mt-4">
              <Progress value={loadingProgress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1 text-center">
                {loadingState === "generating" ? "Generating PDF report..." : "Downloading your report..."}
              </p>
            </div>
          )}

          {loadingState === "error" && (
            <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-destructive mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-destructive font-medium">Error generating report</p>
                  <p className="text-xs text-destructive/80 mt-1">
                    {errorMessage || "Please try again or contact support if the issue persists."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
