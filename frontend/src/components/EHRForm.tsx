
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { EHR, Patient, loadEHRs, saveEHRs } from '@/utils/csvUtils';
import { getAuthUser } from '@/utils/authUtils';
import { v4 as uuidv4 } from 'uuid';

interface EHRFormProps {
  patient: Patient;
  ehrId?: string;
  onSave?: () => void;
}

const EHRForm: React.FC<EHRFormProps> = ({ patient, ehrId, onSave }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState('');
  const [prescription, setPrescription] = useState('');
  const [notes, setNotes] = useState('');
  const [followUp, setFollowUp] = useState('');
  
  useEffect(() => {
    if (ehrId) {
      const ehrs = loadEHRs();
      const existingEHR = ehrs.find(ehr => ehr.id === ehrId);
      
      if (existingEHR) {
        setDiagnosis(existingEHR.diagnosis);
        setPrescription(existingEHR.prescription || '');
        setNotes(existingEHR.notes || '');
        setFollowUp(existingEHR.followUp || '');
      }
    }
  }, [ehrId]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const doctor = getAuthUser();
      
      if (!doctor || doctor.role !== 'doctor') {
        toast({
          title: "Authentication error",
          description: "You must be logged in as a doctor to update EHRs.",
          variant: "destructive"
        });
        return;
      }
      
      const ehrs = loadEHRs();
      const currentDate = new Date().toISOString().split('T')[0];
      
      if (ehrId) {
        // Update existing EHR
        const index = ehrs.findIndex(ehr => ehr.id === ehrId);
        
        if (index !== -1) {
          ehrs[index] = {
            ...ehrs[index],
            diagnosis,
            prescription,
            notes,
            followUp,
          };
        }
      } else {
        // Create new EHR
        const newEHR: EHR = {
          id: uuidv4(),
          patientId: patient.id,
          doctorId: doctor.id,
          date: currentDate,
          diagnosis,
          prescription,
          notes,
          followUp,
        };
        
        ehrs.push(newEHR);
      }
      
      saveEHRs(ehrs);
      
      toast({
        title: ehrId ? "EHR Updated" : "EHR Created",
        description: `Electronic health record for ${patient.name} has been ${ehrId ? 'updated' : 'created'} successfully.`,
      });
      
      if (onSave) {
        onSave();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="diagnosis">Diagnosis</Label>
        <Textarea
          id="diagnosis"
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
          placeholder="Enter patient diagnosis"
          className="resize-none"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="prescription">Prescription</Label>
        <Textarea
          id="prescription"
          value={prescription}
          onChange={(e) => setPrescription(e.target.value)}
          placeholder="Enter prescriptions if any"
          className="resize-none h-24"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Clinical Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Enter additional notes"
          className="resize-none h-24"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="followUp">Follow-up Recommendations</Label>
        <Input
          id="followUp"
          value={followUp}
          onChange={(e) => setFollowUp(e.target.value)}
          placeholder="e.g., 2 weeks, 1 month, etc."
        />
      </div>
      
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Saving..." : (ehrId ? "Update EHR" : "Create EHR")}
      </Button>
    </form>
  );
};

export default EHRForm;
