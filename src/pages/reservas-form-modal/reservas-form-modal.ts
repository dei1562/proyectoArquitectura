import { Component } from '@angular/core';
import { NavParams, ViewController, ToastController, LoadingController, Loading, AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { FirebaseReservaModel } from '../../models/reserva.model';
import { ReservasProvider } from '../../providers/reservas/reservas';
import { LavadoraProvider } from '../../providers/lavadora/lavadora';

@Component({
  selector: 'page-reservas-form-modal',
  templateUrl: 'reservas-form-modal.html',
})
export class ReservasFormModalPage {

  // Objeto donde sera almacenada la informacion
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

  // Variable global para manipular el mensaje de carga
  loading: Loading;

  // Variables de configuracion para el titulo, el boton de accion y el eliminar
  titulo = 'Nueva Reserva';
  flagButton = false;
  flagEliminar = false;

  fechaMinima:any;

  // Variable donde se almacenaran las labadoras del listado
  lavadoras: any;

  // FromGroup utilizado para validaciones del formulario
  validationForm: FormGroup;

  // Mensajes de validacion
  validationMessages = {
    'lavadora': [{ type: 'required', message: 'Por favor seleccione una lavadora' }],
    'fecha_inicio': [{ type: 'required', message: 'Por favor seleccione una fecha' }],
    'hora_inicio': [{ type: 'required', message: 'Por favor seleccione una hora de inicio' }],
    'hora_fin': [{ type: 'required', message: 'Por favor seleccione una hora de finalización' }],
  };

  constructor(
    public navParams: NavParams,
    private viewCtrl: ViewController,
    private toastCtrl: ToastController,
    private formBuilder: FormBuilder,
    private reservaService: ReservasProvider,
    private lavadoraService: LavadoraProvider,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
  ) {
    this.fechaMinima = (new Date()).toISOString();
    console.log("this.fechaMinima", this.fechaMinima);
    this.loading = this.loadingCtrl.create({
      content: 'Por favor espere...'
    });
  }

  ionViewDidLoad() {

    this.loading.present();

    this.lavadoraService.getLavadorasUser()
    .then(lavadoras => {
      this.lavadoras = lavadoras;

      this.loading.dismiss();
    });

    var tempReserva = this.navParams.get("reserva");
    if(tempReserva !== null && tempReserva !== undefined){

      this.reserva = {
        key:          tempReserva.key,
        lavadora:     tempReserva.lavadora,
        usuario:      tempReserva.usuario,
        fecha_inicio: tempReserva.fecha_inicio,
        hora_inicio:  tempReserva.hora_inicio,
        hora_fin:     tempReserva.hora_fin,
        confirmado:   tempReserva.confirmado,
        precio:       tempReserva.precio,
        valor:        tempReserva.valor,
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
      fecha_inicio: new FormControl('',  Validators.compose([
        Validators.required
      ])),
      hora_inicio: new FormControl('', Validators.required),
      hora_fin: new FormControl('', Validators.required),
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
   }

  addReserva(reserva: FirebaseReservaModel){
    this.reservaService.addReserva(reserva)
    .then(ref => {
      this.presentToast("Reserva realizada correctamente.")
      this.viewCtrl.dismiss();
    })
  }

  updateReserva(reserva: FirebaseReservaModel){
    console.log(reserva);
    this.reservaService.updateReserva(reserva.key, reserva)
    .then(() => {
      this.presentToast("Reserva actualizada correctamente.")
      this.viewCtrl.dismiss();
    })
  }

  removeReserva(reserva: FirebaseReservaModel){
    this.reservaService.removeReserva(reserva.key)
    .then(() => {
      this.presentToast("Reserva eliminada correctamente.")
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

      this.reserva.lavadora = values.value.lavadora;
      this.reserva.fecha_inicio = values.value.fecha_inicio;
      this.reserva.hora_inicio = values.value.hora_inicio;
      this.reserva.hora_fin = values.value.hora_fin;

      let validarReserva = this.reservaService.validarReserva(this.reserva);

      // let validadorReservas = false;
    
      // reservasLavadora.forEach(value => {
      //   console.log("value", value);
      //   if(value.length > 0 && validadorReservas === false) {
      //     validadorReservas = true;
      //     console.log("validadorReservas", validadorReservas);
      //   }
      // })
      
      // console.log("validadorReservas 2", validadorReservas);
      console.log("validarReserva", validarReserva);

      // if(this.flagButton === false) {
      //   this.addReserva(this.reserva);
      // }else{
      //   this.updateReserva(this.reserva);
      // }
    }
  }

  presentToast(mensaje:string){
    let toast = this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      position: 'bottom'
    });
  
    toast.onDidDismiss(() => {
    });
  
    toast.present();
  }

  confirmEliminar() {
    this.flagEliminar = true;

    let alert = this.alertCtrl.create({
      title: 'Confirmar eliminación',
      message: '¿¿Desea eliminar el registro?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            this.flagEliminar = false;
          }
        },
        {
          text: 'Si',
          handler: () => {
            this.removeReserva(this.reserva);
          }
        }
      ]
    });
    alert.present();
  }
}
