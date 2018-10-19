import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';

import { FirebaseLavadoraModel } from '../../models/lavadora.model';

@Injectable()
export class LavadoraProvider {

  private result: any;

  constructor(public afs: AngularFirestore) {}

  /**
   * Servicio encargado de listar la informacion
   */
  getLavadoras() {

    return new Promise<any>((resolve, reject) => {

      let currentUser = firebase.auth().currentUser;
      console.log("currentUser", currentUser);

      this.result = this.afs.collection('Lavadoras')
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
