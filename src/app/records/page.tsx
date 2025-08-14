
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Header from '@/components/header';
import { Info, Loader2, Search } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import type { Record } from '@/types';
import { searchRecords } from '@/services/record-service';
import SearchResults from '@/components/search-results';

export default function RecordsPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Record[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !searchTerm.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    try {
      const records = await searchRecords(user.uid, searchTerm.trim());
      setResults(records);
    } catch (error) {
      console.error("Error searching records: ", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 flex flex-col items-center p-4">
        <div className="w-full max-w-4xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Search Student Records
            </h1>
            <p className="text-muted-foreground mb-8">
              Enter a student's ID, name, or roll number to find their record.
            </p>
          </div>
          <form onSubmit={handleSearch} className="flex w-full items-center space-x-2">
            <Input
              type="search"
              placeholder="Search by Student ID, Name, or Roll Number..."
              className="h-12 text-base flex-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={!user || isLoading}
            />
            <Button type="submit" size="lg" disabled={!user || isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Search className="mr-2 h-5 w-5" />
              )}
              Search
            </Button>
          </form>

          {!user && (
              <Alert variant="destructive" className="mt-8">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Please Log In</AlertTitle>
                  <AlertDescription>
                      You must be logged in to search for records.
                  </AlertDescription>
              </Alert>
          )}

          <div className="mt-8">
            {isLoading ? (
              <div className="flex justify-center items-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : hasSearched ? (
              <SearchResults results={results} />
            ) : (
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
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
