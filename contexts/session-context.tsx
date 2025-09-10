"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface User {
  id: string
  name: string
  role: "Operator" | "Supervisor" | "Manager" | "Admin"
  assignedPlants: string[]
  allowedTypes: string[]
}

export interface SessionContextType {
  currentUser: User
  setCurrentUser: (user: User) => void
  selectedPlant: string
  setSelectedPlant: (plant: string) => void
  selectedMachineType: string
  setSelectedMachineType: (type: string) => void
  simulatedMode: boolean
  setSimulatedMode: (enabled: boolean) => void
  users: User[]
  plants: string[]
  machineTypes: string[]
}

const MOCK_USERS: User[] = [
  {
    id: "u-op",
    name: "John Operator",
    role: "Operator",
    assignedPlants: ["Plant A"],
    allowedTypes: ["Slitter"],
  },
  {
    id: "u-sup",
    name: "Sarah Supervisor",
    role: "Supervisor",
    assignedPlants: ["Plant A", "Plant B"],
    allowedTypes: ["Slitter", "Inspection"],
  },
  {
    id: "u-mgr",
    name: "Mike Manager",
    role: "Manager",
    assignedPlants: ["Plant A", "Plant B", "Plant C"],
    allowedTypes: ["Slitter", "Inspection"],
  },
  {
    id: "u-admin",
    name: "Admin User",
    role: "Admin",
    assignedPlants: ["Plant A", "Plant B", "Plant C", "Plant D"],
    allowedTypes: ["Slitter", "Inspection"],
  },
]

const PLANTS = ["Plant A", "Plant B", "Plant C", "Plant D"]
const MACHINE_TYPES = ["Slitter", "Inspection"]

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0])
  const [selectedPlant, setSelectedPlant] = useState<string>("")
  const [selectedMachineType, setSelectedMachineType] = useState<string>("All")
  const [simulatedMode, setSimulatedMode] = useState<boolean>(false)

  // Load from localStorage on mount
  useEffect(() => {
    const savedUserId = localStorage.getItem("fz_user")
    const savedPlant = localStorage.getItem("fz_plant")
    const savedType = localStorage.getItem("fz_type")
    const savedSim = localStorage.getItem("fz_sim")

    // Restore user
    const user = MOCK_USERS.find((u) => u.id === savedUserId) || MOCK_USERS[0]
    setCurrentUser(user)

    // Restore plant (validate against user's allowed plants)
    const validPlant = savedPlant && user.assignedPlants.includes(savedPlant) ? savedPlant : user.assignedPlants[0]
    setSelectedPlant(validPlant)

    // Restore machine type (validate against user's allowed types)
    const validType =
      savedType && (savedType === "All" || user.allowedTypes.includes(savedType))
        ? savedType
        : user.allowedTypes.length === 1
          ? user.allowedTypes[0]
          : "All"
    setSelectedMachineType(validType)

    // Restore simulation mode
    setSimulatedMode(savedSim === "true")
  }, [])

  // Save to localStorage when values change
  useEffect(() => {
    localStorage.setItem("fz_user", currentUser.id)
  }, [currentUser])

  useEffect(() => {
    localStorage.setItem("fz_plant", selectedPlant)
  }, [selectedPlant])

  useEffect(() => {
    localStorage.setItem("fz_type", selectedMachineType)
  }, [selectedMachineType])

  useEffect(() => {
    localStorage.setItem("fz_sim", simulatedMode.toString())
  }, [simulatedMode])

  // Update plant/type when user changes to ensure they're valid
  const handleSetCurrentUser = (user: User) => {
    setCurrentUser(user)

    // Reset plant if current selection is not allowed for new user
    if (!user.assignedPlants.includes(selectedPlant)) {
      setSelectedPlant(user.assignedPlants[0])
    }

    // Reset machine type if current selection is not allowed for new user
    if (selectedMachineType !== "All" && !user.allowedTypes.includes(selectedMachineType)) {
      setSelectedMachineType(user.allowedTypes.length === 1 ? user.allowedTypes[0] : "All")
    }
  }

  const value: SessionContextType = {
    currentUser,
    setCurrentUser: handleSetCurrentUser,
    selectedPlant,
    setSelectedPlant,
    selectedMachineType,
    setSelectedMachineType,
    simulatedMode,
    setSimulatedMode,
    users: MOCK_USERS,
    plants: PLANTS,
    machineTypes: MACHINE_TYPES,
  }

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider")
  }
  return context
}
