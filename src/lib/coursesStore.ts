import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import { Course } from '../types';
import { COURSES_DATA } from '../data/courses';

const COURSES_COLLECTION = 'courses';

/**
 * Subscribes to the live "courses" collection in Firestore. Fires immediately
 * with the current data, then again on every change made by anyone (this
 * device or another visitor's admin session). Returns an unsubscribe function.
 */
export function subscribeToCourses(onChange: (courses: Course[]) => void): () => void {
  const coursesRef = collection(db, COURSES_COLLECTION);
  return onSnapshot(coursesRef, (snapshot) => {
    const courses = snapshot.docs.map((d) => d.data() as Course);
    onChange(courses);
  });
}

/** One-time seed: if the collection is empty (first deploy), populate it with the built-in demo courses. */
export async function seedCoursesIfEmpty(): Promise<void> {
  const coursesRef = collection(db, COURSES_COLLECTION);
  const snapshot = await getDocs(coursesRef);
  if (!snapshot.empty) return;

  const batch = writeBatch(db);
  COURSES_DATA.forEach((course) => {
    batch.set(doc(db, COURSES_COLLECTION, course.id), course);
  });
  await batch.commit();
}

export async function saveCourse(course: Course): Promise<void> {
  await setDoc(doc(db, COURSES_COLLECTION, course.id), course);
}

export async function deleteCourse(id: string): Promise<void> {
  await deleteDoc(doc(db, COURSES_COLLECTION, id));
}

/** Bulk delete, used to clear out leftover demo/seed courses in one action. */
export async function deleteCourses(ids: string[]): Promise<void> {
  const batch = writeBatch(db);
  ids.forEach((id) => batch.delete(doc(db, COURSES_COLLECTION, id)));
  await batch.commit();
}
