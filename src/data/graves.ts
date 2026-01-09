import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc
} from "firebase/firestore";
import { db } from "../firebase";
import type { Grave } from "../types";

const colRef = collection(db, "graves");

export function subscribeGraves(cb: (items: Grave[]) => void) {
  const q = query(colRef, orderBy("lastName", "asc"));
  return onSnapshot(q, (snap) => {
    const items: Grave[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
    cb(items);
  });
}

export async function createGrave(input: Omit<Grave, "id" | "createdAt" | "updatedAt">) {
  const fullName = `${input.firstName} ${input.lastName}`.trim();
  await addDoc(colRef, {
    ...input,
    fullName,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

export async function updateGrave(id: string, patch: Partial<Omit<Grave, "id">>) {
  const ref = doc(db, "graves", id);
  const next: any = { ...patch, updatedAt: serverTimestamp() };
  if (patch.firstName || patch.lastName) {
    const firstName = (patch.firstName ?? "").toString();
    const lastName = (patch.lastName ?? "").toString();
    // Ako se mijenja samo jedno polje, fullName može biti pogrešan. U praksi koristi form koji šalje oba polja.
    next.fullName = `${firstName} ${lastName}`.trim();
  }
  await updateDoc(ref, next);
}

export async function removeGrave(id: string) {
  const ref = doc(db, "graves", id);
  await deleteDoc(ref);
}
