
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
        designs.push({ id: doc.id, ...doc.data() } as Design);
    });
    return designs;
};

export const deleteDesign = async (designId: string): Promise<void> => {
    const designRef = doc(db, "designs", designId);
    await deleteDoc(designRef);
};
