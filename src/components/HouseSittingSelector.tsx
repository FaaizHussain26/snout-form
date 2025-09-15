"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"

interface HouseSittingSelectorProps {
  onEntriesChange: (entries: Array<{ type: string; datetime: string }>) => void
}

interface HouseSittingEntry {
  id: string
  dates: Date[]
  startTime: string
  endTime: string
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

export const HouseSittingSelector: React.FC<HouseSittingSelectorProps> = ({ onEntriesChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [entries, setEntries] = useState<HouseSittingEntry[]>([])

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
    if (selectedDates.length > 0 && startTime && endTime) {
      const newEntry: HouseSittingEntry = {
        id: Date.now().toString(),
        dates: [...selectedDates],
        startTime,
        endTime,
      }
      const updatedEntries = [...entries, newEntry]
      setEntries(updatedEntries)

      const formattedEntries = updatedEntries.flatMap((entry) => {
        return entry.dates.flatMap((date) => {
          const startEntry = {
            type: "house_sitting_start",
            datetime: combineDateTime(date, entry.startTime).toISOString(),
          }
          const endEntry = {
            type: "house_sitting_end",
            datetime: combineDateTime(date, entry.endTime).toISOString(),
          }
          return [startEntry, endEntry]
        })
      })

      onEntriesChange(formattedEntries)

      setSelectedDates([])
      setStartTime("")
      setEndTime("")
    }
  }

  const combineDateTime = (date: Date, time: string) => {
    const [timeStr, period] = time.split(" ")
    const [hours, minutes] = timeStr.split(":").map(Number)
    const adjustedHours = period === "PM" && hours !== 12 ? hours + 12 : period === "AM" && hours === 12 ? 0 : hours

    const dateTime = new Date(date)
    dateTime.setHours(adjustedHours, minutes)
    return dateTime
  }

  const removeEntry = (id: string) => {
    const updatedEntries = entries.filter((entry) => entry.id !== id)
    setEntries(updatedEntries)

    const formattedEntries = updatedEntries.flatMap((entry) => {
      return entry.dates.flatMap((date) => {
        const startEntry = {
          type: "house_sitting_start",
          datetime: combineDateTime(date, entry.startTime).toISOString(),
        }
        const endEntry = {
          type: "house_sitting_end",
          datetime: combineDateTime(date, entry.endTime).toISOString(),
        }
        return [startEntry, endEntry]
      })
    })

    onEntriesChange(formattedEntries)
  }

  const removeSelectedDate = (dateToRemove: Date) => {
    setSelectedDates(selectedDates.filter((d) => d.toDateString() !== dateToRemove.toDateString()))
  }

  const handleDateSelect = (dates: Date[] | Date | undefined) => {
    if (!dates) return
    setSelectedDates(Array.isArray(dates) ? dates : [dates])
  }

  const getDisplayText = () => {
    if (entries.length === 0) return "Choose dates and times"
    return `${entries.length} house sitting period${entries.length > 1 ? "s" : ""} scheduled`
  }

  return (
    <div className="space-y-2" ref={dropdownRef}>
      <div>
        <h3 className="font-medium text-foreground">House Sitting Period</h3>
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
         <Card className="absolute top-full left-0 right-0 z-50 mt-1 
                 bg-card border shadow-lg
                 max-h-[60vh] 
                 overflow-y-auto
                 ">
                     <div
                       className="flex-1 p-4 space-y-4 overflow-y-auto"
                       style={{
                         maxHeight: "30vh",
                         overflowY: "auto",
                       }}
                     >
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Select Dates</h4>
                <div className="flex justify-center">
                  <Calendar
                    style={{ width: "100%" }}
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
                        className="flex items-center gap-1 bg-pet-brown text-white px-3 py-1 rounded-full text-sm"
                      >
                        {format(date, "MMM dd, yyyy")}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-white/20"
                          onClick={() => removeSelectedDate(date)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">Start Time</h4>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant="ghost"
                        className={cn(
                          "w-full justify-start text-left h-10 transition-all duration-200 font-medium border",
                          startTime === time
                            ? "bg-pet-brown hover:bg-pet-light-brown text-white border-pet-brown"
                            : "bg-pet-card hover:bg-pet-brown hover:text-white border-pet-card hover:border-pet-brown",
                        )}
                        onClick={() => setStartTime(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">End Time</h4>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant="ghost"
                        className={cn(
                          "w-full justify-start text-left h-10 transition-all duration-200 font-medium border",
                          endTime === time
                            ? "bg-pet-brown hover:bg-pet-light-brown text-white border-pet-brown"
                            : "bg-pet-card hover:bg-pet-brown hover:text-white border-pet-card hover:border-pet-brown",
                        )}
                        onClick={() => setEndTime(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                type="button"
                className="w-full h-12 bg-pet-brown hover:bg-pet-light-brown text-white font-medium"
                onClick={addEntry}
                disabled={selectedDates.length === 0 || !startTime || !endTime}
              >
                Add {selectedDates.length > 0 ? `${selectedDates.length} ` : ""}House Sitting Period
                {selectedDates.length > 1 ? "s" : ""}
              </Button>

              {entries.length > 0 && (
                <div className="space-y-4 border-t pt-4">
                  <h4 className="font-semibold text-foreground text-lg">House Sitting Periods</h4>
                  <div className="space-y-2">
                    {entries.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between py-4 px-3 bg-pet-card rounded-lg border"
                      >
                        <div className="space-y-1">
                          <div className="font-semibold text-foreground text-sm">
                            {entry.dates.length === 1
                              ? format(entry.dates[0], "MMM dd, yyyy")
                              : `${entry.dates.length} dates selected`}
                          </div>
                          <div className="text-muted-foreground font-medium text-xs">
                            {entry.startTime} - {entry.endTime}
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
