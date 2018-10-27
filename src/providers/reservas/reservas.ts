import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';
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

            var reservas:Array<FirebaseReservaModel> = [];
            console.log("reservas1", reservas);
            snapshots.forEach((element, key) => {
              
              reservas.push(element.payload.doc.data());

              reservas[key].key = element.payload.doc.id;
              
              this.lp.getLavadora(element.payload.doc.data().lavadora)
              .subscribe((res: FirebaseLavadoraModel[]) => {
                reservas[key].dataLavadora = res;
              });
            });

           
            resolve(reservas)
          })

      // let tmpReservas = this.afs.collection('Reservas', ref => ref.where('usuario', '==', currentUser.uid)).valueChanges();
            
      // if(tmpReservas){
        
      //   tmpReservas.forEach(element => {

      //     element.forEach(reserva => {
      //       this.lp.getLavadora(reserva.lavadora)
      //       .subscribe((res: FirebaseLavadoraModel[]) => {

      //         reserva.dataLavadora = res;
      //       });
      //     });

      //     console.log("element", element);

      //   });

      //   resolve(tmpReservas);

      // }else{

      //   resolve([]);
      // }

      // console.log("reservas", reservas);
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
