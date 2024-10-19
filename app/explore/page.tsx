"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Map, { Marker, NavigationControl, FullscreenControl, ScaleControl, ViewState } from 'react-map-gl'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MapPin, Bookmark, Layers, Compass, Utensils, Hotel, Camera, Plane, Route, Globe, Star, Coffee, Cocktail, Bed, Flag, Maximize2, Minimize2, X, DollarSign, Mail, Phone, Search } from 'lucide-react'

const MAPBOX_TOKEN = 'pk.eyJ1IjoicmVhbGVzdGF0ZWJvdCIsImEiOiJjbHpza2V2d2MxbG92MmlzM2pvNmFobGRwIn0.9XtIh-QgEJ0AMXhzTFawew'

const categories = [
  { id: 'all', name: 'All', icon: Globe },
  { id: 'attractions', name: 'Attractions', icon: Camera },
  { id: 'food', name: 'Food & Drink', icon: Utensils },
  { id: 'hotels', name: 'Hotels', icon: Hotel },
  { id: 'flights', name: 'Flights', icon: Plane },
  { id: 'itineraries', name: 'Itineraries', icon: Route },
]

const continents = [
  { id: 'all', name: 'All Continents' },
  { id: 'africa', name: 'Africa' },
  { id: 'asia', name: 'Asia' },
  { id: 'europe', name: 'Europe' },
  { id: 'north-america', name: 'North America' },
  { id: 'south-america', name: 'South America' },
  { id: 'australia', name: 'Australia' },
  { id: 'antarctica', name: 'Antarctica' },
]

const mockData = [
  { id: 1, type: 'attractions', name: 'Eiffel Tower', description: 'Iconic iron tower', lat: 48.8584, lon: 2.2945, longDescription: 'The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France. It is named after the engineer Gustave Eiffel, whose company designed and built the tower.', image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80', rating: 4.7, reviews: 87500, priceLevel: 2, isOpen: true, phone: '+33 892 70 12 39', address: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France', tags: ['Europe', 'France', 'Île-de-France', 'Paris', 'Landmark'], continent: 'europe' },
  { id: 2, type: 'food', name: 'Le Chateaubriand', description: 'Modern French cuisine', lat: 48.8631, lon: 2.3708, longDescription: 'Le Chateaubriand is a neo-bistro in Paris, France, run by chef Inaki Aizpitarte. It has been ranked among the world\'s 50 best restaurants.', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80', rating: 4.5, reviews: 1200, priceLevel: 4, isOpen: true, phone: '+33 1 43 57 45 95', address: '129 Avenue Parmentier, 75011 Paris, France', tags: ['Europe', 'France', 'Île-de-France', 'Paris', 'Restaurant'], continent: 'europe' },
  { id: 3, type: 'hotels', name: 'Ritz Paris', description: 'Luxury hotel in the heart of Paris', lat: 48.8683, lon: 2.3282, longDescription: 'The Ritz Paris is a hotel in central Paris, overlooking the Place Vendôme in the city\'s 1st arrondissement. A member of the Leading Hotels of the World marketing group.', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80', rating: 4.8, reviews: 1800, priceLevel: 5, isOpen: true, phone: '+33 1 43 16 30 30', address: '15 Place Vendôme, 75001 Paris, France', tags: ['Europe', 'France', 'Île-de-France', 'Paris', 'Hotel'], continent: 'europe' },
  { id: 4, type: 'attractions', name: 'Louvre Museum', description: 'World\'s largest art museum', lat: 48.8606, lon: 2.3376, longDescription: 'The Louvre, or the Louvre Museum, is the world\'s largest art museum and a historic monument in Paris, France. A central landmark of the city, it is located on the Right Bank of the Seine.', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1420&q=80', rating: 4.6, reviews: 201000, priceLevel: 2, isOpen: false, phone: '+33 1 40 20 50 50', address: 'Rue de Rivoli, 75001 Paris, France', tags: ['Europe', 'France', 'Île-de-France', 'Paris', 'Museum'], continent: 'europe' },
  { id: 5, type: 'food', name: 'L\'Arpège', description: 'Three-Michelin-starred restaurant', lat: 48.8567, lon: 2.3163, longDescription: 'L\'Arpège is a three-Michelin-starred restaurant in Paris, France, run by chef Alain Passard. The restaurant is known for its focus on vegetables, with many ingredients coming from Passard\'s own organic farms.', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80', rating: 4.9, reviews: 950, priceLevel: 5, isOpen: true, phone: '+33 1 47 05 09 06', address: '84 Rue de Varenne, 75007 Paris, France', tags: ['Europe', 'France', 'Île-de-France', 'Paris', 'Restaurant'], continent: 'europe' },
]

export default function ExplorePage() {
  const [viewState, setViewState] = useState<ViewState>({
    latitude: 48.8566,
    longitude: 2.3522,
    zoom: 12,
    pitch: 0,
    bearing: 0
  })
  const [showSavedOnly, setShowSavedOnly] = useState(false)
  const [activeCategory, setActiveCategory] = useState(categories[0])
  const [savedItems, setSavedItems] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isMapFullscreen, setIsMapFullscreen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<typeof mockData[0] | null>(null)
  const [isFullDetails, setIsFullDetails] = useState(false)
  const [sortOption, setSortOption] = useState('default')
  const [selectedContinent, setSelectedContinent] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  const itemsPerPage = 3 // Reduced for demonstration purposes

  const filteredItems = mockData.filter(item => 
    (activeCategory.id === 'all' || item.type === activeCategory.id) &&
    (!showSavedOnly || savedItems.includes(item.id)) &&
    (selectedContinent === 'all' || item.continent === selectedContinent) &&
    (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
     item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  )

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortOption) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'rating':
        return b.rating - a.rating
      default:
        return 0
    }
  })

  const totalPages = Math.ceil(sortedItems.length / itemsPerPage)

  const paginatedItems = sortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const toggleSaved = (id: number) => {
    setSavedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = 0
    }
  }

  const handleViewOnMap = (item: typeof mockData[0]) => {
    if (mapLoaded) {
      setSelectedItem(item)
      setViewState({
        ...viewState,
        latitude: item.lat,
        longitude: item.lon,
        zoom: 14,
        transitionDuration: 1000
      })
    }
  }

  const handleMapLoad = useCallback(() => {
    setMapLoaded(true)
  }, [])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
    setCurrentPage(1) // Reset to first page when search query changes
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      <div className="p-4 border-b flex items-center justify-between">
        <ScrollArea className="w-[calc(100%-200px)] whitespace-nowrap">
          <div className="flex space-x-4 items-center">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={activeCategory.id === category.id ? "default" : "outline"}
                className="flex items-center space-x-2"
                onClick={() => setActiveCategory(category)}
              >
                <category.icon className="w-4 h-4" />
                <span>{category.name}</span>
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <div className="flex items-center space-x-2 ml-4">
          <Switch
            id="show-saved"
            checked={showSavedOnly}
            onCheckedChange={setShowSavedOnly}
          />
          <Label htmlFor="show-saved">Show saved only</Label>
        </div>
      </div>
      <div className="flex-1 flex overflow-hidden">
        {!isMapFullscreen && (
          <div className="w-1/2 flex flex-col">
            <ScrollArea className="flex-1" ref={scrollAreaRef}>
              <div className="p-4 space-y-4">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-2">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search places, hotels, restaurants..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="flex-grow"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <Select value={sortOption} onValueChange={setSortOption}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="rating">Rating</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={selectedContinent} onValueChange={setSelectedContinent}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select continent" />
                      </SelectTrigger>
                      <SelectContent>
                        {continents.map(continent => (
                          <SelectItem key={continent.id} value={continent.id}>
                            {continent.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {paginatedItems.map((item) => (
                  <Card 
                    key={item.id}
                    className="overflow-hidden group"
                  >
                    <div className="relative h-48">
                      <Image
                        src={item.image}
                        alt={item.name}
                        layout="fill"
                        objectFit="cover"
                      />
                      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm">
                        <div className="p-4 flex justify-between items-start text-white">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl font-bold">{item.rating.toFixed(1)}</span>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(item.rating) ? 'text-yellow-400' : 'text-gray-400'}`} />
                                ))}
                              </div>
                            </div>
                            <div className="text-sm">{item.reviews.toLocaleString()} reviews</div>
                          </div>
                          <div className="flex space-x-2">
                            <Badge variant="secondary" className="bg-white/80 text-black">
                              {item.isOpen ? 'OPEN' : 'CLOSED'}
                            </Badge>
                            <Badge variant="secondary" className="bg-white/80 text-black">
                              {'$'.repeat(item.priceLevel)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        {item.name}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleSaved(item.id)}
                        >
                          <Bookmark
                            className={`h-4 w-4 ${savedItems.includes(item.id) ? 'fill-current' : ''}`}
                          />
                        </Button>
                      </CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag, index) => (
                          <Badge key={index} variant="outline">{tag}</Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                      <Button variant="outline" onClick={() => handleViewOnMap(item)}>
                        <MapPin className="mr-2 h-4 w-4" /> View on Map
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                    <div className="max-h-0 overflow-hidden transition-all duration-300 ease-in-out group-hover:max-h-40">
                      <Separator />
                      <CardContent className="py-2">
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4" />
                          <span>{item.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <MapPin className="h-4 w-4" />
                          <span>{item.address}</span>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
                {totalPages > 1 && (
                  <div className="mt-4">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                          />
                        </PaginationItem>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => handlePageChange(page)}
                              isActive={currentPage === page}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        <PaginationItem>
                          <PaginationNext
                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        )}
        <div className={`relative ${isMapFullscreen ? "w-full" : "w-1/2"}`}>
          <Map
            {...viewState}
            onMove={evt => setViewState(evt.viewState)}
            onLoad={handleMapLoad}
            style={{width: '100%', height: '100%'}}
            mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
            mapboxAccessToken={MAPBOX_TOKEN}
            projection="globe"
            ref={(ref) => {
              if (ref) {
                mapRef.current = ref.getMap()
              }
            }}
          >
            {mapLoaded && (
              <>
                <NavigationControl position="top-right" />
                <FullscreenControl position="top-right" />
                <ScaleControl position="bottom-right" />
                {filteredItems.map(item => (
                  <Marker
                    key={item.id}
                    latitude={item.lat}
                    longitude={item.lon}
                  >
                    <MapPin 
                      className={`text-red-500 ${selectedItem?.id === item.id ? 'text-blue-500' : ''}`} 
                      onClick={() => handleViewOnMap(item)}
                    />
                  </Marker>
                ))}
              </>
            )}
          </Map>
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-4 left-4 z-10"
            onClick={() => setIsMapFullscreen(!isMapFullscreen)}
          >
            {isMapFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}