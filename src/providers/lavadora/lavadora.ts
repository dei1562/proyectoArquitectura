import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import 'firebase/storage';

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

  /**
   * Lista la informacion de las lavadoras que puede reservar el usuario
   */
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

  /**
   * Consulta una lavadora por codigo
   * @param id Codigo de lavadora
   */
  getLavadora(id) {

    let tmpLavadora = this.afs.collection('Lavadoras').doc(id).valueChanges();

    return tmpLavadora;    
  }

  /**
   * Crea un nuevo registro
   * @param value 
   */
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

  /**
   * Actualiza el registro
   * @param lavadoraKey 
   * @param value 
   */
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

  /**
   * Elimina el registro
   * @param lavadoraKey 
   */
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

  /**
   * Valida si el rele asignado a la lavadora ya se encuentra ocupado
   * @param numRele Numero de Rele
   */
  validarDisponibilidadRele(numRele) {

    return new Promise<any>((resolve, reject) => {

      this.result = this.afs.collection('Lavadoras', ref => ref.where('rele', '==', numRele))
      .snapshotChanges()
      .subscribe(snapshots => {
        resolve(snapshots)
      })
    })
  }

  encodeImageUri(imageUri, callback) {
    var c = document.createElement('canvas');
    var ctx = c.getContext("2d");
    var img = new Image();
    img.onload = function () {
      var aux:any = this;
      c.width = aux.width;
      c.height = aux.height;
      ctx.drawImage(img, 0, 0);
      var dataURL = c.toDataURL("image/jpeg");
      callback(dataURL);
    };
    img.src = imageUri;
  };

  uploadImage(imageURI, randomId){
    return new Promise<any>((resolve, reject) => {
      let storageRef = firebase.storage().ref();
      let imageRef = storageRef.child('image').child(randomId);
      this.encodeImageUri(imageURI, function(image64){
        imageRef.putString(image64, 'data_url')
        .then(snapshot => {
          snapshot.ref.getDownloadURL()
          .then(res => resolve(res))
        }, err => {
          reject(err);
        })
      })
    })
  }

}
