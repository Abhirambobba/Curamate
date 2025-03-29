
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Doctor, getDoctors } from '@/utils/csvUtils';
import { Search, UserPlus } from 'lucide-react';

const Doctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = () => {
      const doctorsList = getDoctors();
      setDoctors(doctorsList);
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter(doctor => 
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doctor.specialization && doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Layout>
      <div className="healthcare-container py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-healthcare-dark-blue mb-2">Our Medical Team</h1>
              <p className="text-healthcare-gray">Meet our highly qualified healthcare professionals</p>
            </div>
            <div className="mt-4 md:mt-0 w-full md:w-auto flex gap-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-3 text-healthcare-gray h-4 w-4" />
                <Input
                  placeholder="Search by name or specialty"
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {filteredDoctors.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-healthcare-gray text-lg">No doctors found matching your search criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doctor) => (
                <Card key={doctor.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="w-24 h-24 mx-auto bg-healthcare-light-purple rounded-full flex items-center justify-center mb-4">
                      <UserPlus className="h-12 w-12 text-healthcare-purple" />
                    </div>
                    <h3 className="text-xl font-semibold text-healthcare-dark-blue text-center mb-2">
                      Dr. {doctor.name}
                    </h3>
                    <p className="text-healthcare-blue font-medium text-center mb-3">
                      {doctor.specialization || 'General Practitioner'}
                    </p>
                    <div className="mt-4">
                      <div className="flex justify-between mb-2">
                        <Label className="text-healthcare-gray">Email:</Label>
                        <span className="text-healthcare-dark-blue">{doctor.email}</span>
                      </div>
                      {doctor.contactNumber && (
                        <div className="flex justify-between mb-2">
                          <Label className="text-healthcare-gray">Contact:</Label>
                          <span className="text-healthcare-dark-blue">{doctor.contactNumber}</span>
                        </div>
                      )}
                      {doctor.experience && (
                        <div className="flex justify-between mb-2">
                          <Label className="text-healthcare-gray">Experience:</Label>
                          <span className="text-healthcare-dark-blue">{doctor.experience} years</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="bg-healthcare-light-gray p-4 flex justify-center">
                    <Button 
                      variant="outline"
                      onClick={() => navigate('/schedule')}
                      className="w-full"
                    >
                      Book Appointment
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Doctors;
