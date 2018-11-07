import { Component } from '@angular/core';
import { NavParams, ViewController, ToastController, LoadingController, Loading, AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { FirebaseReservaModel } from '../../models/reserva.model';
import { ReservasProvider } from '../../providers/reservas/reservas';
import { LavadoraProvider } from '../../providers/lavadora/lavadora';
import { UserService } from '../core/user.service';

import * as moment from 'moment';

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
    valor: null,
    estado: true
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

  fotoLavadora: string;

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
    private userService: UserService,
  ) {

    this.fechaMinima = (new Date()).toISOString();

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
        estado:       tempReserva.estado,
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

  /**
   * Cierra el modal actualmente activo
   */
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
          this.fotoLavadora = value.payload.doc.data().foto;
        }
      });
    }    
  }

  onSubmit(values){    
    
    if(this.validationForm.valid && this.flagEliminar === false) {

      /**
       * Valida las horas de la reserva segun la fecha seleccionada
       */
      let resultadoValidacion = this.validarHora(values);

      if(resultadoValidacion === true) {
    
          this.reserva.lavadora = values.value.lavadora;
          this.reserva.fecha_inicio = values.value.fecha_inicio;
          this.reserva.hora_inicio = values.value.hora_inicio;
          this.reserva.hora_fin = values.value.hora_fin;          
    
          /**
           * Se procede a validar si la lavadora ya posee una reserva en el tiempo seleccionado por el usuario      
           */
          let validarReserva = this.reservaService.validarReserva(this.reserva);
    
          let count = 0;
          validarReserva.subscribe(value => {
    
            if(count === 0){
              if(value.length > 0) {
                this.presentToast("La lavadora ya se encuentra reserva para el horario seleccionado.", true);
              }else{

                /**
                 * Se procede a validar si el usuario tiene saldo para realizar la reserva
                 */
                let tiempoReserva =  parseInt(this.reserva.hora_fin.slice(0,2)) - parseInt(this.reserva.hora_inicio.slice(0,2));
                let costoReserva = tiempoReserva * this.reserva.precio;

                if(costoReserva > this.userService.getEUser()[0].payload.doc.data().saldo) {
                  this.presentToast("No cuenta con el saldo suficiente para crear esta reserva, el valor de la reserva es "+costoReserva, true);
                  return false;
                }

                /**
                 * Si la lavadora esta disponible se procede a crear la reserva si la bandera flagButton es falsa, de lo contrario se actualiza
                 */
                if(this.flagButton === false) {
                  this.addReserva(this.reserva);
                }else{
                  this.updateReserva(this.reserva);
                }
              }
            }
            
            count++;
          });
      }
    }
  }

  /**
   * Pinta en pantalla un mensaje tipo toast
   * @param mensaje 
   * @param showClose 
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

  /**
   * Validacion de confirmacion para eliminar la reserva
   */
  confirmEliminar() {
    this.flagEliminar = true;

    let alert = this.alertCtrl.create({
      title: 'Confirmar eliminación',
      message: '¿Desea eliminar el registro?',
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

  /**
   * Valida el rango de la hora seleccionada para la reserva que se va a realizar:
   * - Si la fecha seleccionada es la misma de la del dia entonces valida que la fecha inicial de la reserva se por lo menos dos horas mayor a la hora actual
   * - Si la fecha es diferente a la dehoy entoces valida que las hora final no sea menor a la inicial
   * @param values 
   */
  validarHora(values) {

    let horaInicio = values.value.hora_inicio.split(":");
        horaInicio = horaInicio[0];

    let horaFin = values.value.hora_fin.split(":");
        horaFin = horaFin[0];
    
    if(moment(values.value.fecha_inicio).isSame(moment().hour(0).minute(0).second(0).millisecond(0)) === true) {

      if(horaInicio == moment().hour() || horaInicio == (moment().hour() + 1)) {
        this.presentToast("La reservas para el mismo día se deben realizar con dos horas de anticipación.", true);
        return false;
      }
    }

    /**
     * Valida que las horas no se pasen del horario de la tienda
     */
    if((horaInicio < 7 || horaInicio > 23) || (horaFin < 7 || horaFin > 23)) {
      this.presentToast("Las horas seleccionadas no son validas, nuestro horario de atencion es de 7 AM a 11 PM.", true);
      return false;
    }
    
    /**
     * Valida que las horas no sean iguales
     */
    if(horaInicio == horaFin) {
      this.presentToast("Las horas seleccionadas no pueden ser iguales.", true);
      return false;
    }

    return true;
  }
}
