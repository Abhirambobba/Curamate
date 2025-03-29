
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Doctor, Appointment } from '@/utils/csvUtils';
import { getAuthUser } from '@/utils/authUtils';
import { loadAppointments, saveAppointments } from '@/utils/csvUtils';
import { v4 as uuidv4 } from 'uuid';

interface AppointmentFormProps {
  doctors: Doctor[];
  onSuccess?: () => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ doctors, onSuccess }) => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [doctorId, setDoctorId] = useState<string>('');
  const [timeSlot, setTimeSlot] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', 
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
    '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !doctorId || !timeSlot) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields to book an appointment.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const user = getAuthUser();
      
      if (!user || user.role !== 'patient') {
        toast({
          title: "Authentication error",
          description: "You must be logged in as a patient to book appointments.",
          variant: "destructive"
        });
        return;
      }
      
      const appointments = loadAppointments();
      
      // Check for conflicts
      const dateString = format(date, 'yyyy-MM-dd');
      const hasConflict = appointments.some(
        app => app.doctorId === doctorId && app.date === dateString && app.time === timeSlot && app.status !== 'cancelled'
      );
      
      if (hasConflict) {
        toast({
          title: "Time slot unavailable",
          description: "This time slot is already booked. Please select another time.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      // Create new appointment
      const newAppointment: Appointment = {
        id: uuidv4(),
        patientId: user.id,
        doctorId,
        date: dateString,
        time: timeSlot,
        reason: reason,
        status: 'pending'
      };
      
      // Save to storage
      appointments.push(newAppointment);
      saveAppointments(appointments);
      
      toast({
        title: "Appointment booked!",
        description: `Your appointment is scheduled for ${dateString} at ${timeSlot}.`,
      });
      
      // Reset form
      setDate(undefined);
      setDoctorId('');
      setTimeSlot('');
      setReason('');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Failed to book appointment",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="doctor">Select a Doctor</Label>
        <Select value={doctorId} onValueChange={setDoctorId} required>
          <SelectTrigger id="doctor">
            <SelectValue placeholder="Select a doctor" />
          </SelectTrigger>
          <SelectContent>
            {doctors.map((doctor) => (
              <SelectItem key={doctor.id} value={doctor.id}>
                Dr. {doctor.name} - {doctor.specialization}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="date">Select a Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              disabled={(date) => {
                // Disable past dates and weekends
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const day = date.getDay();
                return date < today || day === 0 || day === 6;
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="time">Select a Time Slot</Label>
        <Select value={timeSlot} onValueChange={setTimeSlot} required>
          <SelectTrigger id="time">
            <SelectValue placeholder="Select a time slot" />
          </SelectTrigger>
          <SelectContent>
            {timeSlots.map((slot) => (
              <SelectItem key={slot} value={slot}>
                {slot}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="reason">Reason for Visit</Label>
        <Textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Briefly describe your symptoms or reason for the appointment"
          className="resize-none"
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Booking..." : "Book Appointment"}
      </Button>
    </form>
  );
};

export default AppointmentForm;
