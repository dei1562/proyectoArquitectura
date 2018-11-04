import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, ModalController, LoadingController, Loading } from 'ionic-angular';

import { ReservasFormModalPage } from '../reservas-form-modal/reservas-form-modal';

import { FirebaseReservaModel } from '../../models/reserva.model';
import { ReservasProvider } from '../../providers/reservas/reservas';

import { AuthService } from '../core/auth.service';
import { LoginPage } from '../login/login';

import * as moment from 'moment';

@Component({
  selector: 'page-reservas',
  templateUrl: 'reservas.html',
})
export class ReservasPage {

  // Variable global donde se guardan todas las reservas
  listReservas: Array<FirebaseReservaModel>;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private toastCtrl: ToastController,
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

  openEditReservaModal(event, reserva){

    event.stopPropagation();

    if(reserva.confirmado == 'P') {
      let modal = this.modalCtrl.create(ReservasFormModalPage, {'reserva': reserva});
      modal.onDidDismiss(data => {
        this.getData();
      });
      modal.present();
    }
  }

  cerrarSession() {
    this.authService.doLogout()
    .then(res => {
      this.navCtrl.push(LoginPage);
    }, err => {
    });
  }

  confirmar(event, value) {

    event.stopPropagation();    

    value.confirmado = 'A';

    this.reservasProvider.updateReserva(value.key, value)
    .then(() => {
      this.presentToast("Reserva actualizada correctamente.")
    });

  }

  cancelar(event, value) {

    event.stopPropagation();

    value.confirmado = 'C';
    value.estado = false;

    this.reservasProvider.updateReserva(value.key, value)
    .then(() => {
      this.presentToast("Reserva actualizada correctamente.")
    });
    
  }

  ocultarBoton(value) {

    if(value.confirmado != 'P') {
      return false;
    }

    let resultado = moment(value.fecha_inicio).isSame(moment().hour(0).minute(0).second(0).millisecond(0));
    let horaActual = moment().hour();

    if (resultado === true && (horaActual == (parseInt(value.hora_inicio) - 1))) {
      return true;
    }

    return false;
  }

  presentToast(mensaje:string, showClose?:boolean){
    let toast = this.toastCtrl.create({
      message: mensaje,
      duration: (showClose) ? null : 3000,
      position: 'bottom',
      showCloseButton: (showClose) ? showClose : false
    });
  
    toast.onDidDismiss(() => {
    });
  
    toast.present();
  }

}
