import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getAuth } from 'firebase/auth';
import { Observable, of } from 'rxjs';
import { BASE_URL, firebaseApp } from 'src/app/app.module';
import { Split } from '../model/Split';

@Injectable({
  providedIn: 'root'
})
export class SplitService {
  
  auth = getAuth(firebaseApp);

  constructor (private http: HttpClient) { }

  getSplits() : Observable<Split[]> {
    const user = this.auth.currentUser;
    if (!user) {
      // Handle case when user is not authenticated
      return of();
    }

    return this.http.get<Split[]>(`${BASE_URL}/users/${user.uid}/splits`);
  }

  postSplit(splitName: string, sessionsAmount: string) : Observable<void> {
    const user = this.auth.currentUser;
    if (!user) {
      // Handle case when user is not authenticated
      return of();
    }
    
    return this.http.post<void>(`${BASE_URL}/users/${user.uid}/splits`,
      { splitName, sessionsAmount });
  }


  deleteSplit(splitId: string) : Observable<void> {
    const user = this.auth.currentUser;
    if (!user) {
      // Handle case when user is not authenticated
      return of();
    }

    return this.http.delete<void>(`${BASE_URL}/users/${user.uid}/splits/${splitId}`);
  }
  
  putSplit(splitName: string, sessionsAmount: string, splitId: string): Observable<void> {
    const user = this.auth.currentUser;
    if (!user) {
      // Handle case when user is not authenticated
      return of();
    }

    const body = { splitName, sessionsAmount };
    
    return this.http.put<void>(`${BASE_URL}/users/${user.uid}/splits/${splitId}`, body);
  }
}
