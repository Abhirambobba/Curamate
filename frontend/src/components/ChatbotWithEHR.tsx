import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit } from 'lucide-react';
import EHRForm from './EHRForm';
import { Patient, EHR, loadEHRs } from '@/utils/csvUtils';

interface ChatbotWithEHRProps {
  patient: Patient;
}

const ChatbotWithEHR: React.FC<ChatbotWithEHRProps> = ({ patient }) => {
  const [ehrData, setEhrData] = useState<EHR[]>([]);
  const [selectedEHR, setSelectedEHR] = useState<string | null>(null);
  const [isNewEHROpen, setIsNewEHROpen] = useState(false);
  const [isEditEHROpen, setIsEditEHROpen] = useState(false);

  useEffect(() => {
    const fetchedEHRs = loadEHRs();
    const patientEHRs = fetchedEHRs.filter((ehr) => ehr.patientId === patient.id);

    patientEHRs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setEhrData(patientEHRs);
  }, [patient.id]);

  const handleEHRCreated = () => {
    const fetchedEHRs = loadEHRs();
    const patientEHRs = fetchedEHRs.filter((ehr) => ehr.patientId === patient.id);

    patientEHRs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setEhrData(patientEHRs);
    setIsNewEHROpen(false);
    setIsEditEHROpen(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      <Card className="w-full h-[70vh] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center">
            CuraMate AI Assistant - {patient.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden">
          <ScrollArea className="h-full">
            <iframe
              src="http://localhost:8501"  // Streamlit server URL
              title="CuraMate AI Assistant"
              className="w-full h-[35vh] rounded-lg border"  // ⬇️ Reduced height
            />
          </ScrollArea>
        </CardContent>
        <CardFooter className="border-t p-4">
          <Button onClick={() => window.open("http://localhost:8501", "_blank")}>
            Open in New Tab
          </Button>
        </CardFooter>
      </Card>

      {/* ✅ EHR Records */}
      <Card className="w-full h-[70vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Electronic Health Records</CardTitle>
          <Dialog open={isNewEHROpen} onOpenChange={setIsNewEHROpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" /> New EHR
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New EHR for {patient.name}</DialogTitle>
              </DialogHeader>
              <EHRForm patient={patient} onSave={handleEHRCreated} />
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent className="flex-grow overflow-hidden">
          {ehrData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <p className="text-gray-500 mb-4">No health records found for this patient.</p>
              <Button onClick={() => setIsNewEHROpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Create First Health Record
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-[300px]">  {/* ⬇️ Reduced height */}
              <Tabs defaultValue={ehrData[0].id}>
                <TabsList className="w-full flex mb-4 overflow-x-auto">
                  {ehrData.map((ehr, index) => (
                    <TabsTrigger key={ehr.id} value={ehr.id} className="flex-shrink-0">
                      {ehr.date} {index === 0 && "(Latest)"}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {ehrData.map((ehr) => (
                  <TabsContent key={ehr.id} value={ehr.id} className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Medical Record - {ehr.date}</h3>
                      <Dialog
                        open={isEditEHROpen && selectedEHR === ehr.id}
                        onOpenChange={(open) => {
                          setIsEditEHROpen(open);
                          setSelectedEHR(open ? ehr.id : null);
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <DialogHeader>
                            <DialogTitle>Edit EHR for {patient.name}</DialogTitle>
                          </DialogHeader>
                          <EHRForm patient={patient} ehrId={ehr.id} onSave={handleEHRCreated} />
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Diagnosis</h4>
                      <p className="mt-1">{ehr.diagnosis}</p>
                    </div>

                    {ehr.prescription && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Prescription</h4>
                        <p className="mt-1 whitespace-pre-line">{ehr.prescription}</p>
                      </div>
                    )}

                    {ehr.notes && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Clinical Notes</h4>
                        <p className="mt-1 whitespace-pre-line">{ehr.notes}</p>
                      </div>
                    )}

                    {ehr.followUp && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Follow-up</h4>
                        <p className="mt-1">{ehr.followUp}</p>
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatbotWithEHR;
