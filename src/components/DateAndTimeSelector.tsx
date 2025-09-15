"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"

interface DateTimeSelectorProps {
  onEntriesChange: (entries: Array<{ type: string; datetime: string }>) => void
}

interface TimeEntry {
  id: string
  date: Date
  time: string
  type: string
}

const timeSlots = ["9:30 AM", "10:30 AM", "11:30 AM", "12:30 PM", "1:30 PM", "2:30 PM", "3:30 PM", "4:30 PM"]

export const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({ onEntriesChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("")
  const [duration, setDuration] = useState("30min")
  const [entries, setEntries] = useState<TimeEntry[]>([])

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
      const newEntries: TimeEntry[] = selectedDates.map((date) => ({
        id: `${date.getTime()}-${selectedTimeSlot}`,
        date,
        time: selectedTimeSlot,
        type: duration,
      }))

      const updatedEntries = [...entries, ...newEntries]
      setEntries(updatedEntries)

      // Format entries for the backend
      const formattedEntries = updatedEntries.map((entry) => {
        const [time, period] = entry.time.split(" ")
        const [hours, minutes] = time.split(":").map(Number)
        const adjustedHours = period === "PM" && hours !== 12 ? hours + 12 : period === "AM" && hours === 12 ? 0 : hours

        const dateTime = new Date(entry.date)
        dateTime.setHours(adjustedHours, minutes)

        return {
          type: entry.type,
          datetime: dateTime.toISOString(),
        }
      })

      onEntriesChange(formattedEntries)

      // Reset selections after adding
      setSelectedDates([])
      setSelectedTimeSlot("")
    }
  }

  const removeEntry = (id: string) => {
    const updatedEntries = entries.filter((entry) => entry.id !== id)
    setEntries(updatedEntries)

    const formattedEntries = updatedEntries.map((entry) => {
      const [time, period] = entry.time.split(" ")
      const [hours, minutes] = time.split(":").map(Number)
      const adjustedHours = period === "PM" && hours !== 12 ? hours + 12 : period === "AM" && hours === 12 ? 0 : hours

      const dateTime = new Date(entry.date)
      dateTime.setHours(adjustedHours, minutes)

      return {
        type: entry.type,
        datetime: dateTime.toISOString(),
      }
    })

    onEntriesChange(formattedEntries)
  }

  const getDisplayText = () => {
    if (entries.length === 0) {
      return "Choose dates and times"
    }
    return `${entries.length} appointment${entries.length > 1 ? "s" : ""} scheduled`
  }

  const handleDateSelect = (dates: Date[] | Date | undefined) => {
    if (!dates) return

    setSelectedDates(Array.isArray(dates) ? dates : [dates])
  }

  const removeSelectedDate = (dateToRemove: Date) => {
    setSelectedDates(selectedDates.filter((d) => d.toDateString() !== dateToRemove.toDateString()))
  }

  return (
    <div className="space-y-2" ref={dropdownRef}>
      <div>
        <h3 className="font-medium text-foreground">For What Date and Time?</h3>
      </div>

      <div className="relative">
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
          <Card className="absolute top-full left-0 right-0 z-50 mt-1 
          bg-card border shadow-lg
          max-h-[80vh] 
          md:max-h-[60vh] 
          overflow-y-auto
          sm:max-h-[250px] 
          md:max-h-[400px]
          ">
              <div
                className="flex-1 p-4 space-y-4 overflow-y-auto"
                style={{
                  maxHeight: "45vh",
                  overflowY: "auto",
                }}
              >
              {/* Duration Selection */}
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-foreground">Duration</h4>
                <div className="flex space-x-2">
                  <Button
                    variant={duration === "30min" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDuration("30min")}
                  >
                    30min
                  </Button>
                  <Button
                    variant={duration === "60min" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDuration("60min")}
                  >
                    60min
                  </Button>
                </div>
              </div>

              {/* Calendar */}
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Select Dates</h4>
                <div className="flex justify-center">
                  <Calendar
                    mode="multiple"
                    selected={selectedDates}
                    onSelect={handleDateSelect}
                    className="rounded-md border-0 bg-transparent"
                  />
                </div>
              </div>

              {selectedDates.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Selected Dates</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDates.map((date) => (
                      <div
                        key={date.toISOString()}
                        className="flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm"
                      >
                        {format(date, "MMM dd, yyyy")}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-primary-foreground/20"
                          onClick={() => removeSelectedDate(date)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Time Slot Selection */}
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Select Time</h4>
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

              {/* Add Entry Button */}
              <Button
                type="button"
                className="w-full h-12 font-medium"
                onClick={addEntry}
                disabled={selectedDates.length === 0 || !selectedTimeSlot}
              >
                Add {selectedDates.length > 0 ? `${selectedDates.length} ` : ""}Appointment
                {selectedDates.length > 1 ? "s" : ""}
              </Button>

              {entries.length > 0 && (
                <div className="space-y-3 border-t pt-4">
                  <h4 className="font-medium text-foreground">Scheduled Appointments</h4>
                  <div className="space-y-2">
                    {entries.map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="space-y-1">
                          <div className="font-medium text-foreground">{format(entry.date, "MMM dd, yyyy")}</div>
                          <div className="text-sm text-muted-foreground">
                            {entry.time} ({entry.type})
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => removeEntry(entry.id)}
                        >
                          <X className="h-4 w-4" />
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
