
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import Map from '@/components/Map';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { isAuthenticated, getAuthUser } from '@/utils/authUtils';
import { useToast } from '@/components/ui/use-toast';
import { MapPin } from 'lucide-react';

const MapPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = getAuthUser();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      toast({
        title: "Access Denied",
        description: "Please log in to view the map.",
        variant: "destructive",
      });
      navigate('/login');
    }
  }, [navigate, toast]);

  return (
    <Layout>
      <div className="healthcare-container py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-healthcare-dark-blue flex items-center">
              <MapPin className="mr-2 h-6 w-6 text-healthcare-blue" />
              Healthcare Map
            </h1>
            <p className="text-healthcare-gray">
              {user?.role === 'doctor' 
                ? 'View nearby patients and facilities' 
                : 'Find nearby doctors and medical facilities'}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-3">
            <CardContent className="p-0">
              <Map />
            </CardContent>
          </Card>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-healthcare-dark-blue">
                  {user?.role === 'doctor' ? 'For Doctors' : 'For Patients'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user?.role === 'doctor' ? (
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="bg-healthcare-light-purple text-healthcare-purple h-5 w-5 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">1</span>
                      <span>View your current location on the map</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-healthcare-light-purple text-healthcare-purple h-5 w-5 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">2</span>
                      <span>Find nearby medical facilities</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-healthcare-light-purple text-healthcare-purple h-5 w-5 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">3</span>
                      <span>Plan your route to patient locations</span>
                    </li>
                  </ul>
                ) : (
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="bg-healthcare-light-purple text-healthcare-purple h-5 w-5 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">1</span>
                      <span>View your current location on the map</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-healthcare-light-purple text-healthcare-purple h-5 w-5 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">2</span>
                      <span>Find nearby hospitals and clinics</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-healthcare-light-purple text-healthcare-purple h-5 w-5 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">3</span>
                      <span>Get directions to your doctor's office</span>
                    </li>
                  </ul>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-healthcare-dark-blue">Location Legend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <div className="h-4 w-4 rounded-full bg-[#4285F4] mr-2"></div>
                    <span>Your Current Location</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-4 w-4 rounded-full bg-red-500 mr-2"></div>
                    <span>Hospitals & Clinics</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MapPage;
