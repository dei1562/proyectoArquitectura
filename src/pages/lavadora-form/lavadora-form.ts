import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ToastController, Platform, LoadingController, Loading } from "ionic-angular";

import { FirebaseLavadoraModel } from '../../models/lavadora.model';
import { LavadoraProvider } from '../../providers/lavadora/lavadora';

import { LavanderiaPage } from '../lavanderia/lavanderia';

@Component({
  selector: 'page-lavadora-form',
  templateUrl: 'lavadora-form.html',
})
export class LavadoraFormPage {

  lavadora: FirebaseLavadoraModel = {
    marca: "",
    peso: null,
    estado: true,
    industrial: false,
    precio: null,
    foto: ""
  };

  loading: Loading;

  titulo = 'Nueva Lavadora';
  flagButton = false;

  constructor(public navCtrl: NavController,
            public navParams: NavParams, 
            private lavadoraService: LavadoraProvider,
            public actionSheetCtrl: ActionSheetController,
            public toastCtrl: ToastController,
            public platform: Platform,
            public loadingCtrl: LoadingController) {

  }

  ionViewDidLoad() {
    var tempLavadora = this.navParams.get("lavadora");
    if(tempLavadora !== null && tempLavadora !== undefined){

      this.lavadora = {
        key:        tempLavadora.payload.doc.id,
        marca:      tempLavadora.payload.doc.data().marca,
        peso:       tempLavadora.payload.doc.data().peso,
        estado:     tempLavadora.payload.doc.data().estado,
        industrial: tempLavadora.payload.doc.data().industrial,
        precio:     tempLavadora.payload.doc.data().precio,
        foto:       tempLavadora.payload.doc.data().foto
      };

      this.titulo   = "Editar Lavadora";
      this.flagButton = true;
    }
  }

  addLavadora(lavadora: FirebaseLavadoraModel){
    this.lavadoraService.addLavadora(lavadora)
    .then(ref => {
      this.navCtrl.push(LavanderiaPage);
    })
  }

  updateLavadora(lavadora: FirebaseLavadoraModel){
    console.log(lavadora);
    this.lavadoraService.updateLavadora(lavadora.key, lavadora)
    .then(() => {
      this.navCtrl.push(LavanderiaPage);
    })
  }

  removeLavadora(lavadora: FirebaseLavadoraModel){
    this.lavadoraService.removeLavadora(lavadora.key)
    .then(() => {
      this.navCtrl.push(LavanderiaPage);
    })
  }

}
