"use client"

import { ChevronDown, User, ToggleLeft, ToggleRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSession } from "@/contexts/session-context"

export function HeaderControls() {
  const {
    currentUser,
    setCurrentUser,
    selectedPlant,
    setSelectedPlant,
    selectedMachineType,
    setSelectedMachineType,
    simulatedMode,
    setSimulatedMode,
    users,
  } = useSession()

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "Manager":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Supervisor":
        return "bg-green-100 text-green-800 border-green-200"
      case "Operator":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Admin users don't need plant selection - they see all plants
  const showPlantSelector = currentUser.role !== "Admin"
  const showMachineTypeSelector = currentUser.role !== "Admin" || currentUser.allowedTypes.length > 1

  return (
    <div className="flex items-center gap-3">
      {/* User Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">{currentUser.name}</span>
            <Badge variant="outline" className={`text-xs ${getRoleBadgeColor(currentUser.role)}`}>
              {currentUser.role}
            </Badge>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Switch User</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {users.map((user) => (
            <DropdownMenuItem
              key={user.id}
              onClick={() => setCurrentUser(user)}
              className={`flex items-center justify-between ${
                currentUser.id === user.id ? "bg-gray-100 dark:bg-gray-800" : ""
              }`}
            >
              <div className="flex flex-col">
                <span className="font-medium">{user.name}</span>
                <span className="text-xs text-gray-500">
                  {user.role === "Admin" ? "All Plants" : user.assignedPlants.join(", ")}
                </span>
              </div>
              <Badge variant="outline" className={`text-xs ${getRoleBadgeColor(user.role)}`}>
                {user.role}
              </Badge>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Plant Selector - Hidden for Admin */}
      {showPlantSelector && (
        <Select value={selectedPlant} onValueChange={setSelectedPlant}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Plant" />
          </SelectTrigger>
          <SelectContent>
            {currentUser.assignedPlants.map((plant) => (
              <SelectItem key={plant} value={plant}>
                {plant}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Machine Type Selector - Show "All Plants" for Admin */}
      {showMachineTypeSelector && (
        <Select value={selectedMachineType} onValueChange={setSelectedMachineType}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Types</SelectItem>
            {currentUser.allowedTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Admin Badge - Show when Admin is selected */}
      {currentUser.role === "Admin" && (
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
          All Plants Access
        </Badge>
      )}

      {/* Simulated Mode Toggle */}
      <Button
        variant="outline"
        onClick={() => setSimulatedMode(!simulatedMode)}
        className={`flex items-center gap-2 ${simulatedMode ? "bg-green-50 border-green-200 text-green-700" : ""}`}
      >
        {simulatedMode ? (
          <ToggleRight className="w-4 h-4 text-green-600" />
        ) : (
          <ToggleLeft className="w-4 h-4 text-gray-400" />
        )}
        <span className="hidden sm:inline">{simulatedMode ? "Live Mode" : "Static Mode"}</span>
      </Button>
    </div>
  )
}
