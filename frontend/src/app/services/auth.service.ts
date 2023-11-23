import { Injectable } from '@angular/core';
import { Observable, forkJoin, from, map, of } from 'rxjs';
import { User } from 'src/app/model/User';
import { browserLocalPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  UserCredential } from 'firebase/auth';
import { BASE_URL, firebaseApp } from 'src/app/app.module';
import { UserRegister } from 'src/app/model/UserRegister';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  auth = getAuth(firebaseApp);

  constructor (private http: HttpClient) { }

  recoverEmailPassword(email: string) : Observable<void> {
    return new Observable<void>(observer => {
      sendPasswordResetEmail(this.auth, email)
      .then(() => {
        observer.next();
        observer.complete()
      })
      .catch((error) => {
        observer.error(error);
        observer.complete();
      });
    })

  } 

  login(email: string, password: string) : Observable<User> {
    return new Observable<User>(observer => {
      setPersistence(this.auth, browserLocalPersistence).then(() => {
        signInWithEmailAndPassword(this.auth, email, password)
        .then((userCredential: UserCredential) => {
          observer.next({email, password, id: userCredential.user.uid});
          observer.complete();
        }).catch(error => {
          observer.error(error);
          observer.complete();
        })
      })
    })
  }

  logout() : Observable<void> {
    return new Observable<void>((observer) => {
      signOut(this.auth)
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
          observer.complete();
        });
    });
  }

  register(userRegister: UserRegister) : Observable<void> {
    return new Observable<void>(observer => {
      createUserWithEmailAndPassword(this.auth, userRegister.email, userRegister.password)
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
          observer.complete();
        });
    }
  )}

  deleteAccount() : Observable<void> {
    const user = this.auth.currentUser;
    if (!user) {
      // Handle case when user is not authenticated
      return of();
    }
    const deleteUserData$ = this.http.delete<void>(`${BASE_URL}/users/${user.uid}`);
    const deleteAuthUser$ = from(user.delete());

    return forkJoin([deleteUserData$, deleteAuthUser$]).pipe(
      map(() => {
        return;
      })
    ); 
  }
}

