
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Patient } from '@/utils/csvUtils';
import { FileText, Calendar, MessageSquare, User } from 'lucide-react';

interface PatientCardProps {
  patient: Patient;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="mr-2 h-5 w-5 text-healthcare-blue" />
          {patient.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-sm">
          <span className="font-medium text-healthcare-gray">Email:</span> {patient.email}
        </div>
        {patient.contactNumber && (
          <div className="text-sm">
            <span className="font-medium text-healthcare-gray">Contact:</span> {patient.contactNumber}
          </div>
        )}
        {patient.dateOfBirth && (
          <div className="text-sm">
            <span className="font-medium text-healthcare-gray">DOB:</span> {patient.dateOfBirth}
          </div>
        )}
        {patient.bloodGroup && (
          <div className="text-sm">
            <span className="font-medium text-healthcare-gray">Blood Group:</span> {patient.bloodGroup}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between space-x-2">
        <Button 
          size="sm" 
          variant="outline"
          className="flex-1"
          asChild
        >
          <Link to={`/ehr/${patient.id}`}>
            <FileText className="mr-1 h-4 w-4" />
            EHR
          </Link>
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          className="flex-1"
          asChild
        >
          <Link to={`/schedule/${patient.id}`}>
            <Calendar className="mr-1 h-4 w-4" />
            Schedule
          </Link>
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          className="flex-1"
          asChild
        >
          <Link to={`/message/${patient.id}`}>
            <MessageSquare className="mr-1 h-4 w-4" />
            Message
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PatientCard;
