
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PatientCard from '@/components/PatientCard';
import EHRForm from '@/components/EHRForm';
import ChatbotInterface from '@/components/ChatbotInterface';
import { getAuthUser, getUserByEmail, isAuthenticated } from '@/utils/authUtils';
import { Patient, Appointment, EHR, getPatients, loadEHRs, loadAppointments } from '@/utils/csvUtils';
import { Search, Plus, Calendar } from 'lucide-react';

const DoctorDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [ehrs, setEHRs] = useState<EHR[]>([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResult, setSearchResult] = useState<Patient | null>(null);
  const [addPatientOpen, setAddPatientOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('patients');
  
  useEffect(() => {
    // Check if user is authenticated as a doctor
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    const user = getAuthUser();
    if (user?.role !== 'doctor') {
      navigate('/');
      return;
    }
    
    // Load data
    loadData();
  }, [navigate]);
  
  const loadData = () => {
    const fetchedPatients = getPatients();
    const fetchedAppointments = loadAppointments();
    const fetchedEHRs = loadEHRs();
    
    const user = getAuthUser();
    
    if (user) {
      // Filter appointments for this doctor
      const doctorAppointments = fetchedAppointments.filter(
        appointment => appointment.doctorId === user.id
      );
      
      setAppointments(doctorAppointments);
      setPatients(fetchedPatients);
      setEHRs(fetchedEHRs);
    }
  };
  
  const handleSearchPatient = () => {
    if (!searchEmail.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter a patient email to search.",
        variant: "destructive",
      });
      return;
    }
    
    const patient = getUserByEmail(searchEmail) as Patient | null;
    
    if (patient && patient.role === 'patient') {
      setSearchResult(patient);
    } else {
      setSearchResult(null);
      toast({
        title: "Patient Not Found",
        description: "No patient found with the provided email address.",
        variant: "destructive",
      });
    }
  };
  
  const handleAddPatient = () => {
    if (!searchResult) return;
    
    // In a real app, we would create an association between doctor and patient
    toast({
      title: "Patient Added",
      description: `${searchResult.name} has been added to your patient list.`,
    });
    
    setAddPatientOpen(false);
    loadData();
  };
  
  // Filter upcoming appointments (today and future)
  const upcomingAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return appointmentDate >= today && appointment.status !== 'cancelled';
  });
  
  // Sort appointments by date and time
  upcomingAppointments.sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });
  
  return (
    <Layout>
      <div className="healthcare-container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-healthcare-dark-blue">Doctor Dashboard</h1>
            <p className="text-healthcare-gray">Manage your patients and appointments</p>
          </div>
          
          <Dialog open={addPatientOpen} onOpenChange={setAddPatientOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 md:mt-0">
                <Plus className="mr-2 h-4 w-4" /> Add Patient
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Patient by Email</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Enter patient email"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                  />
                  <Button onClick={handleSearchPatient} size="sm">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                
                {searchResult && (
                  <Card>
                    <CardHeader>
                      <CardTitle>{searchResult.name}</CardTitle>
                      <CardDescription>{searchResult.email}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {searchResult.dateOfBirth && (
                          <p className="text-sm">
                            <span className="font-medium">Date of Birth:</span> {searchResult.dateOfBirth}
                          </p>
                        )}
                        {searchResult.bloodGroup && (
                          <p className="text-sm">
                            <span className="font-medium">Blood Group:</span> {searchResult.bloodGroup}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {searchResult && (
                  <Button onClick={handleAddPatient} className="w-full">
                    Add to My Patients
                  </Button>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full md:w-auto grid grid-cols-3 mb-8">
            <TabsTrigger value="patients">My Patients</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="ai-assist">AI Assistant</TabsTrigger>
          </TabsList>
          
          <TabsContent value="patients" className="space-y-6">
            {patients.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-healthcare-gray mb-4">You don't have any patients yet.</p>
                  <Button onClick={() => setAddPatientOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Your First Patient
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {patients.map((patient) => (
                  <PatientCard key={patient.id} patient={patient} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-healthcare-blue" />
                  Upcoming Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingAppointments.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-healthcare-gray">No upcoming appointments</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => {
                      const patient = patients.find(p => p.id === appointment.patientId);
                      
                      return (
                        <Card key={appointment.id} className="hover:bg-muted/50 transition-colors">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{patient?.name || "Unknown Patient"}</h3>
                                <p className="text-sm text-healthcare-gray">{appointment.date} at {appointment.time}</p>
                                {appointment.reason && (
                                  <p className="text-sm mt-2">{appointment.reason}</p>
                                )}
                              </div>
                              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                appointment.status === 'confirmed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {appointment.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ai-assist">
            <ChatbotInterface />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default DoctorDashboard;
