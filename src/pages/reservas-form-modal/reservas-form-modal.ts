import { Component } from '@angular/core';
import { NavParams, ViewController, normalizeURL, ToastController, LoadingController, Loading } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

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
    precio: null,
    valor: null
  };

  loading: Loading;

  titulo = 'Nueva Reserva';
  flagButton = false;
  flagEliminar = false;

  fechaMinima:any;

  lavadoras: any;

  validationForm: FormGroup;

  constructor(
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private toastCtrl: ToastController,
    private formBuilder: FormBuilder,
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
    });

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
        precio:      tempReserva.precio,
        valor:      tempReserva.valor,
      };

      this.validationForm.get('lavadora').setValue(this.reserva.lavadora);
      this.validationForm.get('fecha_inicio').setValue(this.reserva.fecha_inicio);
      this.validationForm.get('hora_inicio').setValue(this.reserva.hora_inicio);
      this.validationForm.get('hora_fin').setValue(this.reserva.hora_fin);

      this.titulo   = "Editar Reserva";
      this.flagButton = true;

    }    
  }

  ionViewWillLoad() {
    this.validationForm = this.formBuilder.group({
      lavadora: new FormControl('', Validators.required),
      fecha_inicio: new FormControl('', Validators.required),
      hora_inicio: new FormControl('', Validators.required),
      hora_fin: new FormControl('', Validators.required),
    });
  }

  validationMessages = {
    'lavadora': [{ type: 'required', message: 'Por favor seleccione una lavadora' }],
    'fecha_inicio': [{ type: 'required', message: 'Por favor seleccione una fecha' }],
    'hora_inicio': [{ type: 'required', message: 'Por favor seleccione una hora de inicio' }],
    'hora_fin': [{ type: 'required', message: 'Por favor seleccione una hora de finalización' }],
  };

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
    console.log("reserva", reserva);
    this.flagEliminar = true;
    this.reservaService.removeReserva(reserva.key)
    .then(() => {
      this.viewCtrl.dismiss();
    })
  }

  buscarPrecio(lavadoraId){
    
    if(this.lavadoras){
      this.lavadoras
      .forEach((value, key) => {
        if(value.payload.doc.id === lavadoraId){
          this.reserva.precio = value.payload.doc.data().precio;
        }      
      });
    }    
  }

  onSubmit(values){
    
    if(this.validationForm.valid && this.flagEliminar === false) {
      console.log("values", values);

      this.reserva.lavadora = values.value.lavadora;
      this.reserva.fecha_inicio = values.value.fecha_inicio;
      this.reserva.hora_inicio = values.value.hora_inicio;
      this.reserva.hora_fin = values.value.hora_fin;

      if(this.flagButton === false) {
        this.addReserva(this.reserva);
      }else{
        this.updateReserva(this.reserva);
      }
    }
  }
}
