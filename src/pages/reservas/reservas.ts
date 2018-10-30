import { Component } from '@angular/core';
import { NavController, NavParams, ModalController,LoadingController, Loading } from 'ionic-angular';

import { ReservasFormModalPage } from '../reservas-form-modal/reservas-form-modal';

import { FirebaseReservaModel } from '../../models/reserva.model';
import { ReservasProvider } from '../../providers/reservas/reservas';

import { AuthService } from '../core/auth.service';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-reservas',
  templateUrl: 'reservas.html',
})
export class ReservasPage {

  // Variable global donde se guardan todas las reservas
  listReservas: Array<FirebaseReservaModel>;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private reservasProvider: ReservasProvider,    
    private modalCtrl: ModalController, 
    public authService: AuthService) {

      
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReservasPage');
  }

  ionViewWillEnter(){
      this.getData();
  }

  getData() {

    let loading = this.loadingCtrl.create({
      content: 'Por favor espere...'
    });

    loading.present();

    this.reservasProvider.getReservas()
    .then(reservas => {
      this.listReservas = reservas;

      loading.dismiss();
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

  cerrarSession() {
    this.authService.doLogout()
    .then(res => {
      this.navCtrl.push(LoginPage);
    }, err => {
    });
  }

}
