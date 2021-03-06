import { Injectable } from "@angular/core";

import 'rxjs/add/operator/toPromise';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';

import { FirebaseUserModel } from './user.model';

@Injectable()
export class UserService {

  public user;
  public users;

  constructor(public afs: AngularFirestore){}

  getCurrentUser(){
    return new Promise<any>((resolve, reject) => {
      let userModel = new FirebaseUserModel();
      firebase.auth().onAuthStateChanged(function(user){
        if (user) {
          if(user.providerData[0].providerId == 'password'){
            //use a default image
            userModel.image = 'http://dsi-vd.github.io/patternlab-vd/images/fpo_avatar.png';
            userModel.name = user.displayName;
            userModel.provider = user.providerData[0].providerId;
            return resolve(userModel);
          }
          else{
            userModel.image = user.photoURL;
            userModel.name = user.displayName;
            userModel.provider = user.providerData[0].providerId;
            return resolve(userModel);
          }
        } else {
          reject('No user logged in');
        }
      })
    })
  }

  getExtraInfoUser() {

    return new Promise<any>((resolve, reject) => {

      let currentUser = firebase.auth().currentUser;

      this.afs.collection('Usuarios', ref => ref.where('uid', '==', currentUser.uid))
          .snapshotChanges()
          .subscribe(snapshots => {

            this.user = snapshots;
            resolve(snapshots)
          })
    });
  }

  getEUser() {
    return this.user;
  }

  userExists() {

    return new Promise<any>((resolve, reject) => {

      let currentUser = firebase.auth().currentUser;

      this.afs.collection('Usuarios', ref => ref.where('uid', '==', currentUser.uid))
          .snapshotChanges()
          .subscribe(snapshots => {
            
            if(snapshots.length <= 0){
              this.addUser(currentUser);
            }

            resolve(snapshots)
          })
    });
  }

  addUser(value) {

    return new Promise<any>((resolve, reject) => {

      this.afs.collection('Usuarios')
      .add({
        "uid": value.uid,
        "nombre": value.displayName,
        "email": value.email,
        "industrial": (value.industrial) ? value.industrial : false,
        "administrador": (value.administrador) ? value.administrador : false,
        "saldo": (value.saldo) ? value.saldo : 0,
        "saldo_anterior": (value.saldo_anterior) ? value.saldo_anterior : 0,
      })
      .then(
        res => resolve(res),
        err => reject(err)
      )
    })
  }

  updateUser(value, userKey) {

    return new Promise<any>((resolve, reject) => {

      this.afs.collection('Usuarios')
      .doc(userKey)
      .set(value)
      .then(
        res => resolve(res),
        err => reject(err)
      )
    })
  }

  getUsuarios() {
    
    return new Promise<any>((resolve, reject) => {

      this.afs.collection('Usuarios')
          .snapshotChanges()
          .subscribe(snapshots => {
            resolve(snapshots)
          })
    });
  }
  
}
