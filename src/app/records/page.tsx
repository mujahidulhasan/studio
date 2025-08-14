'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Header from '@/components/header';

export default function RecordsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-full max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Search Student Records
          </h1>
          <p className="text-muted-foreground mb-8">
            Enter a student's ID, name, or roll number to find their record.
          </p>
          <div className="flex w-full items-center space-x-2">
            <Input
              type="search"
              placeholder="Search by Student ID, Name, or Roll Number..."
              className="h-12 text-base"
            />
            <Button type="submit" size="lg">
              <Search className="mr-2 h-5 w-5" />
              Search
            </Button>
          </div>

          <Alert className="mt-8 text-left">
            <Info className="h-4 w-4" />
            <AlertTitle>How to Search</AlertTitle>
            <AlertDescription>
              You can search for student records using one of the following methods:
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>
                  <strong>Student ID:</strong> Enter the complete student ID (e.g., 1234).
                </li>
                <li>
                  <strong>Student Name:</strong> Enter the full or partial name of the student.
                </li>
                <li>
                  <strong>Roll Number:</strong> Enter the assigned roll number.
                </li>
                 <li>
                  <strong>QR Code:</strong> Use a QR code scanner to automatically populate the search field.
                </li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      </main>
    </div>
  );
}
