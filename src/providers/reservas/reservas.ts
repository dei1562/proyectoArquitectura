import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';

import { FirebaseReservaModel } from '../../models/reserva.model';

@Injectable()
export class ReservasProvider {

  private result: any;

  constructor(public afs: AngularFirestore) {}

  /**
   * Servicio encargado de listar la informacion
   */
  getReservas() {
    
    return new Promise<any>((resolve, reject) => {

      let currentUser = firebase.auth().currentUser;

      this.result = this.afs.collection('Reservas', ref => ref.where('usuario', '==', currentUser.uid))
          .snapshotChanges()
          .subscribe(snapshots => {
            resolve(snapshots)
          })
    });
  }

  addReserva(value) {

    let currentUser = firebase.auth().currentUser;
    value.usuario = currentUser.uid;

    return new Promise<any>((resolve, reject) => {

      this.afs.collection('Reservas')
      .add(value)
      .then(
        res => resolve(res),
        err => reject(err)
      )
    })
  }

  updateReserva(reservaKey, value) {
    return new Promise<any>((resolve, reject) => {

      this.afs.collection('Reservas')
      .doc(reservaKey)
      .set(value)
      .then(
        res => resolve(res),
        err => reject(err)
      )
    })
  }

  removeReserva(reservaKey) {
    return new Promise<any>((resolve, reject) => {

      this.afs.collection('Reservas')
      .doc(reservaKey)
      .delete()
      .then(
        res => resolve(res),
        err => reject(err)
      )
    })
  }

}
