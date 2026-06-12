import {
    collection,
    addDoc,
    serverTimestamp,
} from "firebase/firestore";

import { db } from "./firebase";

export async function saveLead(data: {
    name: string;
    email: string;
    phone: string;
}) {
    try {
        await addDoc(collection(db, "leads"), {
            ...data,
            createdAt: serverTimestamp(),
        });

        return true;
    } catch (error) {
        console.error("Firestore save error:", error);

        return false;
    }
}