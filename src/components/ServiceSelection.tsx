import type React from "react";
import { Home, MapPin, Calendar, Car } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface ServiceSelectionProps {
  selectedService: string;
  onServiceChange: (service: string) => void;
}

const services = [
  { id: "drop_in", name: "Drops-In", icon: MapPin },
  { id: "house_sitting", name: "House Sitting", icon: Home },
  { id: "walks", name: "Walks", icon: Calendar },
  { id: "pet_taxi", name: "Pet Taxi", icon: Car },
];

export const ServiceSelection: React.FC<ServiceSelectionProps> = ({
  selectedService,
  onServiceChange,
}) => {
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-medium text-foreground">
        Services Selections
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {services.map((service) => {
          const IconComponent = service.icon;
          const isSelected = selectedService === service.id;

          return (
            <Card
              key={service.id}
              className={cn(
                "p-5 cursor-pointer transition-colors border-0 h-28 flex flex-col items-center justify-center ",
                isSelected
                  ? "bg-pet-brown text-white"
                  : "bg-pet-card hover:bg-pet-input"
              )}
              onClick={() => onServiceChange(service.id)}
            >
              <IconComponent className="h-24 w-24 mb-0" />
              <span className="text-sm font-medium text-center mt-0">
                {service.name}
              </span>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
