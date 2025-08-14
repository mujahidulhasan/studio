
"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { X, Calendar as CalendarIcon, Facebook, Instagram, Github, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { useAuth } from "@/context/auth-context";
import { createRecord } from "@/services/record-service";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";


type Contact = {
  id: number;
  relation: string;
  number: string;
};

type AvatarFile = {
    buffer: ArrayBuffer;
    type: string;
    name: string;
}

const steps = [
  { id: 1, name: "Personal Information" },
  { id: 2, name: "Family Information" },
  { id: 3, name: "Additional Information" },
  { id: 4, name: "Final" },
];

export default function RecordEditor() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [studentId, setStudentId] = useState("");
  const [avatarFile, setAvatarFile] = useState<AvatarFile | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const nextContactId = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);
  const [birthDate, setBirthDate] = React.useState<Date>()
  const [isLoading, setIsLoading] = useState(false);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
      
      const buffer = await file.arrayBuffer();
      setAvatarFile({ buffer, type: file.type, name: file.name });
    }
  };

  const addContact = () => {
    setContacts([
      ...contacts,
      { id: nextContactId.current++, relation: "", number: "" },
    ]);
  };

  const removeContact = (id: number) => {
    setContacts(contacts.filter((c) => c.id !== id));
  };
  
  const handleContactChange = (id: number, field: 'relation' | 'number', value: string) => {
      setContacts(contacts.map(c => c.id === id ? {...c, [field]: value} : c));
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
        toast({
            variant: "destructive",
            title: "Not Authenticated",
            description: "You must be logged in to create a record.",
        });
        return;
    }
    
    const form = e.currentTarget;
    if (form.checkValidity()) {
        setIsLoading(true);
        const formData = new FormData(form);
        // Exclude the file input from the main data object
        formData.delete('avatar');
        const recordData = Object.fromEntries(formData.entries());

        const otherContacts = contacts.map(c => ({ relation: c.relation, number: c.number }));

        try {
            const newId = await createRecord(user.uid, {
                ...recordData,
                birthDate: birthDate ? birthDate.toISOString() : '',
                otherContacts,
            }, avatarFile);

            setStudentId(newId);
            setStep(4); // Move to the final step
        } catch (error) {
            console.error("Failed to create record:", error);
            toast({
                variant: "destructive",
                title: "Submission Failed",
                description: "There was an error creating the student record.",
            });
        } finally {
            setIsLoading(false);
        }
    } else {
      form.reportValidity();
    }
  };
  
  const handleReset = () => {
      formRef.current?.reset();
      setAvatarPreview(null);
      setAvatarFile(null);
      setContacts([]);
      setStudentId("");
      setBirthDate(undefined);
      setStep(1);
  }

  const handleNext = () => {
      if (step < 3) { // Only allow next up to step 3
          setStep(s => s + 1);
      } else if (step === 3) {
          // Trigger form submission when on the last data entry step
          formRef.current?.requestSubmit();
      }
  };

  const handleBack = () => {
      if (step > 1) {
          setStep(s => s - 1);
      }
  };
  
  if (!user) {
      return (
          <Alert variant="destructive">
              <AlertTitle>Authentication Required</AlertTitle>
              <AlertDescription>
                  Please log in to add a new student record.
              </AlertDescription>
          </Alert>
      );
  }

  return (
      <form onSubmit={handleSubmit} onReset={handleReset} ref={formRef} className="flex flex-col h-full">
         <div className="flex-1 space-y-6">
          {step < 4 ? ( // Show form for steps 1-3
            <>
              {/* Progress Bar */}
              <div className="flex items-center justify-between px-2">
                {steps.map((s, index) => (
                  <React.Fragment key={s.id}>
                    <div className="flex flex-col items-center text-center">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                        step >= s.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      )}>
                        {step > s.id ? '✔' : s.id}
                      </div>
                      <p className={cn(
                          "text-xs mt-1 w-20",
                          step >= s.id ? "font-semibold text-primary" : "text-muted-foreground"
                      )}>{s.name}</p>
                    </div>
                    {index < steps.length - 1 && <div className={cn("flex-1 h-0.5 mx-2", step > index + 1 ? "bg-primary" : "bg-muted")} />}
                  </React.Fragment>
                ))}
              </div>
              
              <div className="pt-4">
                {step === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-base font-bold">Personal Information</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label htmlFor="studentName">Student Name *</Label>
                        <Input id="studentName" name="studentName" required />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="roll">Roll Number *</Label>
                        <Input id="roll" name="roll" required />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="registration">Registration Number *</Label>
                        <Input id="registration" name="registration" required />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="shift">Shift *</Label>
                        <Select name="shift" required>
                          <SelectTrigger id="shift"><SelectValue placeholder="Select shift" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Morning">Morning</SelectItem><SelectItem value="Day">Day</SelectItem><SelectItem value="Evening">Evening</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="blood">Blood Group *</Label>
                        <Select name="blood" required>
                          <SelectTrigger id="blood"><SelectValue placeholder="Select blood group" /></SelectTrigger>
                          <SelectContent>
                             <SelectItem value="A+">A+</SelectItem><SelectItem value="A-">A-</SelectItem>
                             <SelectItem value="B+">B+</SelectItem><SelectItem value="B-">B-</SelectItem>
                             <SelectItem value="AB+">AB+</SelectItem><SelectItem value="AB-">AB-</SelectItem>
                             <SelectItem value="O+">O+</SelectItem><SelectItem value="O-">O-</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                       <div className="space-y-1">
                          <Label htmlFor="phone">Contact Number *</Label>
                          <Input id="phone" name="phone" required placeholder="+8801XXXXXXXXX" />
                      </div>
                      <div className="space-y-1 col-span-2">
                        <Label>Picture Upload</Label>
                        <div className="flex items-center gap-2">
                          {avatarPreview ? <Image src={avatarPreview} alt="preview" width={56} height={56} className="rounded-lg object-cover h-14 w-14 border" /> : <div className="h-14 w-14 bg-muted rounded-lg"/>}
                          <Input name="avatar" type="file" accept="image/png,image/jpeg" onChange={handleAvatarChange} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {step === 2 && (
                    <div className="space-y-4">
                        <h3 className="text-base font-bold">Family Information</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div className="space-y-1"><Label>Mother’s Name</Label><Input name="motherName" /></div>
                             <div className="space-y-1"><Label>Mother’s Number</Label><Input name="motherPhone" placeholder="+880..." /></div>
                             <div className="space-y-1"><Label>Father’s Name</Label><Input name="fatherName" /></div>
                             <div className="space-y-1"><Label>Father’s Number</Label><Input name="fatherPhone" placeholder="+880..." /></div>
                             <div className="space-y-1"><Label>Brother’s Name</Label><Input name="brotherName" /></div>
                             <div className="space-y-1"><Label>Brother’s Number</Label><Input name="brotherPhone" placeholder="+880..." /></div>
                             <div className="space-y-1"><Label>Friend’s Name</Label><Input name="friendName" /></div>
                             <div className="space-y-1"><Label>Friend’s Number</Label><Input name="friendPhone" placeholder="+880..." /></div>
                         </div>
                    </div>
                )}
                {step === 3 && (
                  <div className="space-y-6">
                     <h3 className="text-base font-bold">Additional Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="space-y-1">
                            <Label>Birth Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !birthDate && "text-muted-foreground"
                                    )}
                                    >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {birthDate ? format(birthDate, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                    mode="single"
                                    selected={birthDate}
                                    onSelect={setBirthDate}
                                    initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                         </div>
                         <div className="space-y-1"><Label>NID Number</Label><Input name="nidNumber" /></div>
                      </div>
                       <div>
                          <h4 className="text-sm font-semibold mb-2">Social Links</h4>
                           <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Facebook className="w-5 h-5 text-muted-foreground"/>
                                <Input name="social_facebook" placeholder="Facebook profile URL" />
                              </div>
                              <div className="flex items-center gap-2">
                                <Instagram className="w-5 h-5 text-muted-foreground"/>
                                <Input name="social_instagram" placeholder="Instagram profile URL" />
                              </div>
                              <div className="flex items-center gap-2">
                                <Github className="w-5 h-5 text-muted-foreground"/>
                                <Input name="social_github" placeholder="GitHub profile URL" />
                              </div>
                           </div>
                       </div>
                      <div>
                          <h4 className="text-sm font-semibold mb-2">Other Contacts</h4>
                          <div id="contacts" className="space-y-2">
                            {contacts.map((contact) => (
                              <div key={contact.id} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
                                <Input placeholder="Relation (e.g., Uncle)" value={contact.relation} onChange={(e) => handleContactChange(contact.id, 'relation', e.target.value)} />
                                <Input placeholder="Number" value={contact.number} onChange={(e) => handleContactChange(contact.id, 'number', e.target.value)}/>
                                <Button type="button" variant="destructive" size="icon" onClick={() => removeContact(contact.id)}>
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                          <div className="text-right mt-2">
                            <Button type="button" onClick={addContact} variant="outline">+ Add Contact</Button>
                          </div>
                      </div>
                      
                      <div className="space-y-1">
                          <Label>Notes</Label>
                          <Textarea name="notes" placeholder="Any additional notes..." />
                      </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center p-6">
                <h3 className="font-bold mb-2">Student record created successfully.</h3>
                <div className="text-2xl font-black tracking-wider inline-flex items-center gap-2 bg-muted p-2 px-4 rounded-lg">
                    <span>ID: {studentId}</span>
                </div>
                <div className="mx-auto my-4 h-44 w-44 border rounded-lg flex items-center justify-center bg-gray-100">
                    <p className="text-muted-foreground">QR Code</p>
                </div>
                <Button onClick={handleReset} variant="outline">Add Another Record</Button>
            </div>
          )}
          </div>
          
          <div className="border-t mt-auto -mx-4 -mb-4 bg-background sticky bottom-0">
             <div className="p-4">
              {step < 4 && (
                  <div className="flex justify-between gap-2">
                     <Button type="button" variant="outline" onClick={handleBack} disabled={step === 1 || isLoading}>
                        Back
                      </Button>
                      <Button type="button" onClick={handleNext} className={cn(step === 3 && "bg-green-500 hover:bg-green-600")} disabled={isLoading}>
                         {isLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : (step === 3 ? 'Submit' : 'Next')}
                      </Button>
                  </div>
              )}
              </div>
          </div>
    </form>
  );
}
