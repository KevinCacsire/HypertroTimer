import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getAuth } from 'firebase/auth';
import { Observable, of } from 'rxjs';
import { BASE_URL, firebaseApp } from 'src/app/app.module';
import { SidemenuSettings } from '../model/SidemenuSettings';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  
    auth = getAuth(firebaseApp);

    constructor(private http: HttpClient) { }

    getSettings() : Observable<SidemenuSettings> {
        const user = this.auth.currentUser;
        if (!user) {
          // Handle case when user is not authenticated
          return of();
        }
    
        return this.http.get<SidemenuSettings>(`${BASE_URL}/users/${user.uid}/settings`);
    }

    postDefaultSettings(darkmode: boolean, audioOn: boolean, volume: number, selectedAudioFile: string) : Observable<void> {
        const user = this.auth.currentUser;
        if (!user) {
        // Handle case when user is not authenticated
            return of();
        }

        return this.http.post<void>(`${BASE_URL}/users/${user.uid}/settings`,
            { darkmode, audioOn, volume, selectedAudioFile });
    }

    putSettings(darkmode: boolean, audioOn: boolean, volume: number, selectedAudioFile: string) : Observable<void> {  
      const user = this.auth.currentUser;
        if (!user) {
          // Handle case when user is not authenticated
          return of();
        }
        
        return this.http.put<void>(`${BASE_URL}/users/${user.uid}/settings`,
            { darkmode, audioOn, volume, selectedAudioFile });
    }
}