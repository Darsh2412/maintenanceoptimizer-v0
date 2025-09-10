"use client"

interface RoiData {
  initial_investment: number
  energy_savings_per_year: string
  maintenance_savings_per_year: string
  total_savings_per_year: string
  roi_years: string
  roi_months: string
  payback_date: string
}

interface RoiCalculatorProps {
  data: RoiData
}

export function RoiCalculator({ data }: RoiCalculatorProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Investment</h3>
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
            <p className="text-sm text-gray-600 dark:text-gray-400">Initial Investment</p>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
              ${data.initial_investment.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Annual Savings</h3>
          <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-md">
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">Energy Savings</p>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">${data.energy_savings_per_year}</p>
            </div>
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">Maintenance Savings</p>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">
                ${data.maintenance_savings_per_year}
              </p>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-green-200 dark:border-green-800">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Annual Savings</p>
              <p className="text-sm font-bold text-green-600 dark:text-green-400">${data.total_savings_per_year}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-md">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Return on Investment</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-xs text-gray-600 dark:text-gray-400">ROI Period</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{data.roi_years} years</p>
            <p className="text-xs text-gray-500 dark:text-gray-500">({data.roi_months} months)</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 dark:text-gray-400">Payback Date</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{data.payback_date}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 dark:text-gray-400">ROI Percentage</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {((Number.parseFloat(data.total_savings_per_year) / data.initial_investment) * 100).toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">(Annual)</p>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400 italic text-center">
        * ROI calculations based on current energy prices and maintenance costs
      </div>
    </div>
  )
}
