
"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Trash2, Pencil, User, Image as ImageIcon } from 'lucide-react';
import type { Design, Record } from '@/types';
import { getDesignsForUser, deleteDesign } from '@/services/design-service';
import { getRecordsForUser, deleteRecord } from '@/services/record-service';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function AccountPage() {
  const { user, loading: authLoading } = useAuth();
  const [designs, setDesigns] = useState<Design[]>([]);
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const [userDesigns, userRecords] = await Promise.all([
            getDesignsForUser(user.uid),
            getRecordsForUser(user.uid)
          ]);
          setDesigns(userDesigns);
          setRecords(userRecords);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const handleDeleteDesign = async (designId: string) => {
    if (!user) return;
    try {
      await deleteDesign(designId);
      setDesigns(designs.filter(d => d.id !== designId));
    } catch (error) {
      console.error("Failed to delete design:", error);
    }
  };

  const handleDeleteRecord = async (recordId: string) => {
    if (!user) return;
    try {
      await deleteRecord(recordId);
      setRecords(records.filter(r => r.id !== recordId));
    } catch (error) {
      console.error("Failed to delete record:", error);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-4 md:p-8 container mx-auto">
          <Alert variant="destructive">
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>Please log in to view your account details.</AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }
  
  const getInitials = (name: string) => {
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.toUpperCase();
  }


  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <Header />
      <main className="flex-1 p-4 md:p-8 container mx-auto">
        <div className="flex items-center gap-4 mb-8">
            <Avatar className="h-20 w-20 border-2 border-primary">
                <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
                <AvatarFallback className="text-2xl">{getInitials(user.displayName || user.email || 'U')}</AvatarFallback>
            </Avatar>
            <div>
                <h1 className="text-3xl font-bold">{user.displayName}</h1>
                <p className="text-muted-foreground">{user.email}</p>
            </div>
        </div>

        <Tabs defaultValue="designs">
          <TabsList>
            <TabsTrigger value="designs">My Designs ({designs.length})</TabsTrigger>
            <TabsTrigger value="records">My Records ({records.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="designs" className="mt-6">
            {designs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {designs.map(design => (
                  <Card key={design.id}>
                    <CardHeader>
                      <CardTitle className="text-lg truncate">{design.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="h-40 bg-gray-100 flex items-center justify-center rounded-md m-6 mt-0">
                      <ImageIcon className="w-10 h-10 text-gray-400" />
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm"><Pencil className="w-4 h-4 mr-2" /> Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteDesign(design.id)}><Trash2 className="w-4 h-4 mr-2" /> Delete</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground mt-4">You haven't saved any designs yet.</p>
            )}
          </TabsContent>
          <TabsContent value="records" className="mt-6">
             {records.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {records.map(record => (
                  <Card key={record.id}>
                    <CardHeader>
                      <CardTitle className="text-lg truncate">{record.studentName}</CardTitle>
                      <p className="text-sm text-muted-foreground">ID: {record.id}</p>
                    </CardHeader>
                    <CardContent className="flex items-center gap-4 m-6 mt-0">
                       <Avatar>
                          <AvatarImage src={record.avatarUrl} alt={record.studentName}/>
                          <AvatarFallback><User/></AvatarFallback>
                       </Avatar>
                       <div>
                          <p className="font-medium">{record.roll}</p>
                          <p className="text-sm text-muted-foreground">Roll No.</p>
                       </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm"><Pencil className="w-4 h-4 mr-2" /> Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteRecord(record.id)}><Trash2 className="w-4 h-4 mr-2" /> Delete</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground mt-4">You haven't created any records yet.</p>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
