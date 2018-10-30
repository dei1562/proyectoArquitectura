import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { map } from 'rxjs/operators';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';

import { FirebaseReservaModel } from '../../models/reserva.model';
import { FirebaseLavadoraModel } from '../../models/lavadora.model';

import { LavadoraProvider } from '../lavadora/lavadora';

@Injectable()
export class ReservasProvider {

  private result: any;

  constructor(public afs: AngularFirestore, public lp: LavadoraProvider) {}

  /**
   * Servicio encargado de listar la informacion
   */
  getReservas() {
    
    return new Promise<any>((resolve, reject) => {

      let currentUser = firebase.auth().currentUser;

      this.result = this.afs.collection('Reservas', ref => ref.where('usuario', '==', currentUser.uid))
          .snapshotChanges()
          .subscribe(snapshots => {

            var reservas:Array<any> = [];
            snapshots.forEach((element, key) => {
              
              if(element.payload.doc.data()){
                reservas.push(element.payload.doc.data());

                reservas[key].key = element.payload.doc.id;
                
                this.lp.getLavadora(reservas[key].lavadora)
                .subscribe((res: FirebaseLavadoraModel[]) => {
                  reservas[key].dataLavadora = res;
                });
              }              
            });
           
            resolve(reservas)
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

  validarReserva(reserva: FirebaseReservaModel) {

    let resultA = this.afs.collection('Reservas', ref => ref.where('lavadora', '==', reserva.lavadora)
                                                            .where('fecha_inicio', '==', reserva.fecha_inicio)
                                                            .where('hora_inicio', '>=', reserva.hora_inicio)
                                                            .where('hora_inicio', '<=', reserva.hora_inicio))
                  .valueChanges();

    let resultB = this.afs.collection('Reservas', ref => ref.where('lavadora', '==', reserva.lavadora)
                                                            .where('fecha_inicio', '==', reserva.fecha_inicio)
                                                            .where('hora_fin', '>=', reserva.hora_fin)
                                                            .where('hora_fin', '<=', reserva.hora_fin))
                  .valueChanges();

    const reservasLavadora = combineLatest<any[]>(resultA, resultB).pipe(
      map(arr => arr.reduce((acc, cur) => acc.concat(cur) ) ),
    )
    
    reservasLavadora.forEach(value => {

      console.log("value", value);
    })

    return reservasLavadora;
  }

}
