"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useCreateLead } from "@/hooks/useCreateLead"
import { bookingSchema, type BookingFormData } from "@/lib/booking-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronLeft, ChevronRight, Mail, Phone, User } from "lucide-react"
import type React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { DateTimeSelector } from "./DateAndTimeSelector"
import { HouseSittingSelector } from "./HouseSittingSelector"
import { PetSelector } from "./PetSelector"
import { PetTaxiSelector } from "./PetTaxiSelector"
import { ServiceSelection } from "./ServiceSelection"

export const MultiStepBookingForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSuccess, setIsSuccess] = useState(false)
  const [is24HourCare, setIs24HourCare] = useState(false)
  const [isRepeatWeekly, setIsRepeatWeekly] = useState(false)
  const [agreementAccepted, setAgreementAccepted] = useState(false)

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      selected_service: "drop_in",
      pet_information: [],
      selected_dates: [],
      address: "",
      starting_point: "",
      ending_point: "",
      start_time: "",
      end_time: "",
      contact_details: {
        name: "",
        phone_number: "",
        email: "",
      },
      specific_note: "",
    },
  })

  const { mutateAsync, isPending } = useCreateLead()
  const selectedService = form.watch("selected_service")
  const selectedDates = form.watch("selected_dates")
  const petInformation = form.watch("pet_information")

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = async (data: BookingFormData) => {
    if (!agreementAccepted) {
      return
    }

    await mutateAsync(data)
    setIsSuccess(true)
    form.reset()
    setCurrentStep(1)
    setAgreementAccepted(false)

    setTimeout(() => {
      setIsSuccess(false)
    }, 3000)
  }

  const canProceedToStep2 = () => {
    return selectedService && petInformation.length > 0
  }

  const canProceedToStep3 = () => {
    return selectedDates.length > 0
  }

  const getSortedDates = () => {
    return [...selectedDates].sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime())
  }

  const getTotalVisits = () => {
    return selectedDates.length
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === currentStep
                ? "bg-pet-brown text-white"
                : step < currentStep
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-600"
            }`}
          >
            {step}
          </div>
          {step < 3 && <div className={`w-12 h-1 mx-2 ${step < currentStep ? "bg-green-500" : "bg-gray-200"}`} />}
        </div>
      ))}
    </div>
  )

  return (
    <div className="bg-[#fce1ef] min-h-screen p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {renderStepIndicator()}

            {/* Step 1: Service and Pet Selection */}
            {currentStep === 1 && (
              <Card className="p-6 bg-white">
                <h2 className="text-2xl font-bold text-center mb-6 text-pet-brown">Select Service & Pets</h2>

                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="selected_service"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <ServiceSelection selectedService={field.value} onServiceChange={field.onChange} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pet_information"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <PetSelector selectedPets={field.value} onPetsChange={field.onChange} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Service-specific toggles */}
                  <div className="space-y-4">
                    {selectedService === "house_sitting" && (
                      <div className="flex items-center space-x-2">
                        <Switch id="24hour-care" checked={is24HourCare} onCheckedChange={setIs24HourCare} />
                        <Label htmlFor="24hour-care" className="text-sm font-medium">
                          24-hour care
                        </Label>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Switch id="repeat-weekly" checked={isRepeatWeekly} onCheckedChange={setIsRepeatWeekly} />
                      <Label htmlFor="repeat-weekly" className="text-sm font-medium">
                        Repeat weekly booking
                      </Label>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!canProceedToStep2()}
                      className="bg-pet-brown hover:bg-pet-light-brown text-white px-8"
                    >
                      Next <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Step 2: Date and Time Selection */}
            {currentStep === 2 && (
              <Card className="p-6 bg-white">
                <h2 className="text-2xl font-bold text-center mb-6 text-pet-brown">Select Dates & Times</h2>

                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="selected_dates"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          {selectedService === "house_sitting" ? (
                            <HouseSittingSelector onEntriesChange={field.onChange} />
                          ) : selectedService === "pet_taxi" ? (
                            <PetTaxiSelector onEntriesChange={field.onChange} />
                          ) : (
                            <DateTimeSelector onEntriesChange={field.onChange} />
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Summary Section */}
                  {selectedDates.length > 0 && (
                    <Card className="p-4 bg-gray-50">
                      <h3 className="font-semibold text-lg mb-3">Booking Summary</h3>
                      <div className="space-y-2">
                        <p className="text-sm">
                          <span className="font-medium">Total visits:</span> {getTotalVisits()}
                        </p>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Selected dates and times:</p>
                          {getSortedDates().map((dateEntry, index) => (
                            <div key={index} className="text-xs text-gray-600 ml-2">
                              {new Date(dateEntry.datetime).toLocaleDateString()} at{" "}
                              {new Date(dateEntry.datetime).toLocaleTimeString([], {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              })}
                              {dateEntry.type !== "pet_taxi" && ` (${dateEntry.type})`}
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  )}

                  <div className="flex justify-between">
                    <Button type="button" onClick={prevStep} variant="outline" className="px-8 bg-transparent">
                      <ChevronLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!canProceedToStep3()}
                      className="bg-pet-brown hover:bg-pet-light-brown text-white px-8"
                    >
                      Next <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Step 3: Contact Information */}
            {currentStep === 3 && (
              <Card className="p-6 bg-white">
                <h2 className="text-2xl font-bold text-center mb-6 text-pet-brown">Contact Information</h2>

                <div className="space-y-6">
                  {/* Address/Location Fields */}
                  {selectedService !== "pet_taxi" && (
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <div className="space-y-2">
                            <h3 className="font-medium text-foreground">Address</h3>
                            <FormControl>
                              <Input
                                placeholder="Enter your Address"
                                {...field}
                                className="bg-pet-input border-0 h-12"
                              />
                            </FormControl>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  )}

                  {selectedService === "pet_taxi" && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="starting_point"
                        render={({ field }) => (
                          <FormItem>
                            <div className="space-y-2">
                              <h3 className="font-medium text-foreground">Starting Point</h3>
                              <FormControl>
                                <Input
                                  placeholder="Enter your Starting Point"
                                  {...field}
                                  className="bg-pet-input border-0 h-12"
                                />
                              </FormControl>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="ending_point"
                        render={({ field }) => (
                          <FormItem>
                            <div className="space-y-2">
                              <h3 className="font-medium text-foreground">Ending Point</h3>
                              <FormControl>
                                <Input
                                  placeholder="Enter your Ending Point"
                                  {...field}
                                  className="bg-pet-input border-0 h-12"
                                />
                              </FormControl>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* House Sitting Times */}
                  {selectedService === "house_sitting" && (
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="start_time"
                        render={({ field }) => (
                          <FormItem>
                            <div className="space-y-2">
                              <h3 className="font-medium text-foreground">Start Time (First Day)</h3>
                              <FormControl>
                                <Input placeholder="e.g., 9:00 AM" {...field} className="bg-pet-input border-0 h-12" />
                              </FormControl>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="end_time"
                        render={({ field }) => (
                          <FormItem>
                            <div className="space-y-2">
                              <h3 className="font-medium text-foreground">End Time (Last Day)</h3>
                              <FormControl>
                                <Input placeholder="e.g., 6:00 PM" {...field} className="bg-pet-input border-0 h-12" />
                              </FormControl>
                              <FormMessage />
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Contact Details */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-foreground">Contact Details</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="contact_details.name"
                        render={({ field }) => (
                          <FormItem>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                              <FormControl>
                                <Input placeholder="Name" {...field} className="bg-pet-input border-0 h-12 pl-10" />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="contact_details.phone_number"
                        render={({ field }) => (
                          <FormItem>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                              <FormControl>
                                <Input placeholder="Phone" {...field} className="bg-pet-input border-0 h-12 pl-10" />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="contact_details.email"
                        render={({ field }) => (
                          <FormItem>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                              <FormControl>
                                <Input
                                  placeholder="Email"
                                  type="email"
                                  {...field}
                                  className="bg-pet-input border-0 h-12 pl-10"
                                />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Specific Notes */}
                  <FormField
                    control={form.control}
                    name="specific_note"
                    render={({ field }) => (
                      <FormItem>
                        <div className="space-y-2">
                          <h3 className="font-medium text-foreground">Specific Note</h3>
                          <FormControl>
                            <Textarea
                              placeholder="Enter specification"
                              {...field}
                              className="bg-pet-input border-0 resize-none"
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Agreement Checkbox */}
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="agreement"
                      checked={agreementAccepted}
                      onCheckedChange={(checked) => setAgreementAccepted(checked === true)}
                      className="mt-1"
                    />
                    <Label htmlFor="agreement" className="text-sm leading-relaxed">
                      I agree to Snout Services' booking policies, including deposits and cancellation windows, and I
                      understand all requests must be submitted through this form.
                    </Label>
                  </div>

                  <div className="flex justify-between">
                    <Button type="button" onClick={prevStep} variant="outline" className="px-8 bg-transparent">
                      <ChevronLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={isPending || isSuccess || !agreementAccepted}
                      className={`px-8 font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                        isSuccess
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-pet-brown hover:bg-pet-light-brown text-white"
                      }`}
                    >
                      {isPending ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Submitting...</span>
                        </div>
                      ) : isSuccess ? (
                        <div className="flex items-center space-x-2">
                          <span>✓</span>
                          <span>Submitted Successfully!</span>
                        </div>
                      ) : (
                        "Submit"
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </form>
        </Form>
      </div>
    </div>
  )
}
