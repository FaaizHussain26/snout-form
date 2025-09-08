"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { useIsMobile } from "@/hooks/useIsMobile";

interface DateTimeSelectorProps {
  onEntriesChange: (entries: Array<{ type: string; datetime: string }>) => void;
}

interface TimeEntry {
  id: string;
  date: Date;
  time: string;
  type: string;
}

const timeSlots = [
  "9:30 AM",
  "10:30 AM",
  "11:30 AM",
  "12:30 PM",
  "1:30 PM",
  "2:30 PM",
  "3:30 PM",
  "4:30 PM",
];

export const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
  onEntriesChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [duration, setDuration] = useState("30min");
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const isMobile = useIsMobile();
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const addEntry = () => {
    if (dateRange.from && selectedTimeSlot) {
      const newEntry: TimeEntry = {
        id: Date.now().toString(),
        date: dateRange.from,
        time: selectedTimeSlot,
        type: duration,
      };
      const updatedEntries = [...entries, newEntry];
      setEntries(updatedEntries);

      // Create combined date-time for the main form
      const [time, period] = selectedTimeSlot.split(" ");
      const [hours, minutes] = time.split(":").map(Number);
      const adjustedHours =
        period === "PM" && hours !== 12
          ? hours + 12
          : period === "AM" && hours === 12
          ? 0
          : hours;

      const dateTime = new Date(selectedDate);
      dateTime.setHours(adjustedHours, minutes);

      const formattedEntries = updatedEntries.map((entry) => {
        const [entryTime, entryPeriod] = entry.time.split(" ");
        const [entryHours, entryMinutes] = entryTime.split(":").map(Number);
        const entryAdjustedHours =
          entryPeriod === "PM" && entryHours !== 12
            ? entryHours + 12
            : entryPeriod === "AM" && entryHours === 12
            ? 0
            : entryHours;

        const entryDateTime = new Date(entry.date);
        entryDateTime.setHours(entryAdjustedHours, entryMinutes);

        return {
          type: entry.type,
          datetime: entryDateTime.toISOString(),
        };
      });

      onEntriesChange(formattedEntries);
    }
  };

  const removeEntry = (id: string) => {
    const updatedEntries = entries.filter((entry) => entry.id !== id);
    setEntries(updatedEntries);

    const formattedEntries = updatedEntries.map((entry) => {
      const [entryTime, entryPeriod] = entry.time.split(" ");
      const [entryHours, entryMinutes] = entryTime.split(":").map(Number);
      const entryAdjustedHours =
        entryPeriod === "PM" && entryHours !== 12
          ? entryHours + 12
          : entryPeriod === "AM" && entryHours === 12
          ? 0
          : entryHours;

      const entryDateTime = new Date(entry.date);
      entryDateTime.setHours(entryAdjustedHours, entryMinutes);

      return {
        type: entry.type,
        datetime: entryDateTime.toISOString(),
      };
    });

    onEntriesChange(formattedEntries);
  };

  const getDisplayText = () => {
    if (entries.length === 0) return "Choose date and time";
    return `${entries.length} appointment${
      entries.length > 1 ? "s" : ""
    } scheduled`;
  };

  return (
    <div className="space-y-2" ref={dropdownRef}>
      <div>
        <h3 className="font-medium text-foreground">For What Date and Time?</h3>
        <p className="text-sm text-muted-foreground">Date and Time</p>
      </div>

      <div className="relative max-h-[500px]">
        <Card
          className="p-4 cursor-pointer bg-pet-input border-0 flex items-center justify-between"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-foreground">{getDisplayText()}</span>
            {isOpen ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </Card>

        {isOpen && (
          <Card
            className="absolute top-full 
             left-0 right-0 z-50 mt-1 
             bg-pet-card border-0 
             shadow-lg 
             max-h-[64vh] 
             overflow-hidden
             sm:left-[-9px]
             sm:w-[568px] 
             sm:max-h-[320px] 
             sm:right-auto
             md:left-[-345px] 
             md:w-[680px] 
             md:max-h-[320px]"
          >
            <div className="flex flex-col sm:flex-row max-h-[36vh] sm:max-h-[450px]">
              <div
                className="flex-1 p-4 space-y-4 overflow-y-auto"
                style={{
                  maxHeight: "36vh",
                  overflowY: "auto",
                }}
              >
                <div
                  className="space-y-2 "
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h4 className="font-medium text-foreground">Select Time</h4>
                  <div className="flex space-x-2">
                    <Button
                      variant={duration === "30min" ? "default" : "outline"}
                      size="sm"
                      className={cn(
                        duration === "30min"
                          ? "bg-pet-brown hover:bg-pet-light-brown text-white"
                          : "border-pet-brown text-pet-brown hover:bg-pet-brown hover:text-white"
                      )}
                      onClick={() => setDuration("30min")}
                    >
                      30min
                    </Button>
                    <Button
                      variant={duration === "60min" ? "default" : "outline"}
                      size="sm"
                      className={cn(
                        duration === "60min"
                          ? "bg-pet-brown hover:bg-pet-light-brown text-white"
                          : "border-pet-brown text-pet-brown hover:bg-pet-brown hover:text-white"
                      )}
                      onClick={() => setDuration("60min")}
                    >
                      60min
                    </Button>
                  </div>
                </div>

                {/* Calendar */}
                <div className="flex justify-center">
                  <Calendar
                    style={{
                      width: "100%",
                    }}
                    mode="range"
                    selected={dateRange}
                    onSelect={(range) => {
                      if (range?.from) {
                        setDateRange({
                          from: range.from,
                          to: range.to,
                        });
                        setSelectedDate(range.from);
                      }
                    }}
                    className="rounded-md border-0 bg-transparent"
                  />
                </div>

                {/* Time Slot Selection */}
                <div className="space-y-3 display-flex">
                  <h4 className="font-medium text-foreground">
                    Select Time slot
                  </h4>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant="ghost"
                        className={cn(
                          "w-full justify-start text-left h-12 transition-all duration-200 font-medium border",
                          selectedTimeSlot === time
                            ? "bg-pet-brown hover:bg-pet-light-brown text-white border-pet-brown"
                            : "bg-pet-card hover:bg-pet-brown hover:text-white border-pet-card hover:border-pet-brown"
                        )}
                        onClick={() => setSelectedTimeSlot(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Mobile Entries Section */}
                {isMobile && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground text-lg">
                      Entries
                    </h4>
                    <div className="space-y-2">
                      {entries.length === 0 ? (
                        <div className="text-center text-muted-foreground text-sm py-8">
                          No entries yet
                        </div>
                      ) : (
                        entries.map((entry) => (
                          <div
                            key={entry.id}
                            className="flex items-center justify-between py-4 px-1 border-b border-border last:border-b-0"
                          >
                            <div className="space-y-1">
                              <div className="font-semibold text-foreground text-base">
                                {format(entry.date, "MMMM dd, yyyy")}
                              </div>
                              <div className="text-muted-foreground font-medium text-sm">
                                {entry.time} ({entry.type})
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              type="button"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-muted rounded-full transition-colors flex-shrink-0"
                              onClick={() => removeEntry(entry.id)}
                            >
                              <X className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>

                    <Button
                      type="button"
                      className="w-full h-12 bg-pet-brown hover:bg-pet-light-brown text-white font-medium"
                      onClick={addEntry}
                      disabled={!dateRange.from || !selectedTimeSlot}
                    >
                      Add Entry
                    </Button>
                  </div>
                )}
              </div>

              {/* Right Column: Entries - Desktop Only */}
              {!isMobile && (
                <div className="w-80 border-l border-border bg-white p-4 space-y-4 h-[400px] overflow-y-auto">
                  <h4 className="font-semibold text-foreground text-lg">
                    Entries
                  </h4>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {entries.length === 0 ? (
                      <div className="text-center text-muted-foreground text-sm py-8">
                        No entries yet
                      </div>
                    ) : (
                      entries.map((entry) => (
                        <div
                          key={entry.id}
                          className="flex items-center justify-between py-4 px-1 border-b border-border last:border-b-0"
                        >
                          <div className="space-y-1">
                            <div className="font-semibold text-foreground text-base">
                              {format(entry.date, "MMMM dd, yyyy")}
                            </div>
                            <div className="text-muted-foreground font-medium text-sm">
                              {entry.time} ({entry.type})
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            type="button"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-muted rounded-full transition-colors flex-shrink-0"
                            onClick={() => removeEntry(entry.id)}
                          >
                            <X className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>

                  <Button
                    type="button"
                    className="w-full h-12 bg-pet-brown hover:bg-pet-light-brown text-white font-medium"
                    onClick={addEntry}
                    disabled={!dateRange.from || !selectedTimeSlot}
                  >
                    Add Entry
                  </Button>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
