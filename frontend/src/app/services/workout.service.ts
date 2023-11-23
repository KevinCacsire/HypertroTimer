import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Exercise} from '../model/Exercise';
import { getAuth } from 'firebase/auth';
import { BASE_URL, firebaseApp } from '../app.module';
import { WorkoutInstance } from '../model/WorkoutInstance';

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  
  private auth = getAuth(firebaseApp);

  constructor(private http: HttpClient) {}

  getWorkouts() : Observable<WorkoutInstance[]> {
  const user = this.auth.currentUser;
    if (!user) {
      // Handle case when user is not authenticated
      return of();
    }
    
    return this.http.get<WorkoutInstance[]>(`${BASE_URL}/users/${user.uid}/workouts`)
  }

  getWorkoutsBySplitId(splitId: string) : Observable<WorkoutInstance[]> {
    const user = this.auth.currentUser;
      if (!user) {
        // Handle case when user is not authenticated
        return of();
      }
      
      return this.http.get<WorkoutInstance[]>(`${BASE_URL}/users/${user.uid}/workouts/${splitId}`)
    }

  postWorkout(exercisesVolume: Exercise[], startingDate: Date, endingDate: Date, splitId: string, splitName: string, sessionId: string, sessionName: string) : Observable<void> {
    const user = this.auth.currentUser;
    if (!user) {
      // Handle case when user is not authenticated
      return of();
    }
    
    return this.http.post<void>(`${BASE_URL}/users/${user.uid}/workouts`,
    { exercisesVolume, startingDate, endingDate, splitId, splitName, sessionId, sessionName });
  }

  deleteWorkout(workoutId: string) : Observable<void> {
    const user = this.auth.currentUser;
    if (!user) {
      // Handle case when user is not authenticated
      return of();
    }

    return this.http.delete<void>(`${BASE_URL}/users/${user.uid}/workouts/${workoutId}`);
  }
}
