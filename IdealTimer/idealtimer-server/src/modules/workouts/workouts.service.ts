import { Injectable } from '@nestjs/common';
import { Exercise } from '../../model/exercise';
import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { firestore } from 'src/app.module';
import { WorkoutInstance } from '../../model/WorkoutInstance';

@Injectable()
export class WorkoutsService {

    async getWorkouts(userId: string): Promise<WorkoutInstance[]> {
        const workoutsRef = collection(firestore, 'users', userId, 'workouts');
        const querySnapshot = await getDocs(workoutsRef);

        const workoutInstances: WorkoutInstance[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const workoutInstance = new WorkoutInstance();
            workoutInstance.exercisesVolumes = data.exercisesVolume;
            workoutInstance.workoutId = doc.id;
            workoutInstance.splitId = data.splitId;
            workoutInstance.splitName = data.splitName;
            workoutInstance.sessionId = data.sessionId;
            workoutInstance.sessionName = data.sessionName;
            workoutInstance.startingDate = data.startingDate;
            workoutInstance.endingDate = data.endingDate;
            
            workoutInstances.push(workoutInstance);
        });
        return workoutInstances;
    }

    async getUniqueRecentWorkoutsBySplitId(userId: string, splitId: string): Promise<WorkoutInstance[]> {
        const workoutsRef = collection(firestore, 'users', userId, 'workouts');
        const q = query(workoutsRef, where("splitId", "==", splitId));
        const querySnapshot = await getDocs(q);
    
        const workoutInstances: { [sessionId: string]: WorkoutInstance } = {};
    
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const workoutInstance = new WorkoutInstance();
            workoutInstance.exercisesVolumes = data.exercisesVolume;
            workoutInstance.workoutId = doc.id;
            workoutInstance.splitId = data.splitId;
            workoutInstance.splitName = data.splitName;
            workoutInstance.sessionId = data.sessionId;
            workoutInstance.sessionName = data.sessionName;
            workoutInstance.startingDate = data.startingDate;
            workoutInstance.endingDate = data.endingDate;
    
            const existingInstance = workoutInstances[workoutInstance.sessionId];
            if (!existingInstance || existingInstance.endingDate < workoutInstance.endingDate) {
                workoutInstances[workoutInstance.sessionId] = workoutInstance;
            }
        });
    
        return Object.values(workoutInstances);
    }

    async postWorkout(userId: string, exercisesVolume: Exercise[], startingDate: Date, endingDate: Date, splitId: string, splitName: string, sessionId: string, sessionName: string): Promise<void> {
        const workoutsRef = collection(firestore, 'users', userId, 'workouts');
        await addDoc(workoutsRef, { exercisesVolume, startingDate, endingDate, splitId, splitName, sessionId, sessionName });
    }

    async deleteWorkout(userId: string, workoutId: string): Promise<void> {
        const workoutRef = doc(firestore, 'users', userId, 'workouts', workoutId);
        await deleteDoc(workoutRef);
    }
}
