import { Injectable } from '@nestjs/common';
import { collection, getDocs, doc, addDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../app.module';
import { Session } from '../../model/session';

@Injectable()
export class SessionsService {

    async getSessions(userId: string, splitId: string): Promise<Session[]> {
        const sessionsRef = collection(firestore, 'users', userId, 'splits', splitId, 'sessions');
        const snapshot = await getDocs(sessionsRef);
    
        const sessions: Session[] = [];
        for (const doc of snapshot.docs) {
            const sessionData = doc.data();
            const exercisesRef = collection(doc.ref, 'exercises');
            const exercisesSnapshot = await getDocs(exercisesRef);
    
            sessions.push({
                sessionId: doc.id,
                ...sessionData,
                exerciseCount: exercisesSnapshot.size
            } as Session);
        }
        return sessions;
    }
    

    async postSession(userId: string, splitId: string, sessionName: string, weekday: string): Promise<void> {
        const sessionsRef = collection(firestore, 'users', userId, 'splits', splitId, 'sessions');
        await addDoc(sessionsRef, { sessionName, weekday });
    }

    async deleteSession(userId: string, splitId: string, sessionId: string): Promise<void> {
        const sessionRef = doc(firestore, 'users', userId, 'splits', splitId, 'sessions', sessionId);
      
        const exercisesCollectionRef = collection(sessionRef, 'exercises');
        const exercisesSnapshot = await getDocs(exercisesCollectionRef);
        const exerciseDeletionPromises = exercisesSnapshot.docs.map(async (exerciseDoc) => {
          const exerciseRef = doc(firestore, 'users', userId, 'splits', splitId, 'sessions', sessionId, 'exercises', exerciseDoc.id);
          await deleteDoc(exerciseRef);
        });
      
        await Promise.all(exerciseDeletionPromises);
      
        await deleteDoc(sessionRef);
    }
      

    async updateSession(userId: string, splitId: string, sessionId: string, sessionName: string, weekday: number): Promise<void> {
        const sessionRef = doc(firestore, 'users', userId, 'splits', splitId, 'sessions', sessionId);
        await updateDoc(sessionRef, { sessionName, weekday });
    }
}
