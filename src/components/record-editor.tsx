
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
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { X } from "lucide-react";

type Contact = {
  id: number;
  relation: string;
  number: string;
};

export default function RecordEditor() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const nextContactId = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);


  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      const newId = Math.floor(1000 + Math.random() * 9000).toString();
      setStudentId(newId);
      setShowSuccess(true);
    } else {
      form.reportValidity();
    }
  };
  
  const handleReset = () => {
      formRef.current?.reset();
      setAvatarPreview(null);
      setContacts([]);
      setShowSuccess(false);
      setStudentId("");
  }

  return (
      <form onSubmit={handleSubmit} onReset={handleReset} ref={formRef} className="flex flex-col h-full">
         <ScrollArea className="flex-1 -mx-4">
             <div className="p-4 space-y-6">
              {!showSuccess ? (
            <>
              <div>
                  <h3 className="text-base font-bold mb-2">Student Information</h3>
                  <div className="grid grid-cols-1 gap-4">
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
                        <SelectTrigger id="shift">
                          <SelectValue placeholder="Select shift" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Morning">Morning</SelectItem>
                          <SelectItem value="Day">Day</SelectItem>
                          <SelectItem value="Evening">Evening</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="blood">Blood Group *</Label>
                      <Select name="blood" required>
                        <SelectTrigger id="blood">
                          <SelectValue placeholder="Select blood group" />
                        </SelectTrigger>
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
                    <div className="space-y-1">
                      <Label>Picture Upload</Label>
                      <div className="flex items-center gap-2">
                        {avatarPreview ? <Image src={avatarPreview} alt="preview" width={56} height={56} className="rounded-lg object-cover h-14 w-14 border" /> : <div className="h-14 w-14 bg-muted rounded-lg"/>}
                        <Input type="file" accept="image/png,image/jpeg" onChange={handleAvatarChange} />
                      </div>
                    </div>
                  </div>
              </div>

              <div>
                  <h3 className="text-base font-bold mb-2">Family Information</h3>
                  <div className="grid grid-cols-1 gap-4">
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
              
              <div>
                  <h3 className="text-base font-bold mb-2">Other Contacts</h3>
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
              
              <div>
                  <h3 className="text-base font-bold mb-2">Extra Details</h3>
                  <div className="grid grid-cols-1 gap-4">
                     <div className="space-y-1"><Label>Birth Certificate Number</Label><Input name="birthCert" /></div>
                     <div className="space-y-1"><Label>Social Link</Label><Input name="social" placeholder="https://..." /></div>
                  </div>
                   <div className="space-y-1 mt-4">
                        <Label>Notes</Label>
                        <Textarea name="notes" placeholder="Any notes..." />
                    </div>
              </div>
            </>
          ) : (
            <div className="text-center p-6">
                <h3 className="font-bold mb-2">Student record created successfully.</h3>
                <div className="text-2xl font-black tracking-wider inline-flex items-center gap-2">
                    <span>ID: {studentId}</span>
                </div>
                <div className="mx-auto my-4 h-44 w-44 border rounded-lg flex items-center justify-center bg-gray-100">
                    <p className="text-muted-foreground">QR Code</p>
                </div>
                <Button onClick={handleReset}>Add Another Record</Button>
            </div>
          )}
          </div>
          </ScrollArea>
          
          <div className="p-4 border-t mt-auto -mx-4 -mb-4 bg-background">
              {!showSuccess && (
                  <div className="flex justify-end gap-2">
                     <Button type="reset" variant="outline">
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-green-500 hover:bg-green-600">Submit</Button>
                  </div>
              )}
          </div>
    </form>
  );
}
