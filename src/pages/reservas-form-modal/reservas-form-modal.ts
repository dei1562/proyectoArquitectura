import { Component } from '@angular/core';
import { NavParams, ViewController, normalizeURL, ToastController, LoadingController, Loading } from 'ionic-angular';
// import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { FirebaseReservaModel } from '../../models/reserva.model';
import { ReservasProvider } from '../../providers/reservas/reservas';

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
    fecha_fin: null,
    hora_fin: null,
    confirmado: 'P',
    valor: null
  };

  loading: Loading;

  titulo = 'Nueva Reserva';
  flagButton = false;

  fechaMinima:any;

  constructor(
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private toastCtrl: ToastController,
    // private formBuilder: FormBuilder,
    private reservaService: ReservasProvider,
    private loadingCtrl: LoadingController,
  ) {
    this.fechaMinima = (new Date()).toLocaleDateString();
  }

  ionViewDidLoad() {
    var tempReserva = this.navParams.get("reserva");
    if(tempReserva !== null && tempReserva !== undefined){

      this.reserva = {
        key:        tempReserva.payload.doc.id,
        lavadora:   tempReserva.payload.doc.data().lavadora,
        usuario:    tempReserva.payload.doc.data().usuario,
        fecha_inicio: tempReserva.payload.doc.data().fecha_inicio,
        hora_inicio:  tempReserva.payload.doc.data().hora_inicio,
        fecha_fin:  tempReserva.payload.doc.data().fecha_fin,
        hora_fin:   tempReserva.payload.doc.data().hora_fin,
        confirmado: tempReserva.payload.doc.data().confirmado,
        valor:      tempReserva.payload.doc.data().valor,
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
