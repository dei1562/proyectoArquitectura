import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';

import { ReservasFormModalPage } from '../reservas-form-modal/reservas-form-modal';

import { FirebaseReservaModel } from '../../models/reserva.model';
import { ReservasProvider } from '../../providers/reservas/reservas';
import { LavadoraProvider } from '../../providers/lavadora/lavadora';

@Component({
  selector: 'page-reservas',
  templateUrl: 'reservas.html',
})
export class ReservasPage {

  listReservas: Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private reservasProvider: ReservasProvider,
    private lavadoraProvider: LavadoraProvider,    
    private modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReservasPage');
  }

  ionViewWillEnter(){
      this.getData();
  }

  getData() {
    this.reservasProvider.getReservas()
    .then(reservas => {

      this.listReservas = reservas;
    });
  }

  openNewReservaModal(){
    let modal = this.modalCtrl.create(ReservasFormModalPage);
    modal.onDidDismiss(data => {
      this.getData();
    });
    modal.present();
  }

  openEditReservaModal(reserva){
    let modal = this.modalCtrl.create(ReservasFormModalPage, {'reserva': reserva});
    modal.onDidDismiss(data => {
      this.getData();
    });
    modal.present();
  }

}
