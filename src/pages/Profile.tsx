
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAuthUser, setAuthUser, isAuthenticated } from '@/utils/authUtils';
import { User, Patient, Doctor } from '@/utils/csvUtils';

const Profile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    const authUser = getAuthUser();
    if (authUser) {
      setUser(authUser);
      setName(authUser.name || '');
      setEmail(authUser.email || '');
      setContactNumber(authUser.contactNumber || '');
      
      if (authUser.role === 'doctor') {
        const doctorUser = authUser as Doctor;
        setSpecialization(doctorUser.specialization || '');
      } else if (authUser.role === 'patient') {
        const patientUser = authUser as Patient;
        setDateOfBirth(patientUser.dateOfBirth || '');
        setBloodGroup(patientUser.bloodGroup || '');
      }
    }
  }, [navigate]);
  
  const handleSave = () => {
    if (!user) return;
    
    let updatedUser: User;
    
    if (user.role === 'doctor') {
      updatedUser = {
        ...user,
        name,
        email,
        contactNumber: contactNumber || undefined,
        specialization: specialization || undefined,
      } as Doctor;
    } else {
      updatedUser = {
        ...user,
        name,
        email,
        contactNumber: contactNumber || undefined,
        dateOfBirth: dateOfBirth || undefined,
        bloodGroup: bloodGroup || undefined,
      } as Patient;
    }
    
    // In a real application, we would save this to the backend
    // For now, we'll just update the local state
    setAuthUser(updatedUser);
    setUser(updatedUser);
    setIsEditing(false);
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully",
    });
  };
  
  const getDashboardLink = () => {
    if (!user) return '/';
    return user.role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard';
  };
  
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  
  const specializations = [
    "General Practitioner",
    "Pediatrician",
    "Cardiologist",
    "Dermatologist",
    "Neurologist",
    "Orthopedic Surgeon",
    "Psychiatrist",
    "Ophthalmologist",
    "ENT Specialist",
    "Gynecologist",
  ];
  
  if (!user) {
    return (
      <Layout>
        <div className="healthcare-container py-12">
          <p className="text-center text-healthcare-gray">Loading profile...</p>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="healthcare-container py-12">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{user.name}'s Profile</CardTitle>
                <CardDescription>
                  Manage your personal information and preferences
                </CardDescription>
              </div>
              {isEditing ? (
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    Save Changes
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  ) : (
                    <p className="p-2 border rounded-md">{user.name}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  ) : (
                    <p className="p-2 border rounded-md">{user.email}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Number</Label>
                  {isEditing ? (
                    <Input
                      id="contact"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                    />
                  ) : (
                    <p className="p-2 border rounded-md">{user.contactNumber || 'Not provided'}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <p className="p-2 border rounded-md capitalize">{user.role}</p>
                </div>
              </div>
              
              {user.role === 'doctor' ? (
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization</Label>
                    {isEditing ? (
                      <Select 
                        value={specialization} 
                        onValueChange={setSpecialization}
                      >
                        <SelectTrigger id="specialization">
                          <SelectValue placeholder="Select specialization" />
                        </SelectTrigger>
                        <SelectContent>
                          {specializations.map((spec) => (
                            <SelectItem key={spec} value={spec}>
                              {spec}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="p-2 border rounded-md">{(user as Doctor).specialization || 'Not specified'}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    {isEditing ? (
                      <Input
                        id="dob"
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                      />
                    ) : (
                      <p className="p-2 border rounded-md">{(user as Patient).dateOfBirth || 'Not provided'}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    {isEditing ? (
                      <Select 
                        value={bloodGroup} 
                        onValueChange={setBloodGroup}
                      >
                        <SelectTrigger id="bloodGroup">
                          <SelectValue placeholder="Select blood group" />
                        </SelectTrigger>
                        <SelectContent>
                          {bloodGroups.map((group) => (
                            <SelectItem key={group} value={group}>
                              {group}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="p-2 border rounded-md">{(user as Patient).bloodGroup || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate(getDashboardLink())}>
              Back to Dashboard
            </Button>
            
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default Profile;
