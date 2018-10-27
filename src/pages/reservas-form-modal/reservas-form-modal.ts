import { Component } from '@angular/core';
import { NavParams, ViewController, normalizeURL, ToastController, LoadingController, Loading } from 'ionic-angular';
// import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { FirebaseReservaModel } from '../../models/reserva.model';
import { ReservasProvider } from '../../providers/reservas/reservas';
import { LavadoraProvider } from '../../providers/lavadora/lavadora';

@Component({
  selector: 'page-reservas-form-modal',
  templateUrl: 'reservas-form-modal.html',
})
export class ReservasFormModalPage {

  reserva: FirebaseReservaModel = {
    lavadora: "",
    usuario: "",
    fecha_inicio: null,
    hora_inicio: null,
    hora_fin: null,
    confirmado: 'P',
    valor: null
  };

  loading: Loading;

  titulo = 'Nueva Reserva';
  flagButton = false;

  fechaMinima:any;

  lavadoras: any;

  constructor(
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private toastCtrl: ToastController,
    // private formBuilder: FormBuilder,
    private reservaService: ReservasProvider,
    private lavadoraService: LavadoraProvider,
    private loadingCtrl: LoadingController,
  ) {
    this.fechaMinima = (new Date()).toLocaleDateString();
  }

  ionViewDidLoad() {

    this.lavadoraService.getLavadorasUser()
    .then(lavadoras => {
      this.lavadoras = lavadoras;
      console.log("this.lavadoras", this.lavadoras);
    });;

    var tempReserva = this.navParams.get("reserva");
    if(tempReserva !== null && tempReserva !== undefined){

      this.reserva = {
        key:        tempReserva.key,
        lavadora:   tempReserva.lavadora,
        usuario:    tempReserva.usuario,
        fecha_inicio: tempReserva.fecha_inicio,
        hora_inicio:  tempReserva.hora_inicio,
        hora_fin:   tempReserva.hora_fin,
        confirmado: tempReserva.confirmado,
        valor:      tempReserva.valor,
      };

      this.titulo   = "Editar Reserva";
      this.flagButton = true;
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
   }

  addReserva(reserva: FirebaseReservaModel){
    this.reservaService.addReserva(reserva)
    .then(ref => {
      this.viewCtrl.dismiss();
    })
  }

  updateReserva(reserva: FirebaseReservaModel){
    console.log(reserva);
    this.reservaService.updateReserva(reserva.key, reserva)
    .then(() => {
      this.viewCtrl.dismiss();
    })
  }

  removeReserva(reserva: FirebaseReservaModel){
    this.reservaService.removeReserva(reserva.key)
    .then(() => {
      this.viewCtrl.dismiss();
    })
  }

}
