import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import Layout from '@/components/Layout';
import EHRForm from '@/components/EHRForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAuthUser, getUserById, isAuthenticated } from '@/utils/authUtils';
import { loadEHRs, Patient, EHR } from '@/utils/csvUtils';
import { ArrowLeft, Plus, Edit } from 'lucide-react';
import ChatbotWithEHR from '@/components/ChatbotWithEHR';

const EHRPage = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [ehrs, setEHRs] = useState<EHR[]>([]);
  const [selectedEHR, setSelectedEHR] = useState<string | null>(null);
  const [isNewEHROpen, setIsNewEHROpen] = useState(false);
  const [isEditEHROpen, setIsEditEHROpen] = useState(false);
  
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    const user = getAuthUser();
    if (user?.role !== 'doctor') {
      navigate('/');
      return;
    }
    
    if (patientId) {
      const foundPatient = getUserById(patientId) as Patient | null;
      
      if (foundPatient && foundPatient.role === 'patient') {
        setPatient(foundPatient);
        
        const fetchedEHRs = loadEHRs();
        const patientEHRs = fetchedEHRs.filter(ehr => ehr.patientId === patientId);
        
        patientEHRs.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB.getTime() - dateA.getTime();
        });
        
        setEHRs(patientEHRs);
      } else {
        toast({
          title: "Patient Not Found",
          description: "The requested patient could not be found.",
          variant: "destructive",
        });
        navigate('/doctor-dashboard');
      }
    }
  }, [patientId, navigate, toast]);
  
  const handleEHRCreated = () => {
    const fetchedEHRs = loadEHRs();
    const patientEHRs = fetchedEHRs.filter(ehr => ehr.patientId === patientId);
    
    patientEHRs.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
    
    setEHRs(patientEHRs);
    setIsNewEHROpen(false);
    setIsEditEHROpen(false);
  };
  
  if (!patient) {
    return (
      <Layout>
        <div className="healthcare-container py-8">
          <div className="text-center py-12">
            <p className="text-healthcare-gray">Loading patient information...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="healthcare-container py-8">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => navigate('/doctor-dashboard')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-healthcare-dark-blue">Patient Records</h1>
            <p className="text-healthcare-gray">{patient.name}'s Electronic Health Records</p>
          </div>
          
          <Dialog open={isNewEHROpen} onOpenChange={setIsNewEHROpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 md:mt-0">
                <Plus className="mr-2 h-4 w-4" /> New EHR Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New EHR for {patient.name}</DialogTitle>
              </DialogHeader>
              <EHRForm patient={patient} onSave={handleEHRCreated} />
            </DialogContent>
          </Dialog>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-healthcare-gray">Name</p>
                <p>{patient.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-healthcare-gray">Email</p>
                <p>{patient.email}</p>
              </div>
              {patient.contactNumber && (
                <div>
                  <p className="text-sm font-medium text-healthcare-gray">Contact</p>
                  <p>{patient.contactNumber}</p>
                </div>
              )}
              {patient.dateOfBirth && (
                <div>
                  <p className="text-sm font-medium text-healthcare-gray">Date of Birth</p>
                  <p>{patient.dateOfBirth}</p>
                </div>
              )}
              {patient.bloodGroup && (
                <div>
                  <p className="text-sm font-medium text-healthcare-gray">Blood Group</p>
                  <p>{patient.bloodGroup}</p>
                </div>
              )}
              {patient.allergies && patient.allergies.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-healthcare-gray">Allergies</p>
                  <p>{patient.allergies.join(', ')}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="ehr" className="space-y-6">
          <TabsList>
            <TabsTrigger value="ehr">Health Records</TabsTrigger>
            <TabsTrigger value="chat">AI Assistant</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ehr">
            {ehrs.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-healthcare-gray mb-4">No health records found for this patient.</p>
                  <Button onClick={() => setIsNewEHROpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Create First Health Record
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <Tabs defaultValue={ehrs[0].id}>
                  <TabsList className="w-full flex overflow-x-auto">
                    {ehrs.map((ehr, index) => (
                      <TabsTrigger key={ehr.id} value={ehr.id} className="flex-shrink-0">
                        {ehr.date} {index === 0 && "(Latest)"}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {ehrs.map((ehr) => (
                    <TabsContent key={ehr.id} value={ehr.id}>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                          <div>
                            <CardTitle>Medical Record - {ehr.date}</CardTitle>
                            <CardDescription>Created by Dr. {getAuthUser()?.name}</CardDescription>
                          </div>
                          <Dialog open={isEditEHROpen && selectedEHR === ehr.id} onOpenChange={(open) => {
                            setIsEditEHROpen(open);
                            if (open) {
                              setSelectedEHR(ehr.id);
                            } else {
                              setSelectedEHR(null);
                            }
                          }}>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg">
                              <DialogHeader>
                                <DialogTitle>Edit EHR for {patient.name}</DialogTitle>
                              </DialogHeader>
                              <EHRForm 
                                patient={patient} 
                                ehrId={ehr.id} 
                                onSave={handleEHRCreated} 
                              />
                            </DialogContent>
                          </Dialog>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h3 className="font-medium text-healthcare-blue">Diagnosis</h3>
                            <p className="mt-1">{ehr.diagnosis}</p>
                          </div>
                          
                          {ehr.prescription && (
                            <div>
                              <h3 className="font-medium text-healthcare-blue">Prescription</h3>
                              <p className="mt-1 whitespace-pre-line">{ehr.prescription}</p>
                            </div>
                          )}
                          
                          {ehr.notes && (
                            <div>
                              <h3 className="font-medium text-healthcare-blue">Clinical Notes</h3>
                              <p className="mt-1 whitespace-pre-line">{ehr.notes}</p>
                            </div>
                          )}
                          
                          {ehr.followUp && (
                            <div>
                              <h3 className="font-medium text-healthcare-blue">Follow-up</h3>
                              <p className="mt-1">{ehr.followUp}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="chat">
            <Card>
              <CardContent className="py-6">
                <ChatbotWithEHR patient={patient} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default EHRPage;
