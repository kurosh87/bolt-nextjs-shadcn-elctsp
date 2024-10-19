"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Plane, Hotel, MapPin, Utensils, Bookmark, Plus, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

// Mock data for trips and saved items
const trips = [
  {
    id: 1,
    destination: "Paris, France",
    dateRange: "June 15 - June 22, 2024",
    flight: "Air France 1234",
    hotel: "Le Grand Paris",
    activities: 3,
    restaurants: 2,
  },
]

const savedItems = [
  { id: 1, type: 'attraction', name: 'Eiffel Tower', description: 'Iconic iron tower' },
  { id: 2, type: 'restaurant', name: 'Le Chateaubriand', description: 'Modern French cuisine' },
  { id: 3, type: 'hotel', name: 'Ritz Paris', description: 'Luxury hotel in the heart of Paris' },
]

export default function TripsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [showSavedItems, setShowSavedItems] = useState(false)
  const [selectedItems, setSelectedItems] = useState<number[]>([])

  const toggleSavedItem = (itemId: number) => {
    setSelectedItems(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Your Trips</h1>
      
      <Tabs defaultValue="upcoming" className="mb-8">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="planning">Planning</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          {trips.map((trip) => (
            <Card key={trip.id} className="mb-6">
              <CardHeader>
                <CardTitle>{trip.destination}</CardTitle>
                <CardDescription>{trip.dateRange}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Plane className="w-5 h-5 mr-2" />
                    <span>Flight: {trip.flight}</span>
                  </div>
                  <div className="flex items-center">
                    <Hotel className="w-5 h-5 mr-2" />
                    <span>Hotel: {trip.hotel}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{trip.activities} Activities Planned</span>
                  </div>
                  <div className="flex items-center">
                    <Utensils className="w-5 h-5 mr-2" />
                    <span>{trip.restaurants} Restaurant Reservations</span>
                  </div>
                </div>
                <Accordion type="single" collapsible className="mt-4">
                  <AccordionItem value="itinerary">
                    <AccordionTrigger>View Itinerary</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold">Itinerary Items</h3>
                          <Button variant="outline" size="sm" onClick={() => setShowSavedItems(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Saved Item
                          </Button>
                        </div>
                        {selectedItems.length > 0 ? (
                          <ul className="space-y-2">
                            {savedItems.filter(item => selectedItems.includes(item.id)).map(item => (
                              <li key={item.id} className="flex justify-between items-center bg-secondary p-2 rounded">
                                <div>
                                  <span className="font-medium">{item.name}</span>
                                  <p className="text-sm text-muted-foreground">{item.description}</p>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => toggleSavedItem(item.id)}>
                                  <X className="w-4 h-4" />
                                </Button>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-muted-foreground">No items added to the itinerary yet.</p>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
              <CardFooter>
                <Button className="w-full">View Full Itinerary</Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="past">
          <p>You have no past trips.</p>
        </TabsContent>
        <TabsContent value="planning">
          <p>You have no trips in planning.</p>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Add New Trip</CardTitle>
          <CardDescription>Start planning your next adventure</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="destination">Destination</Label>
                <Input id="destination" placeholder="Where are you going?" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="dates">Dates</Label>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Create Trip</Button>
        </CardFooter>
      </Card>

      <Dialog open={showSavedItems} onOpenChange={setShowSavedItems}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Saved Items to Itinerary</DialogTitle>
            <DialogDescription>
              Select items to add to your trip itinerary.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {savedItems.map(item => (
              <div key={item.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`item-${item.id}`}
                  checked={selectedItems.includes(item.id)}
                  onChange={() => toggleSavedItem(item.id)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor={`item-${item.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {item.name}
                </label>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowSavedItems(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}