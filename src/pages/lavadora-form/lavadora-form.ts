import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, ToastController, Platform, LoadingController, Loading, AlertController } from "ionic-angular";
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { FirebaseLavadoraModel } from '../../models/lavadora.model';
import { LavadoraProvider } from '../../providers/lavadora/lavadora';

import { LavanderiaPage } from '../lavanderia/lavanderia';

@Component({
  selector: 'page-lavadora-form',
  templateUrl: 'lavadora-form.html',
})
export class LavadoraFormPage {

  // Objeto donde sera almacenada la informacion
  lavadora: FirebaseLavadoraModel = {
    marca: "",
    peso: null,
    estado: true,
    industrial: false,
    precio: null,
    foto: ""
  };

  // Variable global para manipular el mensaje de carga
  loading: Loading;

  // Variables de configuracion para el titulo, el boton de accion y el eliminar
  titulo = 'Nueva Lavadora';
  flagButton = false;
  flagEliminar = false;

  // FromGroup utilizado para validaciones del formulario
  validationForm: FormGroup;

  // Mensajes de validacion
  validationMessages = {
    'marca': [{ type: 'required', message: 'Este campo es requrido' }],
    'peso': [
      { type: 'required', message: 'Este campo es requrido' },
      { type: 'pattern', message: 'Por favor ingrese solo numeros' }
    ],
    'estado': [{ type: 'required', message: 'Por favor indique el estado' }],
    'industrial': [{ type: 'required', message: 'Por favor indique si la lavadora es instrual o no' }],
    'precio': [
      { type: 'required', message: 'Este campo es requrido' },
      { type: 'pattern', message: 'Por favor ingrese solo numeros' }
    ],
    'foto': [{ type: 'required', message: 'Por favor seleccione una foto' }],
  };

  constructor(public navCtrl: NavController,
            public navParams: NavParams, 
            private lavadoraService: LavadoraProvider,
            public actionSheetCtrl: ActionSheetController,
            private formBuilder: FormBuilder,
            public toastCtrl: ToastController,
            public platform: Platform,
            public loadingCtrl: LoadingController,
            private alertCtrl: AlertController,
  ) {

    this.loading = this.loadingCtrl.create({
      content: 'Por favor espere...'
    });
  }

  ionViewDidLoad() {

    this.loading.present();

    var tempLavadora = this.navParams.get("lavadora");
    if(tempLavadora !== null && tempLavadora !== undefined){

      this.lavadora = {
        key:        tempLavadora.payload.doc.id,
        marca:      tempLavadora.payload.doc.data().marca,
        peso:       tempLavadora.payload.doc.data().peso,
        estado:     tempLavadora.payload.doc.data().estado,
        industrial: tempLavadora.payload.doc.data().industrial,
        precio:     tempLavadora.payload.doc.data().precio,
        foto:       tempLavadora.payload.doc.data().foto
      };

      this.validationForm.get('marca').setValue(this.lavadora.marca);
      this.validationForm.get('peso').setValue(this.lavadora.peso);
      this.validationForm.get('precio').setValue(this.lavadora.precio);
      this.validationForm.get('estado').setValue(this.lavadora.estado);
      this.validationForm.get('industrial').setValue(this.lavadora.industrial);
      // this.validationForm.get('foto').setValue(this.lavadora.foto);

      this.titulo   = "Editar Lavadora";
      this.flagButton = true;
    }

    this.loading.dismiss();
  }

  ionViewWillLoad() {
    this.validationForm = this.formBuilder.group({
      marca: new FormControl('', Validators.required),
      peso: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]+$')
      ])),
      precio: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]+$')
      ])),
      estado: new FormControl(true, Validators.required),
      industrial: new FormControl(false, Validators.required),
      // foto: new FormControl('', Validators.required),
    });
  }

  addLavadora(lavadora: FirebaseLavadoraModel){
    this.lavadoraService.addLavadora(lavadora)
    .then(ref => {
      this.presentToast("Registro creado correctamente.")
      this.navCtrl.push(LavanderiaPage);
    })
  }

  updateLavadora(lavadora: FirebaseLavadoraModel){
    console.log(lavadora);
    this.lavadoraService.updateLavadora(lavadora.key, lavadora)
    .then(() => {
      this.presentToast("Registro actualizado correctamente.")
      this.navCtrl.push(LavanderiaPage);
    })
  }

  removeLavadora(lavadora: FirebaseLavadoraModel){
    this.lavadoraService.removeLavadora(lavadora.key)
    .then(() => {
      this.presentToast("Registro eliminado correctamente.")
      this.navCtrl.push(LavanderiaPage);
    })
  }

  onSubmit(values){
    
    if(this.validationForm.valid && this.flagEliminar === false) {

      this.lavadora.marca = values.value.marca;
      this.lavadora.peso = values.value.peso;
      this.lavadora.precio = values.value.precio;
      this.lavadora.estado = values.value.estado;
      this.lavadora.industrial = values.value.industrial;
      // this.lavadora.foto = values.value.foto;

      if(this.flagButton === false) {
        this.addLavadora(this.lavadora);
      }else{
        this.updateLavadora(this.lavadora);
      }
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
            this.removeLavadora(this.lavadora);
          }
        }
      ]
    });
    alert.present();
  }

}
