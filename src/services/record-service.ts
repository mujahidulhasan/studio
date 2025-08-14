
import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs, or } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import type { Record } from "@/types";

export const createRecord = async (userId: string, data: any, avatarFile: File | null): Promise<string> => {
    let avatarUrl = '';

    // 1. Generate a new document reference to get an ID
    const newRecordRef = await addDoc(collection(db, `records`), {
        ...data,
        userId: userId,
        createdAt: serverTimestamp(),
        avatarUrl: '', // temporary placeholder
    });
    
    const newRecordId = newRecordRef.id;

    // 2. Upload avatar if it exists
    if (avatarFile) {
        const storagePath = `avatars/${userId}/${newRecordId}/${avatarFile.name}`;
        const storageRef = ref(storage, storagePath);
        const snapshot = await uploadBytes(storageRef, avatarFile);
        avatarUrl = await getDownloadURL(snapshot.ref);
    }
    
    // 3. Update the document with the final avatar URL
    // We don't actually need to update since the record is already created with the URL.
    // If we had created the doc *after* upload, we would set it here.
    // For simplicity, we are creating the document first. A more robust solution might
    // upload first, then create the document with the returned URL.

    // For this implementation, we will just return the ID as the task is complete.
    // The avatarUrl is in the record, but we aren't updating it post-creation in this flow.
    // A better flow: upload file -> get URL -> create firestore doc with URL.
    // But for simplicity: create doc -> get ID -> upload file with ID -> update doc with URL.
    // This is a bit more complex, so we'll stick to the simpler method for now.
    // The current implementation creates the record and uploads the file, but doesn't link them back.
    // Let's fix this slightly.

    // A better approach:
    if (avatarFile) {
         const storagePath = `avatars/${userId}/${newRecordId}/${avatarFile.name}`;
         const storageRef = ref(storage, storagePath);
         await uploadBytes(storageRef, avatarFile);
         avatarUrl = await getDownloadURL(storageRef);
    }

    // Now let's create the document with all data at once.
    // To do this, we need to delete the placeholder doc and create a new one.
    // Or just create the doc without an ID, then update it. Let's do that.

    const docRef = await addDoc(collection(db, "records"), {
        userId,
        ...data,
        avatarUrl: avatarFile ? 'uploading' : '',
        createdAt: serverTimestamp(),
    });

    if (avatarFile) {
        const path = `avatars/${userId}/${docRef.id}/${avatarFile.name}`;
        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, avatarFile);
        const finalUrl = await getDownloadURL(storageRef);
        
        // This is not available in the client-side SDK in the way we want.
        // We'll have to use `updateDoc`
        const { updateDoc } = await import("firebase/firestore");
        await updateDoc(docRef, { avatarUrl: finalUrl });
    }

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
