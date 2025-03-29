
import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Layout from '@/components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { MapPin, Loader, MapIcon } from 'lucide-react';
import { getAuthUser } from '@/utils/authUtils';
import { useNavigate } from 'react-router-dom';

// Temporary Mapbox token input component
const MapboxTokenInput = ({ onTokenSubmit }: { onTokenSubmit: (token: string) => void }) => {
  const [token, setToken] = useState('');

  return (
    <div className="p-6 max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Enter Mapbox Access Token</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            To use the map feature, please enter your Mapbox public token. You can get one by creating an account at{' '}
            <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-healthcare-blue hover:underline">
              mapbox.com
            </a>
            .
          </p>
          <div className="flex flex-col space-y-4">
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter your Mapbox public token"
              className="w-full px-3 py-2 border rounded-md"
            />
            <Button onClick={() => onTokenSubmit(token)} disabled={!token}>
              Submit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const MapPage = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState<number>(-70);
  const [lat, setLat] = useState<number>(40);
  const [zoom, setZoom] = useState<number>(9);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const user = getAuthUser();
  const navigate = useNavigate();

  // Check if user is authenticated
  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to view this page.",
        variant: "destructive"
      });
      navigate('/login');
    }
  }, [navigate, user]);

  // Get user's current location
  useEffect(() => {
    if (!mapboxToken) return;
    
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLng(position.coords.longitude);
          setLoading(false);
        },
        (err) => {
          setError(`Error getting location: ${err.message}`);
          setLoading(false);
          toast({
            title: "Location Error",
            description: `Could not get your location: ${err.message}`,
            variant: "destructive"
          });
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      toast({
        title: "Browser Compatibility Issue",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive"
      });
    }
  }, [mapboxToken]);

  // Initialize map once we have coordinates and token
  useEffect(() => {
    if (!mapboxToken || loading || error || !mapContainer.current) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add user location marker
    const marker = new mapboxgl.Marker({ color: "#0EA5E9" })
      .setLngLat([lng, lat])
      .setPopup(new mapboxgl.Popup().setHTML(`<h3>${user?.role === 'doctor' ? 'Your Practice' : 'You are here'}</h3>`))
      .addTo(map.current);
    
    marker.togglePopup(); // Show the popup by default

    // Add nearby healthcare facilities if user is a patient
    if (user?.role === 'patient') {
      // This would typically be an API call to get nearby healthcare facilities
      // For demo purposes, we're adding mock facilities
      const mockFacilities = [
        { name: "General Hospital", lng: lng + 0.01, lat: lat + 0.01, type: "Hospital" },
        { name: "City Medical Center", lng: lng - 0.015, lat: lat - 0.01, type: "Medical Center" },
        { name: "Family Clinic", lng: lng + 0.02, lat: lat - 0.02, type: "Clinic" }
      ];

      mockFacilities.forEach(facility => {
        new mapboxgl.Marker({ color: "#9b87f5" })
          .setLngLat([facility.lng, facility.lat])
          .setPopup(new mapboxgl.Popup().setHTML(
            `<h3>${facility.name}</h3><p>${facility.type}</p>`
          ))
          .addTo(map.current);
      });
    }

    // Add doctor's patients' locations if user is a doctor
    if (user?.role === 'doctor') {
      // This would typically be an API call to get patient locations
      // For demo purposes, we're adding mock patient locations
      const mockPatients = [
        { name: "Patient A", lng: lng + 0.03, lat: lat + 0.02 },
        { name: "Patient B", lng: lng - 0.025, lat: lat - 0.015 },
        { name: "Patient C", lng: lng + 0.01, lat: lat - 0.03 }
      ];

      mockPatients.forEach(patient => {
        new mapboxgl.Marker({ color: "#E5DEFF" })
          .setLngLat([patient.lng, patient.lat])
          .setPopup(new mapboxgl.Popup().setHTML(
            `<h3>${patient.name}</h3><p>Your Patient</p>`
          ))
          .addTo(map.current);
      });
    }

    map.current.on('move', () => {
      if (!map.current) return;
      setLng(parseFloat(map.current.getCenter().lng.toFixed(4)));
      setLat(parseFloat(map.current.getCenter().lat.toFixed(4)));
      setZoom(parseFloat(map.current.getZoom().toFixed(2)));
    });

    return () => {
      map.current?.remove();
    };
  }, [lng, lat, zoom, loading, error, mapboxToken, user]);

  const handleTokenSubmit = (token: string) => {
    setMapboxToken(token);
    localStorage.setItem('mapbox_token', token); // Store token for future use
  };

  if (!mapboxToken) {
    return <MapboxTokenInput onTokenSubmit={handleTokenSubmit} />;
  }

  return (
    <Layout>
      <div className="healthcare-container py-8">
        <h1 className="text-3xl font-bold text-healthcare-blue mb-6">
          {user?.role === 'doctor' ? 'Practice Location & Patient Map' : 'Healthcare Facilities Near You'}
        </h1>
        
        <Card className="mb-6">
          <CardContent className="p-0">
            {loading ? (
              <div className="h-[500px] flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <Loader className="animate-spin h-10 w-10 text-healthcare-blue mb-4" />
                  <p>Loading your location...</p>
                </div>
              </div>
            ) : error ? (
              <div className="h-[500px] flex items-center justify-center">
                <div className="text-center p-6">
                  <MapIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Location Error</h3>
                  <p className="text-muted-foreground mb-4">{error}</p>
                  <Button onClick={() => window.location.reload()}>
                    Try Again
                  </Button>
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="h-[500px]" ref={mapContainer} />
                <div className="absolute top-4 left-4 bg-white p-2 rounded-md shadow-md z-10">
                  <div className="text-xs font-mono">
                    Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-healthcare-blue" />
                <p>
                  {loading ? 'Fetching your coordinates...' : `${lat.toFixed(4)}, ${lng.toFixed(4)}`}
                </p>
              </div>
              <p className="mt-4 text-muted-foreground">
                {user?.role === 'doctor' 
                  ? 'This map shows your practice location and approximate locations of your patients.'
                  : 'This map shows your current location and nearby healthcare facilities.'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {user?.role === 'doctor' ? 'Your Patients' : 'Nearby Facilities'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user?.role === 'doctor' ? (
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full bg-[#E5DEFF]" />
                    <span>Patient location markers</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full bg-[#0EA5E9]" />
                    <span>Your practice location</span>
                  </li>
                  <p className="mt-4 text-sm text-muted-foreground">
                    Note: Patient locations shown are approximate to protect privacy.
                  </p>
                </ul>
              ) : (
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full bg-[#9b87f5]" />
                    <span>Healthcare facilities</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full bg-[#0EA5E9]" />
                    <span>Your location</span>
                  </li>
                  <p className="mt-4 text-sm text-muted-foreground">
                    Click on markers to see more details about each facility.
                  </p>
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default MapPage;
