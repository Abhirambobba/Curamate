
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { isAuthenticated, getAuthUser } from '@/utils/authUtils';
import { Doctor, getDoctors, saveAppointments, loadAppointments, Appointment } from '@/utils/csvUtils';
import { v4 as uuidv4 } from 'uuid';
import { CalendarClock, Clock } from 'lucide-react';

const Appointments = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlot, setTimeSlot] = useState<string | undefined>(undefined);
  const [doctor, setDoctor] = useState<string | undefined>(undefined);
  const [reason, setReason] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);

  useEffect(() => {
    // Check authentication immediately when component mounts
    if (!isAuthenticated()) {
      toast({
        title: "Authentication Required",
        description: "Please login to book an appointment",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    const user = getAuthUser();
    if (user?.role === 'doctor') {
      navigate('/doctor-dashboard');
      return;
    }

    // Load doctors
    const doctorsList = getDoctors();
    setDoctors(doctorsList);
  }, [navigate, toast]);

  useEffect(() => {
    if (date && doctor) {
      generateTimeSlots();
    }
  }, [date, doctor]);

  const generateTimeSlots = () => {
    // This would normally check against already booked appointments
    // For demo purposes, we'll generate some random time slots
    const slots = [
      '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
      '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
      '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
    ];
    
    // Simulate some slots being unavailable
    const appointments = loadAppointments();
    const selectedDate = date ? format(date, 'yyyy-MM-dd') : '';
    
    const bookedSlots = appointments
      .filter(app => app.doctorId === doctor && app.date === selectedDate)
      .map(app => app.time);
    
    const available = slots.filter(slot => !bookedSlots.includes(slot));
    setAvailableTimeSlots(available);
    
    // Clear selected time if not available
    if (timeSlot && !available.includes(timeSlot)) {
      setTimeSlot(undefined);
    }
  };

  const handleBookAppointment = () => {
    if (!date || !timeSlot || !doctor || !reason.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all the fields",
        variant: "destructive"
      });
      return;
    }

    const user = getAuthUser();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to book an appointment",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    const newAppointment: Appointment = {
      id: uuidv4(),
      patientId: user.id,
      doctorId: doctor,
      date: format(date, 'yyyy-MM-dd'),
      time: timeSlot,
      status: 'pending',
      reason: reason
    };

    const appointments = loadAppointments();
    appointments.push(newAppointment);
    saveAppointments(appointments);

    toast({
      title: "Appointment Booked",
      description: `Your appointment has been scheduled for ${format(date, 'MMMM d, yyyy')} at ${timeSlot}`
    });

    navigate('/patient-dashboard');
  };

  const selectedDoctor = doctors.find(d => d.id === doctor);

  return (
    <Layout>
      <div className="healthcare-container py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block p-3 bg-healthcare-light-purple rounded-full mb-4">
              <CalendarClock className="h-8 w-8 text-healthcare-purple" />
            </div>
            <h1 className="text-4xl font-bold text-healthcare-dark-blue mb-4">Book an Appointment</h1>
            <p className="text-lg text-healthcare-gray max-w-2xl mx-auto">
              Schedule a consultation with one of our healthcare professionals at your convenience.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Select a Date & Time</CardTitle>
                <CardDescription>
                  Choose your preferred appointment date and time
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Doctor</label>
                  <Select value={doctor} onValueChange={setDoctor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((doc) => (
                        <SelectItem key={doc.id} value={doc.id}>
                          Dr. {doc.name} {doc.specialization ? `(${doc.specialization})` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium">Select Date</label>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="border rounded-md p-3"
                    disabled={(date) => {
                      const day = date.getDay();
                      // Disable weekends and past dates
                      return day === 0 || day === 6 || date < new Date(new Date().setHours(0, 0, 0, 0));
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Time Slot</label>
                  {date && doctor ? (
                    availableTimeSlots.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {availableTimeSlots.map((slot) => (
                          <Button
                            key={slot}
                            variant={timeSlot === slot ? "default" : "outline"}
                            className="flex items-center justify-center"
                            onClick={() => setTimeSlot(slot)}
                          >
                            <Clock className="h-3 w-3 mr-1" />
                            {slot}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-healthcare-gray italic">No time slots available for this date</p>
                    )
                  ) : (
                    <p className="text-sm text-healthcare-gray italic">Please select a doctor and date first</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Reason for Visit</label>
                  <Textarea
                    placeholder="Please briefly describe the reason for your appointment"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleBookAppointment} 
                  className="w-full"
                  disabled={!date || !timeSlot || !doctor || !reason.trim()}
                >
                  Book Appointment
                </Button>
              </CardFooter>
            </Card>

            <div className="space-y-6">
              {selectedDoctor && (
                <Card>
                  <CardHeader>
                    <CardTitle>Selected Doctor</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 bg-healthcare-light-purple rounded-full flex items-center justify-center mb-4">
                        <span className="text-healthcare-purple text-2xl font-bold">
                          {selectedDoctor.name.charAt(0)}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold">Dr. {selectedDoctor.name}</h3>
                      <p className="text-healthcare-blue">{selectedDoctor.specialization || 'General Practitioner'}</p>
                    </div>

                    <div className="space-y-2 mt-4">
                      <div className="flex justify-between">
                        <span className="text-healthcare-gray">Email:</span>
                        <span>{selectedDoctor.email}</span>
                      </div>
                      {selectedDoctor.contactNumber && (
                        <div className="flex justify-between">
                          <span className="text-healthcare-gray">Contact:</span>
                          <span>{selectedDoctor.contactNumber}</span>
                        </div>
                      )}
                      {selectedDoctor.experience && (
                        <div className="flex justify-between">
                          <span className="text-healthcare-gray">Experience:</span>
                          <span>{selectedDoctor.experience} years</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Appointment Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-healthcare-gray">Doctor:</span>
                      <span>{selectedDoctor ? `Dr. ${selectedDoctor.name}` : 'Not selected'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-healthcare-gray">Date:</span>
                      <span>{date ? format(date, 'MMMM d, yyyy') : 'Not selected'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-healthcare-gray">Time:</span>
                      <span>{timeSlot || 'Not selected'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-healthcare-gray">Status:</span>
                      <span className="text-yellow-600 font-medium">Pending booking</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-healthcare-gray mb-4">
                    If you need assistance with booking your appointment or have any questions, please don't hesitate to contact us.
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/contact')}
                  >
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Appointments;
