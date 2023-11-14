import { Injectable } from '@nestjs/common';
import { collection, getDocs, doc, addDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../app.module';
import { Split } from '../../model/split';

@Injectable()
export class SplitsService {

  async getSplits(userId: string): Promise<Split[]> {
    const splitsRef = collection(firestore, 'users', userId, 'splits');
    const splitsSnapshot = await getDocs(splitsRef);

    const splits: Split[] = [];
    for (const splitDoc of splitsSnapshot.docs) {
      const splitData = splitDoc.data();
      const split: Split = {
        splitId: splitDoc.id,
        splitName: splitData.splitName,
        sessionsAmount: splitData.sessionsAmount,
      };
      splits.push(split);
    }

    return splits;
  }

  async postSplit(userId: string, splitName: string, sessionsAmount: number): Promise<void> {
    const splitsRef = collection(firestore, 'users', userId, 'splits');
    await addDoc(splitsRef, { splitName, sessionsAmount });
  }

  async deleteSplit(userId: string, splitId: string): Promise<void> {
    const splitRef = doc(firestore, 'users', userId, 'splits', splitId);
    const sessionsCollectionRef = collection(splitRef, 'sessions');
    const sessionsSnapshot = await getDocs(sessionsCollectionRef);
    
    const sessionDeletionPromises = sessionsSnapshot.docs.map(async (sessionDoc) => {
      const sessionRef = doc(firestore, 'users', userId, 'splits', splitId, 'sessions', sessionDoc.id);
      
      const exercisesCollectionRef = collection(sessionRef, 'exercises');
      const exercisesSnapshot = await getDocs(exercisesCollectionRef);
      const exerciseDeletionPromises = exercisesSnapshot.docs.map(async (exerciseDoc) => {
        const exerciseRef = doc(firestore, 'users', userId, 'splits', splitId, 'sessions', sessionDoc.id, 'exercises', exerciseDoc.id);
        await deleteDoc(exerciseRef);
      });
      await Promise.all(exerciseDeletionPromises);
  
      await deleteDoc(sessionRef);
    });
  
    await Promise.all(sessionDeletionPromises);
    await deleteDoc(splitRef);
  }

  async updateSplit(userId: string, splitId: string, splitName: string, sessionsAmount: number): Promise<void> {
    const splitRef = doc(firestore, 'users', userId, 'splits', splitId);
    await updateDoc(splitRef, { splitName, sessionsAmount });
  }
}
