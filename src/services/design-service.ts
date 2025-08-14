
'use server';

import { db, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, deleteDoc } from "firebase/firestore";
import type { Design } from "@/types";

export const saveDesign = async (userId: string, designData: Omit<Design, 'id' | 'userId' | 'createdAt' | 'thumbnailUrl'>, thumbnailUrl: string | null): Promise<string> => {
    const docRef = await addDoc(collection(db, "designs"), {
        userId,
        ...designData,
        thumbnailUrl,
        createdAt: serverTimestamp(),
    });
    return docRef.id;
};

export const getDesignsForUser = async (userId: string): Promise<Design[]> => {
    const designsRef = collection(db, "designs");
    const q = query(designsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const designs: Design[] = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const design: Design = {
            id: doc.id,
            ...data,
            // Convert Firestore Timestamp to a serializable format (ISO string)
            createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
        } as Design;
        designs.push(design);
    });
    return designs;
};

export const deleteDesign = async (designId: string): Promise<void> => {
    const designRef = doc(db, "designs", designId);
    await deleteDoc(designRef);
};
