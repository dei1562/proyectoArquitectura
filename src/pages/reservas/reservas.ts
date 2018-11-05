import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, ModalController, LoadingController, Loading } from 'ionic-angular';

import { ReservasFormModalPage } from '../reservas-form-modal/reservas-form-modal';
import { UsuarioModalPage } from '../usuario-modal/usuario-modal';

import { FirebaseReservaModel } from '../../models/reserva.model';
import { ReservasProvider } from '../../providers/reservas/reservas';
import { UserService } from '../core/user.service';

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

  /**
   * Bandera que se utiliza para saber si el usuario es administrador
   */
  flagAdministrador: any = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private reservasProvider: ReservasProvider,    
    private modalCtrl: ModalController, 
    public authService: AuthService,
    public userService: UserService,) {

      this.userService.getExtraInfoUser()
      .then(usuario => {
        if(usuario.length > 0 && usuario[0].payload.doc.data().administrador === true) {
          this.flagAdministrador = true;
        }
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReservasPage');
  }

  ionViewWillEnter(){
      this.getData();
  }

  /**
   * Consulta toda la informacion de las reservas
   */
  getData() {

    let loading = this.loadingCtrl.create({
      content: 'Por favor espere...'
    });

    loading.present();
    
    if(this.flagAdministrador === true) {

      this.reservasProvider.getReservasAdministrador()
      .then(reservas => {
        console.log("reservas", reservas);
        this.listReservas = reservas;
  
        loading.dismiss();
      });
    } else {

      this.reservasProvider.getReservas()
      .then(reservas => {
        this.listReservas = reservas;
  
        loading.dismiss();
      });
    }
  }

  /**
   * Presenta en pantalla el formulario para crear un nuevo registro
   */
  openNewReservaModal(){
    let modal = this.modalCtrl.create(ReservasFormModalPage);
    modal.onDidDismiss(data => {
      this.getData();
    });
    modal.present();
  }
  
  /**
   * Presenta en pantalla el perfil del usuario conectado
   */
  userProfile(){
    let modal = this.modalCtrl.create(UsuarioModalPage);
    modal.onDidDismiss(data => {
    });
    modal.present();
  }

  /**
   * Presenta en pantalla el formulario para actualizar o eliminar el registro seleccionado
   */
  openEditReservaModal(event, reserva){

    event.stopPropagation();

    if(reserva.confirmado == 'P' && this.flagAdministrador === false) {
      let modal = this.modalCtrl.create(ReservasFormModalPage, {'reserva': reserva});
      modal.onDidDismiss(data => {
        this.getData();
      });
      modal.present();
    }
  }

  /**
   * Cierra la sesion actual del usuario
   */
  cerrarSession() {
    this.authService.doLogout()
    .then(res => {
      this.navCtrl.push(LoginPage);
    }, err => {
    });
  }

  /**
   * Accion para confirmar la reserva
   */
  confirmar(event, value) {

    event.stopPropagation();    

    value.confirmado = 'A';

    this.reservasProvider.updateReserva(value.key, value)
    .then(() => {
      this.presentToast("Reserva actualizada correctamente.")
    });

  }

  /**
   * Accion para cancelar la reserva
   */
  cancelar(event, value) {

    event.stopPropagation();

    value.confirmado = 'C';
    value.estado = false;

    this.reservasProvider.updateReserva(value.key, value)
    .then(() => {
      this.presentToast("Reserva actualizada correctamente.")
    });
    
  }

  /**
   * Accion para ocultar el boton de confirmar y eliminar
   */
  ocultarBoton(value) {

    if(this.flagAdministrador === true) {
      return false;
    }

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

  /**
   * Pinta en pantalla el mensaje toast que se le envie
   */
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
