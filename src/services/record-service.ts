
'use server';

import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs, or } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import type { Record } from "@/types";

type AvatarFile = {
    buffer: ArrayBuffer;
    type: string;
    name: string;
} | null;

export const createRecord = async (userId: string, data: any, avatarFile: AvatarFile): Promise<string> => {
    let avatarUrl = '';

    // 1. Upload avatar if it exists
    if (avatarFile) {
        const fileExtension = avatarFile.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExtension}`;
        const storagePath = `avatars/${userId}/${fileName}`;
        const storageRef = ref(storage, storagePath);
        
        // Upload the file buffer
        await uploadBytes(storageRef, avatarFile.buffer, { contentType: avatarFile.type });
        avatarUrl = await getDownloadURL(storageRef);
    }
    
    // 2. Create the document in Firestore with all data
    const docRef = await addDoc(collection(db, "records"), {
        userId,
        ...data,
        avatarUrl,
        createdAt: serverTimestamp(),
    });

    return docRef.id;
};

// Search for records by ID, name, or roll number
export const searchRecords = async (userId: string, searchTerm: string): Promise<Record[]> => {
    const recordsRef = collection(db, "records");
    
    // Create a query against the collection.
    // Since we need to search across multiple fields, and Firestore doesn't support
    // full-text search natively, we will perform a compound query.
    // We can use an OR condition if fields are indexed.
    // For partial text search on 'studentName', we use a trick with >= and <=
    const q = query(recordsRef, 
        where("userId", "==", userId),
        or(
           where("id", "==", searchTerm),
           where("roll", "==", searchTerm),
           // For partial name search:
           where('studentName', '>=', searchTerm),
           where('studentName', '<=', searchTerm + '\uf8ff')
        )
    );

    try {
        const querySnapshot = await getDocs(q);
        const records: Record[] = [];
        querySnapshot.forEach((doc) => {
            records.push({ id: doc.id, ...doc.data() } as Record);
        });

        // The partial name search might return non-matches if other conditions also matched.
        // We will do a final client-side filter for name to be sure.
        return records.filter(record => 
            record.id === searchTerm || 
            record.roll === searchTerm ||
            record.studentName.toLowerCase().includes(searchTerm.toLowerCase())
        );

    } catch (error) {
        // Firestore throws if a composite index for the 'or' query is not created.
        // Let's handle this by splitting the query and merging the results.
        if (error instanceof Error && error.message.includes('requires an index')) {
             console.warn("Firestore composite index not found. Falling back to separate queries. Create the index in the Firebase console for better performance. The error message contains the link to create it.");

             const idQuery = query(recordsRef, where("userId", "==", userId), where("id", "==", searchTerm));
             const rollQuery = query(recordsRef, where("userId", "==", userId), where("roll", "==", searchTerm));
             const nameQuery = query(recordsRef, where("userId", "==", userId), where('studentName', '>=', searchTerm), where('studentName', '<=', searchTerm + '\uf8ff'));

             const [idSnap, rollSnap, nameSnap] = await Promise.all([
                 getDocs(idQuery),
                 getDocs(rollQuery),
                 getDocs(nameQuery)
             ]);
            
             const resultsMap = new Map<string, Record>();
             idSnap.forEach(doc => resultsMap.set(doc.id, { id: doc.id, ...doc.data() } as Record));
             rollSnap.forEach(doc => resultsMap.set(doc.id, { id: doc.id, ...doc.data() } as Record));
             nameSnap.forEach(doc => resultsMap.set(doc.id, { id: doc.id, ...doc.data() } as Record));
            
             return Array.from(resultsMap.values());
        }
        // Re-throw other errors
        throw error;
    }
};
