"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PetSelectorProps {
  selectedPets: Array<{
    animal_type?: string;
    other_name?: string;
    quantity?: number;
  }>;
  onPetsChange: (
    pets: Array<{
      animal_type?: string;
      other_name?: string;
      quantity?: number;
    }>
  ) => void;
}

const defaultPets = ["dog", "cat", "farm_animal", "bird", "reptile"];

export const PetSelector: React.FC<PetSelectorProps> = ({
  selectedPets,
  onPetsChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customPet, setCustomPet] = useState("");
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click is within the iframe
      const isWithinIframe = window.self !== window.top;
      const target = event.target as Node;

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        (!isWithinIframe || target.ownerDocument === document)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      // Use capture phase to ensure we catch the event before other handlers
      document.addEventListener("mousedown", handleClickOutside, true);
    } else {
      document.removeEventListener("mousedown", handleClickOutside, true);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, [isOpen]);

  const updatePetCount = (
    petType: string,
    change: number,
    otherName?: string
  ) => {
    const existingPetIndex = selectedPets.findIndex(
      (pet) => pet.animal_type === petType && pet.other_name === otherName
    );

    const updatedPets = [...selectedPets];

    if (existingPetIndex >= 0) {
      const newQuantity = Math.max(
        0,
        (updatedPets[existingPetIndex].quantity ?? 0) + change
      );
      if (newQuantity === 0) {
        updatedPets.splice(existingPetIndex, 1);
      } else {
        updatedPets[existingPetIndex].quantity = newQuantity;
      }
    } else if (change > 0) {
      const newPet =
        petType === "other_name"
          ? {
              animal_type: "other_name",
              other_name: otherName,
              quantity: change,
            }
          : { animal_type: petType, quantity: change };
      updatedPets.push(newPet);
    }

    onPetsChange(updatedPets);
  };

  const addCustomPet = () => {
    if (customPet.trim()) {
      updatePetCount("other_name", 1, customPet.trim());
      setCustomPet("");
    }
  };

  const getCustomPets = () => {
    return selectedPets
      .filter((pet) => pet.animal_type === "other_name" && pet.other_name)
      .map((pet) => pet.other_name!);
  };

  const getPetCount = (petType: string, otherName?: string) => {
    const pet = selectedPets.find(
      (p) => p.animal_type === petType && p.other_name === otherName
    );
    return pet?.quantity ?? 0;
  };

  const getSelectedText = () => {
    const totalPets = selectedPets.reduce(
      (sum, pet) => sum + (pet.quantity ?? 0),
      0
    );
    if (totalPets === 0) return "Select Pet Info";
    return `${totalPets} pet${totalPets > 1 ? "s" : ""} selected`;
  };

  const getDisplayName = (petType: string) => {
    switch (petType) {
      case "dog":
        return "Dog";
      case "cat":
        return "Cat";
      case "farm_animal":
        return "Farm Animal";
      case "bird":
        return "Bird";
      case "reptile":
        return "Reptile";
      default:
        return petType;
    }
  };

  return (
    <div className="space-y-2" ref={dropdownRef}>
      <div>
        <h3 className="font-medium text-foreground">Pet Information</h3>
      </div>

      <div className="relative">
        <Card
          className="p-4 cursor-pointer bg-pet-input border-0 flex items-center justify-between"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-foreground">{getSelectedText()}</span>
            {isOpen ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </Card>

        {isOpen && (
          <Card className="absolute top-full left-0 right-0 z-50 mt-1 bg-pet-card border-0 shadow-lg max-h-[365px] overflow-y-auto">
            <div className="p-4 space-y-4">
              {defaultPets.map((pet) => (
                <div key={pet} className="flex items-center justify-between">
                  <span className="font-medium">{getDisplayName(pet)}</span>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 border-pet-brown text-pet-brown hover:bg-pet-brown hover:text-white bg-transparent"
                      onClick={() => updatePetCount(pet, -1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="min-w-[2ch] text-center font-medium">
                      {getPetCount(pet)}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 border-pet-brown text-pet-brown hover:bg-pet-brown hover:text-white bg-transparent"
                      onClick={() => updatePetCount(pet, 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {getCustomPets().map((customPetName) => (
                <div
                  key={`custom-${customPetName}`}
                  className="flex items-center justify-between"
                >
                  <span className="font-medium">{customPetName}</span>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 border-pet-brown text-pet-brown hover:bg-pet-brown hover:text-white bg-transparent"
                      onClick={() =>
                        updatePetCount("other_name", -1, customPetName)
                      }
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="min-w-[2ch] text-center font-medium">
                      {getPetCount("other_name", customPetName)}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 border-pet-brown text-pet-brown hover:bg-pet-brown hover:text-white bg-transparent"
                      onClick={() =>
                        updatePetCount("other_name", 1, customPetName)
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <div className="flex items-center space-x-2 pt-2 border-t">
                <Input
                  placeholder="Enter Other Pet"
                  value={customPet}
                  onChange={(e) => setCustomPet(e.target.value)}
                  className="flex-1 bg-pet-input border-0"
                  onKeyPress={(e) => e.key === "Enter" && addCustomPet()}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 border-pet-brown text-pet-brown hover:bg-pet-brown hover:text-white bg-transparent"
                  onClick={addCustomPet}
                  disabled={!customPet.trim()}
                >
                  Add
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
