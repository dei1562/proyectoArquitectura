import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-usuario-modal',
  templateUrl: 'usuario-modal.html',
})
export class UsuarioModalPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private viewCtrl: ViewController,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UsuarioModalPage');
  }

  /**
   * Cierra el modal actualmente activo
   */
  dismiss() {
    this.viewCtrl.dismiss();
  }

}
