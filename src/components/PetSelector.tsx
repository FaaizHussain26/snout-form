"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Minus, Plus, X } from "lucide-react"
import type React from "react"
import { useState } from "react"

interface PetInfo {
  animal_type?: string
  other_name?: string
  quantity?: number
}

interface PetSelectorProps {
  selectedPets: PetInfo[]
  onPetsChange: (pets: PetInfo[]) => void
}

const animalTypes = [
  { value: "dog", label: "Dog" },
  { value: "cat", label: "Cat" },
  { value: "bird", label: "Bird" },
  { value: "farm_animal", label: "Farm Animal" },
  { value: "reptile", label: "Reptile" },
  { value: "other_name", label: "Other" },
]

export const PetSelector: React.FC<PetSelectorProps> = ({ selectedPets, onPetsChange }) => {
  const [selectedAnimalType, setSelectedAnimalType] = useState("")
  const [otherName, setOtherName] = useState("")
  const [quantity, setQuantity] = useState(1)

  const addPet = () => {
    if (!selectedAnimalType) return

    const newPet: PetInfo = {
      animal_type: selectedAnimalType,
      other_name: selectedAnimalType === "other_name" ? otherName : "",
      quantity,
    }

    // Check if this pet type already exists
    const existingPetIndex = selectedPets.findIndex(
      (pet) => pet.animal_type === selectedAnimalType && pet.other_name === newPet.other_name,
    )

    if (existingPetIndex >= 0) {
      // Update existing pet quantity
      const updatedPets = [...selectedPets]
      updatedPets[existingPetIndex].quantity += quantity
      onPetsChange(updatedPets)
    } else {
      // Add new pet
      onPetsChange([...selectedPets, newPet])
    }

    // Reset form
    setSelectedAnimalType("")
    setOtherName("")
    setQuantity(1)
  }

  const removePet = (index: number) => {
    const updatedPets = selectedPets.filter((_, i) => i !== index)
    onPetsChange(updatedPets)
  }

  const updatePetQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return
    const updatedPets = [...selectedPets]
    updatedPets[index].quantity = newQuantity
    onPetsChange(updatedPets)
  }

  const getPetDisplayName = (pet: PetInfo) => {
    if (pet.animal_type === "other_name") {
      return pet.other_name || "Other"
    }
    return animalTypes.find((type) => type.value === pet.animal_type)?.label || pet.animal_type
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-foreground">Pet Information</h3>

      {/* Add Pet Form */}
      <Card className="p-4 bg-pet-input border-0">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label htmlFor="animal-type" className="text-sm font-medium">
                Animal Type
              </Label>
              <Select value={selectedAnimalType} onValueChange={setSelectedAnimalType}>
                <SelectTrigger className="bg-white border-0">
                  <SelectValue placeholder="Select animal" />
                </SelectTrigger>
                <SelectContent>
                  {animalTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedAnimalType === "other_name" && (
              <div>
                <Label htmlFor="other-name" className="text-sm font-medium">
                  Specify Animal
                </Label>
                <Input
                  id="other-name"
                  placeholder="Enter animal type"
                  value={otherName}
                  onChange={(e) => setOtherName(e.target.value)}
                  className="bg-white border-0"
                />
              </div>
            )}

            <div>
              <Label htmlFor="quantity" className="text-sm font-medium">
                Quantity
              </Label>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-8 w-8 p-0"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Button
            type="button"
            onClick={addPet}
            disabled={!selectedAnimalType || (selectedAnimalType === "other_name" && !otherName.trim())}
            className="w-full bg-pet-brown hover:bg-pet-light-brown text-white"
          >
            Add Pet
          </Button>
        </div>
      </Card>

      {/* Selected Pets List */}
      {selectedPets.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-foreground">Selected Pets</h4>
          <div className="max-h-24 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {selectedPets.map((pet, index) => (
              <Card key={index} className="p-3 bg-white border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium">{getPetDisplayName(pet)}</span>
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => updatePetQuantity(index, pet.quantity - 1)}
                        className="h-6 w-6 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center text-sm">{pet.quantity}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => updatePetQuantity(index, pet.quantity + 1)}
                        className="h-6 w-6 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removePet(index)}
                    className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
