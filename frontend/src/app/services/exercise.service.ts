import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { Exercise} from '../model/Exercise';
import { getAuth } from 'firebase/auth';
import { BASE_URL, firebaseApp } from '../app.module';


@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  
  private auth = getAuth(firebaseApp);
  lastFetchedExercises: Observable<Exercise[]> | null = null;

  constructor(private http: HttpClient) {}

  getExercises(splitId: string, sessionId: string) : Observable<Exercise[]> {
  const user = this.auth.currentUser;
    if (!user) {
      // Handle case when user is not authenticated
      return of();
    }
    
    return this.http.get<Exercise[]>(`${BASE_URL}/users/${user.uid}/splits/${splitId}/sessions/${sessionId}/exercises`)
  }

  postExercise(exerciseName: string, exerciseType: string, indexOrder: number, splitId: string, sessionId: string) : Observable<void> {
    const user = this.auth.currentUser;
    if (!user) {
      // Handle case when user is not authenticated
      return of();
    }
    
    return this.http.post<void>(`${BASE_URL}/users/${user.uid}/splits/${splitId}/sessions/${sessionId}/exercises`,
    { exerciseName, exerciseType, indexOrder });
  }

  deleteExercise(splitId: string, sessionId: string, exerciseId: string) : Observable<void> {
    const user = this.auth.currentUser;
    if (!user) {
      // Handle case when user is not authenticated
      return of();
    }

    return this.http.delete<void>(`${BASE_URL}/users/${user.uid}/splits/${splitId}/sessions/${sessionId}/exercises/${exerciseId}`);
  }

  putExercise(exerciseName: string, exerciseType: string, indexOrder: number, splitId: string, sessionId: string, exerciseId: string): Observable<void> {
    const user = this.auth.currentUser;
    if (!user) {
      // Handle case when user is not authenticated
      return of();
    }

    const body = { exerciseName, exerciseType, indexOrder };
    return this.http.put<void>(`${BASE_URL}/users/${user.uid}/splits/${splitId}/sessions/${sessionId}/exercises/${exerciseId}`, body);
  }

  putExercises(exercises: Exercise[], splitId: string, sessionId: string): Observable<void> {
    const user = this.auth.currentUser;
    if (!user) {
      // Handle case when user is not authenticated
      return of();
    }

    return this.http.put<void>(`${BASE_URL}/users/${user.uid}/splits/${splitId}/sessions/${sessionId}/exercises`, exercises);
  }

  fetchAllExercises(): Observable<string[]> {
    let filePath = '../../assets/resources/exercises.json';
  
    return this.http.get(filePath).pipe(
      map((data: any) => {
        let allExerciseNames: string[] = [];
  
        if (data.results) {
          for (const exercise of data.results) {
            const exerciseName = exercise.name + "; " + exercise.muscles + "; " + exercise.exercise_type;
            allExerciseNames.push(exerciseName);
          }
        }
        return allExerciseNames;
      }),
      catchError((error) => {
        console.error('Error fetching the file:', error);
        return [];
      })
    );
  }

  // 1 - biceps
  // 2 - triceps
  // 3 - shoulders
  // 4 - chest
  // 5 - back
  // 6 - quads
  // 7 - hamstrings
  // 8 - glutes
  // 9 - calves
  // 10 - abs
  // 11 - forearms
}
