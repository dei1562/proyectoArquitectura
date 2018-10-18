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
    weight: null,
    status: true,
    industrial: false,
    price: null,
    image: ""
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
      this.lavadora = tempLavadora;
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
    this.lavadoraService.updateLavadora(lavadora.key, lavadora)
    .then(() => {
      this.navCtrl.push(LavanderiaPage);
    })
  }

  removeLavadora(lavadora: FirebaseLavadoraModel){
    this.lavadoraService.removeLavadora(lavadora)
    .then(() => {
      this.navCtrl.push(LavanderiaPage);
    })
  }

}
