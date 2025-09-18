"use client"

import { Card } from "@/components/ui/card"
import DropIns from "@/icons/drop-ins"
import House from "@/icons/house"
import Person from "@/icons/person"
import PetTaxi from "@/icons/pet-taxi"
import { cn } from "@/lib/utils"
import type React from "react"

interface ServiceSelectionProps {
  selectedService: string
  onServiceChange: (service: string) => void
}

const services = [
  { id: "drop_in", name: "Drops-In", icon: DropIns },
  { id: "house_sitting", name: "House Sitting", icon: House },
  { id: "walks", name: "Walks", icon: Person },
  { id: "pet_taxi", name: "Pet Taxi", icon: PetTaxi },
]

export const ServiceSelection: React.FC<ServiceSelectionProps> = ({ selectedService, onServiceChange }) => {
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-medium text-foreground">Services Selections</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {services.map((service) => {
          const IconComponent = service.icon
          const isSelected = selectedService === service.id

          return (
            <Card
              key={service.id}
              className={cn(
                "p-1 cursor-pointer transition-colors border-0 h-28 flex flex-col items-center justify-center gap-3",
                isSelected ? "bg-pet-brown text-white" : "bg-pet-card hover:bg-pet-input",
              )}
              onClick={() => onServiceChange(service.id)}
            >
              <IconComponent color={isSelected ? "white" : "#442F21"} />
              <span className="text-sm font-medium text-center ">{service.name}</span>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
