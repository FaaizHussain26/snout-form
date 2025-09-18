"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"

interface PetTaxiSelectorProps {
  onEntriesChange: (entries: Array<{ type: string; datetime: string }>) => void
}

interface PetTaxiEntry {
  id: string
  date: Date
  time: string
}

const timeSlots = [
  "6:00 AM",
  "7:00 AM",
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
  "10:00 PM",
]

export const PetTaxiSelector: React.FC<PetTaxiSelectorProps> = ({ onEntriesChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("")
  const [entries, setEntries] = useState<PetTaxiEntry[]>([])
  const [selectedDates, setSelectedDates] = useState<Date[]>([])

  const dropdownRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isWithinIframe = window.self !== window.top
      const target = event.target as Node

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        (!isWithinIframe || target.ownerDocument === document)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside, true)
    } else {
      document.removeEventListener("mousedown", handleClickOutside, true)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true)
    }
  }, [isOpen])

  const addEntry = () => {
    if (selectedDates.length > 0 && selectedTimeSlot) {
      const newEntries: PetTaxiEntry[] = selectedDates.map((date) => ({
        id: `${Date.now()}-${date.getTime()}`,
        date: date,
        time: selectedTimeSlot,
      }))

      const updatedEntries = [...entries, ...newEntries]
      setEntries(updatedEntries)

      const formattedEntries = updatedEntries.map((entry) => {
        const [entryTime, entryPeriod] = entry.time.split(" ")
        const [entryHours, entryMinutes] = entryTime.split(":").map(Number)
        const entryAdjustedHours =
          entryPeriod === "PM" && entryHours !== 12
            ? entryHours + 12
            : entryPeriod === "AM" && entryHours === 12
              ? 0
              : entryHours

        const entryDateTime = new Date(entry.date)
        entryDateTime.setHours(entryAdjustedHours, entryMinutes)

        return {
          type: "pet_taxi",
          datetime: entryDateTime.toISOString(),
        }
      })

      onEntriesChange(formattedEntries)

      setSelectedDates([])
      setSelectedTimeSlot("")
    }
  }

  const removeEntry = (id: string) => {
    const updatedEntries = entries.filter((entry) => entry.id !== id)
    setEntries(updatedEntries)

    const formattedEntries = updatedEntries.map((entry) => {
      const [entryTime, entryPeriod] = entry.time.split(" ")
      const [entryHours, entryMinutes] = entryTime.split(":").map(Number)
      const entryAdjustedHours =
        entryPeriod === "PM" && entryHours !== 12
          ? entryHours + 12
          : entryPeriod === "AM" && entryHours === 12
            ? 0
            : entryHours

      const entryDateTime = new Date(entry.date)
      entryDateTime.setHours(entryAdjustedHours, entryMinutes)

      return {
        type: "pet_taxi",
        datetime: entryDateTime.toISOString(),
      }
    })

    onEntriesChange(formattedEntries)
  }

  const removeSelectedDate = (dateToRemove: Date) => {
    setSelectedDates(selectedDates.filter((date) => date.getTime() !== dateToRemove.getTime()))
  }

  const getDisplayText = () => {
    if (entries.length === 0) {
      if (selectedDates.length > 0) {
        return `${selectedDates.length} date${selectedDates.length > 1 ? "s" : ""} selected`
      }
      return "Choose pet taxi dates and times"
    }
    return `${entries.length} pet taxi trip${entries.length > 1 ? "s" : ""} scheduled`
  }

  return (
    <div className="space-y-2" ref={dropdownRef}>
      <div>
        <h3 className="font-medium text-foreground">Pet Taxi Service</h3>
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
            className="absolute top-full left-0 right-0 z-50 mt-1 
                   bg-card border shadow-lg
                   max-h-[60vh] 
                   overflow-y-auto
                   "
          >
            <div
              className="p-4 space-y-4 overflow-y-auto"
              style={{
                maxHeight: "30vh",
                overflowY: "auto",
              }}
            >
              {/* Calendar */}
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Select Dates</h4>
                <div className="flex justify-center">
                  <Calendar
                    style={{ width: "100%" }}
                    mode="multiple"
                    selected={selectedDates}
                    onSelect={(dates) => {
                      if (dates) {
                        setSelectedDates(Array.isArray(dates) ? dates : [dates])
                      }
                    }}
                    className="rounded-md border-0 bg-transparent"
                  />
                </div>
              </div>

              {/* Selected Dates Pills */}
              {selectedDates.length > 0 && (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {selectedDates.map((date) => (
                      <div
                        key={date.getTime()}
                        className="flex items-center gap-1 bg-pet-brown text-white px-3 py-1 rounded-full text-sm"
                      >
                        <span>{format(date, "MMM dd")}</span>
                        <button
                          type="button"
                          onClick={() => removeSelectedDate(date)}
                          className="hover:bg-pet-light-brown rounded-full p-0.5 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3 mt-5">
                <h4 className="font-medium text-foreground" style={{ marginTop: "40px" }}>
                  Select Time
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant="ghost"
                      className={cn(
                        "justify-center text-center h-10 transition-all duration-200 font-medium border",
                        selectedTimeSlot === time
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card hover:bg-primary hover:text-primary-foreground border-border hover:border-primary",
                      )}
                      onClick={() => setSelectedTimeSlot(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Add Button */}
              <Button
                type="button"
                className="w-full h-12 bg-pet-brown hover:bg-pet-light-brown text-white font-medium"
                onClick={addEntry}
                disabled={selectedDates.length === 0 || !selectedTimeSlot}
              >
                Add Pet Taxi Trip{selectedDates.length > 1 ? "s" : ""}
              </Button>

              {/* Entries List */}
              {entries.length > 0 && (
                <div className="space-y-4 border-t border-border pt-4">
                  <h4 className="font-semibold text-foreground text-lg">Scheduled Pet Taxi Trips</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {entries.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between py-3 px-2 bg-pet-input rounded-lg"
                      >
                        <div className="space-y-1">
                          <div className="font-semibold text-foreground text-sm">
                            {format(entry.date, "MMM dd, yyyy")}
                          </div>
                          <div className="text-muted-foreground font-medium text-xs">{entry.time}</div>
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
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
