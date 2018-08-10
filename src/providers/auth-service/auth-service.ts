import { Injectable } from '@angular/core';

declare var auth;
declare var firebase;
/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthServiceProvider {

  authState: any = null;

  constructor() {
  }

  createUserWithEmailAndPassword(name: string, email: string, password: string): any {
    return new Promise((resolve, reject) => {
      auth.createUserWithEmailAndPassword(email, password)
        .then((user) => {
          this.authState = user;
          this.updateProfileName(name);
          this.authState = null;
          console.log('usuario apos cadastro', this.authState);
          resolve(user);
          console.log('Aprovando cadastro');
        })
        .catch((error) => {
          reject(error);
          console.log('Reprovando cadastro');
        });
    });

  }

  updateProfileName(name: string) {
    var user = this.currentUser;
    user.updateProfile({
      displayName: name
    }).then(function () {
      console.log("Nome adicionado")
    }).catch(function (error) {
      console.log("nome não foi alterado:", error)
    });
  }

  signInWithEmailAndPassword(email: string, password: string) {
    return new Promise((resolve, reject) => {
      auth.signInWithEmailAndPassword(email, password)
        .then((auth) => {
          this.authState = auth;
          resolve(auth);
          console.log('Dados do usuario login authservice:', auth);
        })
        .catch((error) => {
          reject(error);
          console.log('Reprovando login');
        });
    });
  }

  signInWithGoogle(): any {
    var provider = new firebase.auth.GoogleAuthProvider();
    return new Promise((resolve, reject) => {
      if (!(<any>window).cordova) {
        auth.signInWithPopup(provider).then((result) => {
          var user = result.user;
          this.authState = user;
          resolve(user);
          // This gives you a Google Access Token. You can use it to access the Google API.
          var token = result.credential.accessToken;
          // The signed-in user info.
          console.log("Dados do token:", token);
          console.log("Dados do usuario Google authservice:", user);
        }).catch((error) => {
          reject(error.message);
        });
      } else { // não ta funcionando no compilado
        auth.signInWithRedirect(provider);
        auth.getRedirectResult().then((result) => {
            var user = result.user;
            this.authState = user;
            resolve(user);
        }).catch((error) => {
          reject(error.message);
        });
      }
    });

  }

  resetPasswordEmail(email: string) {
    return new Promise((resolve, reject) => {
      auth.sendPasswordResetEmail(email).then(() => {
        resolve();
      }).catch((error) => {
        reject(error);
      });
    })
  }

  signOut() {
    return new Promise((resolve, reject) => {
      auth.signOut().then(
        () => {
          resolve();
          this.authState = null;
        },
        (error) => reject(error.message)
      )
    });

  }

  get currentUser(): any {
    return (this.authState !== null) ? this.authState : null;
  }

  onAuthStateChanged(): any {
    auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        this.authState = user
        console.log('autenticado');
        // ...
      } else {
        this.authState = null;
      }
    });
  }

}
