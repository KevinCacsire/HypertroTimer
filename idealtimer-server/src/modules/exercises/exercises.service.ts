import { Injectable } from '@nestjs/common';
import { collection, getDocs, doc, addDoc,  deleteDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../app.module';
import { Exercise } from '../../model/exercise';

@Injectable()
export class ExercisesService {
    async getExercises(userId: string, splitId: string, sessionId: string): Promise<Exercise[]> {
        const ExercisesRef = collection(firestore, 'users', userId, 'splits', splitId, 'sessions', sessionId, 'exercises');
        const snapshot = await getDocs(ExercisesRef);

        const exercises: Exercise[] = [];
        snapshot.forEach((doc) => {
            exercises.push({
                exerciseId: doc.id,
                ...doc.data(),
            } as Exercise);
        });
        return exercises;
    }

    async postExercise(userId: string, splitId: string, sessionId: string, exerciseName: string, exerciseType: string, indexOrder: number): Promise<void> {
        const exercisesRef = collection(firestore, 'users', userId, 'splits', splitId, 'sessions', sessionId, 'exercises');
        await addDoc(exercisesRef, { exerciseName, exerciseType, indexOrder });
    }

    async deleteExercise(userId: string, splitId: string, sessionId: string, exerciseId: string): Promise<void> {
        const exercisesRef = doc(firestore, 'users', userId, 'splits', splitId, 'sessions', sessionId, 'exercises', exerciseId);
        await deleteDoc(exercisesRef);
    }

    async updateExercise(userId: string, splitId: string, sessionId: string, exerciseId: string, exerciseName: string, exerciseType: string, indexOrder: number): Promise<void> {
        const exercisesRef = doc(firestore, 'users', userId, 'splits', splitId, 'sessions', sessionId, 'exercises', exerciseId);
        await updateDoc(exercisesRef, { exerciseName, exerciseType, indexOrder });
    }
}
