
import React, { useEffect, useRef, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Locate } from 'lucide-react';

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Load Google Maps API
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = initializeMap;
    script.onerror = () => {
      toast({
        title: "Error",
        description: "Failed to load map. Please try again later.",
        variant: "destructive"
      });
      setLoading(false);
    };
    
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const initializeMap = () => {
    if (!mapContainer.current) return;
    
    // Default location (will be replaced with user's location)
    const defaultLocation = { lat: 37.7749, lng: -122.4194 }; // San Francisco
    
    // Create map with default location
    map.current = new google.maps.Map(mapContainer.current, {
      center: defaultLocation,
      zoom: 14,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      styles: [
        {
          featureType: "poi.business",
          stylers: [{ visibility: "off" }]
        },
        {
          featureType: "poi.medical",
          stylers: [{ visibility: "on" }]
        }
      ]
    });
    
    // Try to get user's current location
    getCurrentLocation();
  };

  const getCurrentLocation = () => {
    setLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          setLocation(userLocation);
          
          if (map.current) {
            map.current.setCenter(userLocation);
            
            // Add marker for user location
            new google.maps.Marker({
              position: userLocation,
              map: map.current,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: "#4285F4",
                fillOpacity: 1,
                strokeColor: "white",
                strokeWeight: 2,
              },
              title: "Your Location"
            });
            
            // Search for nearby medical facilities
            searchNearbyMedical(userLocation);
          }
          
          setLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Location Error",
            description: "Unable to get your location. Check browser permissions.",
            variant: "destructive"
          });
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const searchNearbyMedical = (location: {lat: number, lng: number}) => {
    if (!map.current) return;
    
    const service = new google.maps.places.PlacesService(map.current);
    
    service.nearbySearch(
      {
        location: location,
        radius: 2000, // 2km radius
        type: "hospital"
      },
      (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          for (let i = 0; i < results.length; i++) {
            createMarker(results[i]);
          }
        }
      }
    );
  };

  const createMarker = (place: google.maps.places.PlaceResult) => {
    if (!map.current || !place.geometry || !place.geometry.location) return;
    
    const marker = new google.maps.Marker({
      map: map.current,
      position: place.geometry.location,
      icon: {
        url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
      }
    });
    
    const infoWindow = new google.maps.InfoWindow();
    
    google.maps.event.addListener(marker, "click", () => {
      const content = `
        <div>
          <h3 style="margin: 0; font-weight: 600;">${place.name}</h3>
          <p style="margin: 5px 0;">${place.vicinity}</p>
          ${place.rating ? `<p style="margin: 5px 0;">Rating: ${place.rating} ⭐</p>` : ''}
        </div>
      `;
      
      infoWindow.setContent(content);
      infoWindow.open(map.current, marker);
    });
  };

  return (
    <div className="relative h-[calc(100vh-4rem)]">
      <div ref={mapContainer} className="w-full h-full rounded-md shadow-md"></div>
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-healthcare-blue border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-healthcare-dark-blue font-medium">Loading map...</p>
          </div>
        </div>
      )}
      
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button 
          variant="default" 
          size="icon" 
          onClick={getCurrentLocation}
          className="bg-white text-healthcare-dark-blue hover:bg-healthcare-light-purple shadow-md"
        >
          <Locate className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg">
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-healthcare-blue" />
          <span className="text-sm font-medium">{location ? "Current Location" : "Location not available"}</span>
        </div>
      </div>
    </div>
  );
};

export default Map;
