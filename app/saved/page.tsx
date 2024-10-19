"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bookmark, MapPin, Hotel, Utensils, Camera } from 'lucide-react'

// Mock data for saved items
const savedItems = [
  { id: 1, type: 'attraction', name: 'Eiffel Tower', description: 'Iconic iron tower', location: 'Paris, France', lat: 48.8584, lon: 2.2945, longDescription: 'The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France. It is named after the engineer Gustave Eiffel, whose company designed and built the tower. Constructed from 1887 to 1889 as the entrance arch to the 1889 World\'s Fair, it has become a global cultural icon of France and one of the most recognizable structures in the world.' },
  { id: 2, type: 'restaurant', name: 'Le Chateaubriand', description: 'Modern French cuisine', location: 'Paris, France', lat: 48.8631, lon: 2.3708, longDescription: 'Le Chateaubriand is a neo-bistro in Paris, France, run by chef Inaki Aizpitarte. It has been ranked among the world\'s 50 best restaurants. The restaurant is known for its innovative and ever-changing menu, which combines traditional French cuisine with modern techniques and international influences.' },
  { id: 3, type: 'hotel', name: 'Ritz Paris', description: 'Luxury hotel in the heart of Paris', location: 'Paris, France', lat: 48.8683, lon: 2.3282, longDescription: 'The Ritz Paris is a hotel in central Paris, overlooking the Place Vendôme in the city\'s 1st arrondissement. A member of the Leading Hotels of the World marketing group, the Ritz Paris is ranked among the most luxurious hotels in the world. The hotel was founded in 1898 by Swiss hotelier César Ritz in collaboration with French chef Auguste Escoffier.' },
  { id: 4, type: 'attraction', name: 'Louvre Museum', description: 'World\'s largest art museum', location: 'Paris, France', lat: 48.8606, lon: 2.3376, longDescription: 'The Louvre, or the Louvre Museum, is the world\'s largest art museum and a historic monument in Paris, France. A central landmark of the city, it is located on the Right Bank of the Seine in the city\'s 1st arrondissement. Approximately 38,000 objects from prehistory to the 21st century are exhibited over an area of 72,735 square meters.' },
  { id: 5, type: 'restaurant', name: 'Noma', description: 'World-renowned Nordic restaurant', location: 'Copenhagen, Denmark', lat: 55.6763, lon: 12.5681, longDescription: 'Noma is a two-Michelin-star restaurant run by chef René Redzepi in Copenhagen, Denmark. The name is a syllabic abbreviation of the two Danish words "nordisk" (Nordic) and "mad" (food). Opened in 2003, the restaurant is known for its reinvention and interpretation of the Nordic Cuisine.' },
]

export default function SavedItemsPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [selectedItem, setSelectedItem] = useState<typeof savedItems[0] | null>(null)
  const [isFullDetails, setIsFullDetails] = useState(false)

  const filteredItems = activeTab === 'all' 
    ? savedItems 
    : savedItems.filter(item => item.type === activeTab)

  const getIcon = (type: string) => {
    switch (type) {
      case 'attraction':
        return <Camera className="h-4 w-4" />
      case 'restaurant':
        return <Utensils className="h-4 w-4" />
      case 'hotel':
        return <Hotel className="h-4 w-4" />
      default:
        return <Bookmark className="h-4 w-4" />
    }
  }

  const handleViewMap = (item: typeof savedItems[0]) => {
    // In a real application, you'd want to update the map view and show a card on the map
    alert(`Viewing map for ${item.name} at coordinates: ${item.lat}, ${item.lon}`)
  }

  const handleLearnMore = (item: typeof savedItems[0]) => {
    setSelectedItem(item)
    setIsFullDetails(false)
  }

  const closeDetails = () => {
    setSelectedItem(null)
    setIsFullDetails(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Saved Items</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="attraction">Attractions</TabsTrigger>
          <TabsTrigger value="restaurant">Restaurants</TabsTrigger>
          <TabsTrigger value="hotel">Hotels</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between cursor-pointer" onClick={() => handleLearnMore(item)}>
                <span>{item.name}</span>
                {getIcon(item.type)}
              </CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="mr-1 h-4 w-4" />
                {item.location}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => handleViewMap(item)}>View Map</Button>
              <Button onClick={() => handleLearnMore(item)}>Learn More</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <p className="text-center text-muted-foreground mt-8">
          No saved items found in this category.
        </p>
      )}

      {selectedItem && (
        <div className="fixed inset-x-0 bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 p-4 space-y-4 transition-all duration-300 ease-in-out border-t">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold">{selectedItem.name}</h2>
            <Button variant="ghost" size="icon" onClick={closeDetails}>
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
          <p>{isFullDetails ? selectedItem.longDescription : selectedItem.description}</p>
          {!isFullDetails && (
            <Button onClick={() => setIsFullDetails(true)}>Read More</Button>
          )}
        </div>
      )}
    </div>
  )
}