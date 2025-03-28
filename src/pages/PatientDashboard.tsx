
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppointmentForm from '@/components/AppointmentForm';
import ChatbotInterface from '@/components/ChatbotInterface';
import { getAuthUser, getDoctors, isAuthenticated } from '@/utils/authUtils';
import { Doctor, loadAppointments, Appointment, loadEHRs, EHR } from '@/utils/csvUtils';
import { Calendar, FileText, ArrowRight, User } from 'lucide-react';

const PatientDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [ehrs, setEHRs] = useState<EHR[]>([]);
  const [activeTab, setActiveTab] = useState('appointments');
  
  useEffect(() => {
    // Check if user is authenticated as a patient
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    const user = getAuthUser();
    if (user?.role !== 'patient') {
      navigate('/');
      return;
    }
    
    // Load data
    loadData();
  }, [navigate]);
  
  const loadData = () => {
    const fetchedDoctors = getDoctors();
    const fetchedAppointments = loadAppointments();
    const fetchedEHRs = loadEHRs();
    
    const user = getAuthUser();
    
    if (user) {
      // Filter appointments for this patient
      const patientAppointments = fetchedAppointments.filter(
        appointment => appointment.patientId === user.id
      );
      
      // Filter EHRs for this patient
      const patientEHRs = fetchedEHRs.filter(
        ehr => ehr.patientId === user.id
      );
      
      setDoctors(fetchedDoctors);
      setAppointments(patientAppointments);
      setEHRs(patientEHRs);
    }
  };
  
  // Filter and sort appointments
  const upcomingAppointments = appointments
    .filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return appointmentDate >= today && appointment.status !== 'cancelled';
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });
  
  const pastAppointments = appointments
    .filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return appointmentDate < today || appointment.status === 'completed';
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateB.getTime() - dateA.getTime(); // Sort in descending order
    });
  
  // Sort EHRs by date (newest first)
  const sortedEHRs = [...ehrs].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });
  
  return (
    <Layout>
      <div className="healthcare-container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-healthcare-dark-blue">Patient Dashboard</h1>
            <p className="text-healthcare-gray">Manage your healthcare information and appointments</p>
          </div>
          <Button 
            className="mt-4 md:mt-0"
            onClick={() => setActiveTab('book')}
          >
            <Calendar className="mr-2 h-4 w-4" /> Book Appointment
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full md:w-auto grid grid-cols-4 mb-8">
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="records">Medical Records</TabsTrigger>
            <TabsTrigger value="doctors">Doctors</TabsTrigger>
            <TabsTrigger value="book">Book Appointment</TabsTrigger>
          </TabsList>
          
          <TabsContent value="appointments" className="space-y-6">
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
                    <Button 
                      variant="link" 
                      onClick={() => setActiveTab('book')}
                      className="mt-2"
                    >
                      Book an appointment
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => {
                      const doctor = doctors.find(d => d.id === appointment.doctorId);
                      
                      return (
                        <Card key={appointment.id} className="hover:bg-muted/50 transition-colors">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">Dr. {doctor?.name || "Unknown Doctor"}</h3>
                                <p className="text-sm text-muted-foreground">{doctor?.specialization}</p>
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
            
            {pastAppointments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Past Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pastAppointments.slice(0, 5).map((appointment) => {
                      const doctor = doctors.find(d => d.id === appointment.doctorId);
                      
                      return (
                        <Card key={appointment.id} className="hover:bg-muted/50 transition-colors">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">Dr. {doctor?.name || "Unknown Doctor"}</h3>
                                <p className="text-sm text-muted-foreground">{doctor?.specialization}</p>
                                <p className="text-sm text-healthcare-gray">{appointment.date} at {appointment.time}</p>
                              </div>
                              <div className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {appointment.status === 'completed' ? 'Completed' : 'Past'}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="records">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-healthcare-blue" />
                  Medical Records
                </CardTitle>
              </CardHeader>
              <CardContent>
                {sortedEHRs.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-healthcare-gray">No medical records found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sortedEHRs.map((ehr) => {
                      const doctor = doctors.find(d => d.id === ehr.doctorId);
                      
                      return (
                        <Card key={ehr.id} className="hover:bg-muted/50 transition-colors">
                          <CardContent className="p-4">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <h3 className="font-medium">Date: {ehr.date}</h3>
                                <p className="text-sm text-healthcare-gray">Dr. {doctor?.name || "Unknown"}</p>
                              </div>
                              <div>
                                <p className="font-medium">Diagnosis:</p>
                                <p className="text-sm">{ehr.diagnosis}</p>
                              </div>
                              {ehr.prescription && (
                                <div>
                                  <p className="font-medium">Prescription:</p>
                                  <p className="text-sm">{ehr.prescription}</p>
                                </div>
                              )}
                              {ehr.notes && (
                                <div>
                                  <p className="font-medium">Notes:</p>
                                  <p className="text-sm">{ehr.notes}</p>
                                </div>
                              )}
                              {ehr.followUp && (
                                <div>
                                  <p className="font-medium">Follow-up:</p>
                                  <p className="text-sm">{ehr.followUp}</p>
                                </div>
                              )}
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
          
          <TabsContent value="doctors">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doctor) => (
                <Card key={doctor.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="mr-2 h-5 w-5 text-healthcare-blue" />
                      Dr. {doctor.name}
                    </CardTitle>
                    <CardDescription>{doctor.specialization}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium text-healthcare-gray">Email:</span> {doctor.email}
                    </div>
                    {doctor.contactNumber && (
                      <div className="text-sm">
                        <span className="font-medium text-healthcare-gray">Contact:</span> {doctor.contactNumber}
                      </div>
                    )}
                    {doctor.experience && (
                      <div className="text-sm">
                        <span className="font-medium text-healthcare-gray">Experience:</span> {doctor.experience} years
                      </div>
                    )}
                    
                    <Button 
                      variant="outline" 
                      className="w-full mt-4"
                      onClick={() => {
                        setActiveTab('book');
                      }}
                    >
                      Book Appointment <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
              
              {doctors.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-healthcare-gray">No doctors available at the moment</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="book">
            <Card>
              <CardHeader>
                <CardTitle>Book an Appointment</CardTitle>
                <CardDescription>
                  Select a doctor, date, and time to schedule your appointment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AppointmentForm 
                  doctors={doctors} 
                  onSuccess={() => {
                    loadData();
                    setActiveTab('appointments');
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default PatientDashboard;
