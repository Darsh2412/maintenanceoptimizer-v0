"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface RulPredictionData {
  machine_id: number
  rul_days: number
  health_score: number
  last_updated?: string
}

interface RulPredictionProps {
  prediction: RulPredictionData
  machineId: number
}

export function RulPrediction({ prediction, machineId }: RulPredictionProps) {
  // Only show prediction for the selected machine
  const showPrediction = prediction && prediction.machine_id === machineId

  return (
    <Card>
      <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
        <CardTitle className="text-base sm:text-lg">Remaining Useful Life Prediction</CardTitle>
      </CardHeader>
      <CardContent className="px-3 py-2 sm:px-6 sm:py-4">
        {showPrediction ? (
          <div className="flex items-center justify-around">
            <div className="text-center">
              <p className="text-xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
                {prediction.rul_days?.toFixed(0)} days
              </p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Estimated RUL</p>
            </div>
            <div className="text-center">
              <p className="text-xl sm:text-3xl font-bold text-green-600 dark:text-green-400">
                {prediction.health_score?.toFixed(1)}%
              </p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Health Score</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 sm:py-8">
            <p className="text-sm text-gray-500 dark:text-gray-400">Select a machine to view RUL prediction</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
