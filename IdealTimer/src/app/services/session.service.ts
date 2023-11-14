import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getAuth } from 'firebase/auth';
import { Observable, of } from 'rxjs';
import { firebaseApp } from 'src/app/app.module';
import { Session } from '../model/Session';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  
  auth = getAuth(firebaseApp);

  constructor (private http: HttpClient) { }

  getSessions(splitId: string) : Observable<Session[]> {
    const user = this.auth.currentUser;
    if (!user) {
      // Handle case when user is not authenticated
      return of();
    }
    
    return this.http.get<Session[]>(`http://localhost:3000/users/${user.uid}/splits/${splitId}/sessions`);
  }

  postSession(sessionName: string, weekday: string, splitId: string) : Observable<void> {
    const user = this.auth.currentUser;
    if (!user) {
      // Handle case when user is not authenticated
      return of();
    }
    
    return this.http.post<void>(`http://localhost:3000/users/${user.uid}/splits/${splitId}/sessions`,
    { sessionName, weekday });
  }

  deleteSession(splitId: string, sessionId: string) : Observable<void> {
    const user = this.auth.currentUser;
    if (!user) {
      // Handle case when user is not authenticated
      return of();
    }

    return this.http.delete<void>(`http://localhost:3000/users/${user.uid}/splits/${splitId}/sessions/${sessionId}`);
  }

  putSession(sessionName: string, weekday: string, splitId: string, sessionId: string): Observable<void> {
    const user = this.auth.currentUser;
    if (!user) {
      // Handle case when user is not authenticated
      return of();
    }

    const body = { sessionName, weekday };
    
    return this.http.put<void>(`http://localhost:3000/users/${user.uid}/splits/${splitId}/sessions/${sessionId}`, body);
  }
}
