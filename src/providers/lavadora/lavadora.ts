import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';

import { FirebaseLavadoraModel } from '../../models/lavadora.model';
import { UserService } from '../../pages/core/user.service';

@Injectable()
export class LavadoraProvider {

  private result: any;
  private user: any;

  constructor(public afs: AngularFirestore, public userService:UserService) {}

  /**
   * Servicio encargado de listar la informacion
   */
  getLavadoras() {

    return new Promise<any>((resolve, reject) => {

      let currentUser = firebase.auth().currentUser;

      this.result = this.afs.collection('Lavadoras')
          .snapshotChanges()
          .subscribe(snapshots => {
            resolve(snapshots)
          })
    });
  }

  getLavadorasUser() {

    return new Promise<any>((resolve, reject) => {

      let currentUser = firebase.auth().currentUser;
      let extraInfo   = this.userService.getEUser()[0].payload.doc.data();

      if(extraInfo.industrial == false){
        this.afs.collection('Lavadoras', ref => ref.where('industrial', '==', false))
        .snapshotChanges()
        .subscribe(snapshots => {
          resolve(snapshots)
        })
      }else {
        this.afs.collection('Lavadoras')
        .snapshotChanges()
        .subscribe(snapshots => {
          resolve(snapshots)
        })
      }
    });
  }

  getLavadora(id) {
    console.log("id", id);
    return new Promise<any>((resolve, reject) => {

      this.afs.collection('Lavadoras')
      .doc(id)
      .snapshotChanges()
      .subscribe(snapshots => {
        resolve(snapshots)
      })
    });
  }

  addLavadora(value) {

    return new Promise<any>((resolve, reject) => {

      this.afs.collection('Lavadoras')
      .add(value)
      .then(
        res => resolve(res),
        err => reject(err)
      )
    })
  }

  updateLavadora(lavadoraKey, value) {
    return new Promise<any>((resolve, reject) => {

      this.afs.collection('Lavadoras')
      .doc(lavadoraKey)
      .set(value)
      .then(
        res => resolve(res),
        err => reject(err)
      )
    })
  }

  removeLavadora(lavadoraKey) {
    return new Promise<any>((resolve, reject) => {

      this.afs.collection('Lavadoras')
      .doc(lavadoraKey)
      .delete()
      .then(
        res => resolve(res),
        err => reject(err)
      )
    })
  }

}
