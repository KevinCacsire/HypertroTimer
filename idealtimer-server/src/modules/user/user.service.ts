import { Injectable, NotFoundException } from '@nestjs/common';
import { collection, getDocs, doc, where, query, updateDoc, deleteDoc } from 'firebase/firestore';
import { firestore } from '../../app.module';
import { SplitsService } from '../splits/splits.service';
import { WorkoutsService } from '../workouts/workouts.service';

@Injectable()
export class UserService {

  constructor(
    private readonly workoutService: WorkoutsService,
    private readonly splitService: SplitsService,
  ) {}
  
  async deleteUser(userId: string): Promise<void> {
    // Query the users collection for the specific user
    const userDocRef = doc(firestore, 'users', userId);

    // Delete user's settings
    await updateDoc(userDocRef, {
      audioOn: null,
      darkmode: null,
      selectedAudioFile: null,
      volume: null,
    });

    // Delete user's workouts
    const workoutsQuerySnapshot = await getDocs(collection(userDocRef, 'workouts'));
    await Promise.all(workoutsQuerySnapshot.docs.map(async (workoutDoc) => {
      const workoutId = workoutDoc.id;
      await this.workoutService.deleteWorkout(userId, workoutId);
    }));

    // Delete user's splits
    const splitsQuerySnapshot = await getDocs(collection(userDocRef, 'splits'));
    await Promise.all(splitsQuerySnapshot.docs.map(async (splitDoc) => {
      const splitId = splitDoc.id;
      await this.splitService.deleteSplit(userId, splitId);
    }));

    // Delete the user document itself
    await deleteDoc(userDocRef);
  }
}
