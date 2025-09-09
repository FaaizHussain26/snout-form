"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateLead } from "@/hooks/useCreateLead";
import { bookingSchema, type BookingFormData } from "@/lib/booking-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Phone, User } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { DateTimeSelector } from "./DateAndTimeSelector";
import { HouseSittingSelector } from "./HouseSittingSelector";
import { PetSelector } from "./PetSelector";
import { PetTaxiSelector } from "./PetTaxiSelector";
import { ServiceSelection } from "./ServiceSelection";

export const PetCareBookingForm: React.FC = () => {
  const [isSuccess, setIsSuccess] = useState(false);

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
  });

  const { mutateAsync, isPending } = useCreateLead();
  const selectedService = form.watch("selected_service");

  const onSubmit = async (data: BookingFormData) => {
    await mutateAsync(data);
    setIsSuccess(true);
    form.reset();

    setTimeout(() => {
      setIsSuccess(false);
    }, 3000);
  };

  return (
    <div className="bg-[#fce1ef] p-2 md:p-6 overflow-hidden">
      <div className="max-w-2xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <div className="p-2 bg-[#FFE6F4]">
              <FormField
                control={form.control}
                name="selected_service"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ServiceSelection
                        selectedService={field.value}
                        onServiceChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-3 p-2 bg-[#FFE6F4]">
              <FormField
                control={form.control}
                name="pet_information"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <PetSelector
                        selectedPets={field.value}
                        onPetsChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="selected_dates"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      {selectedService === "house_sitting" ? (
                        <HouseSittingSelector
                          onEntriesChange={field.onChange}
                        />
                      ) : selectedService === "pet_taxi" ? (
                        <PetTaxiSelector
                          onEntriesChange={field.onChange}
                          onAddressesChange={(addresses) => {
                            form.setValue(
                              "starting_point",
                              addresses.starting_point
                            );
                            form.setValue(
                              "ending_point",
                              addresses.ending_point
                            );
                          }}
                        />
                      ) : (
                        <DateTimeSelector onEntriesChange={field.onChange} />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {selectedService !== "pet_taxi" && (
              <div className="p-2 bg-[#FFE6F4]">
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
              </div>
            )}

            {selectedService === "house_sitting" && (
              <div className="grid md:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="start_time"
                  render={({ field }) => (
                    <FormItem>
                      <div className="space-y-2">
                        <h3 className="font-medium text-foreground">
                          Start Time (First Day)
                        </h3>
                        <FormControl>
                          <Input
                            placeholder="e.g., 9:00 AM"
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
                  name="end_time"
                  render={({ field }) => (
                    <FormItem>
                      <div className="space-y-2">
                        <h3 className="font-medium text-foreground">
                          End Time (Last Day)
                        </h3>
                        <FormControl>
                          <Input
                            placeholder="e.g., 6:00 PM"
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

            <div className="space-y-2 p-2 bg-[#FFE6F4]">
              <h3 className="font-medium text-foreground mb-0">
                Contact Details
              </h3>
              <div className="grid md:grid-cols-3 gap-3 mt-0">
                <FormField
                  control={form.control}
                  name="contact_details.name"
                  render={({ field }) => (
                    <FormItem>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <FormControl>
                          <Input
                            placeholder="Name"
                            {...field}
                            className="bg-pet-input border-0 h-12 pl-10"
                          />
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
                          <Input
                            placeholder="Phone"
                            {...field}
                            className="bg-pet-input border-0 h-12 pl-10"
                          />
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

            <div className="p-2 bg-[#FFE6F4]">
              <FormField
                control={form.control}
                name="specific_note"
                render={({ field }) => (
                  <FormItem>
                    <div className="space-y-2">
                      <h3 className="font-medium text-foreground">
                        Specific Note
                      </h3>
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
            </div>

            <Button
              type="submit"
              disabled={isPending || isSuccess}
              className={`w-full h-12 font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
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
          </form>
        </Form>
      </div>
    </div>
  );
};
