import { Component } from '@angular/core';
import { NavController, NavParams, normalizeURL, ActionSheetController, ToastController, Platform, LoadingController, Loading, AlertController } from "ionic-angular";
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ImagePicker } from '@ionic-native/image-picker';

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
    foto: "./assets/imgs/default-laundry-machine-.png",
    rele: null
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

  tmpLavadora: any;

  constructor(public navCtrl: NavController,
            public navParams: NavParams, 
            private lavadoraService: LavadoraProvider,
            public actionSheetCtrl: ActionSheetController,
            private formBuilder: FormBuilder,
            public toastCtrl: ToastController,
            public platform: Platform,
            public loadingCtrl: LoadingController,
            private alertCtrl: AlertController,
            private imagePicker: ImagePicker,
  ) {

    this.loading = this.loadingCtrl.create({
      content: 'Por favor espere...'
    });
  }

  /**
   * Se inicializan los campos para el formulario si se esta actualizando el registro
   */
  ionViewDidLoad() {

    this.loading.present();

    this.tmpLavadora = this.navParams.get("lavadora");
    if(this.tmpLavadora !== null && this.tmpLavadora !== undefined){

      this.lavadora = {
        key:        this.tmpLavadora.payload.doc.id,
        marca:      this.tmpLavadora.payload.doc.data().marca,
        peso:       this.tmpLavadora.payload.doc.data().peso,
        estado:     this.tmpLavadora.payload.doc.data().estado,
        industrial: this.tmpLavadora.payload.doc.data().industrial,
        precio:     this.tmpLavadora.payload.doc.data().precio,
        foto:       this.tmpLavadora.payload.doc.data().foto,
        rele:       this.tmpLavadora.payload.doc.data().rele,
      };

      this.validationForm.get('marca').setValue(this.lavadora.marca);
      this.validationForm.get('peso').setValue(this.lavadora.peso);
      this.validationForm.get('precio').setValue(this.lavadora.precio);
      this.validationForm.get('estado').setValue(this.lavadora.estado);
      this.validationForm.get('industrial').setValue(this.lavadora.industrial);
      this.validationForm.get('rele').setValue(this.lavadora.rele);

      this.titulo   = "Editar Lavadora";
      this.flagButton = true;
    }

    this.loading.dismiss();
  }

  /**
   * Se crean los validadores para los campos del formulario
   */
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
      rele: new FormControl(false, Validators.required),
    });
  }

  /**
   * Funcion para crear el registro
   * @param lavadora 
   */
  addLavadora(lavadora: FirebaseLavadoraModel){
    this.lavadoraService.addLavadora(lavadora)
    .then(ref => {
      this.presentToast("Registro creado correctamente.")
      this.navCtrl.push(LavanderiaPage);
    })
  }

  /**
   * Funcion para actualizar el registro
   * @param lavadora 
   */
  updateLavadora(lavadora: FirebaseLavadoraModel){    
    this.lavadoraService.updateLavadora(lavadora.key, lavadora)
    .then(() => {
      this.presentToast("Registro actualizado correctamente.")
      this.navCtrl.push(LavanderiaPage);
    })
  }

  /**
   * Funcion para eliminar el registro
   * @param lavadora 
   */
  removeLavadora(lavadora: FirebaseLavadoraModel){
    this.lavadoraService.removeLavadora(lavadora.key)
    .then(() => {
      this.presentToast("Registro eliminado correctamente.")
      this.navCtrl.push(LavanderiaPage);
    })
  }

  /**
   * Accion submit del formulario, esta realiza dos validaciones antes de proceder a crear o actualizar el registro
   * @param values 
   */
  onSubmit(values){
    
    if(this.validationForm.valid && this.flagEliminar === false) {

      this.lavadora.marca = values.value.marca;
      this.lavadora.peso = values.value.peso;
      this.lavadora.precio = values.value.precio;
      this.lavadora.estado = values.value.estado;
      this.lavadora.industrial = values.value.industrial;
      this.lavadora.rele = values.value.rele;

      /**
       * Accion para validar si el rele que se selecciona se encuentra disponible
       */
      this.lavadoraService.validarDisponibilidadRele(this.lavadora.rele)
      .then(lavadoras => {

        let flagEstado = true;
        if(lavadoras.length > 0 && this.flagButton === false){
          flagEstado = false;
        } else if(lavadoras.length > 0 && this.flagButton === true && (this.tmpLavadora.payload.doc.data().rele !== this.lavadora.rele)) {
          flagEstado = false;
        }
        
        if(flagEstado) {
          if(this.flagButton === false) {
            this.addLavadora(this.lavadora);
          }else{
            this.updateLavadora(this.lavadora);
          }
        } else {
          this.presentToast("No es posible asignar el Rele No. "+this.lavadora.rele+" a la lavadora, este ya se encuentra asignado.")
        }
      });
    }
  }

  /**
   * Muestra en pantalla el mensaje enviado como parametro en un toast en la parte inferior de la pantalla
   * @param mensaje 
   */
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

  /**
   * Presenta en pantalla un cuadro de dialogo donde le solicita al usuario confirmacion para eliminar el registro
   */
  confirmEliminar(event) {

    event.stopPropagation();
    
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

  /**
   * Abre en pantalla la pantalla para seleccionar la imagen
   */
  openImagePicker(event){

    event.stopPropagation();

    this.imagePicker.hasReadPermission().then(
      (result) => {
        if(result == false){
          // no callbacks required as this opens a popup which returns async
          this.imagePicker.requestReadPermission();
        }
        else if(result == true){
          this.imagePicker.getPictures({
            maximumImagesCount: 1
          }).then(
            (results) => {
              for (var i = 0; i < results.length; i++) {
                this.uploadImageToFirebase(results[i]);
              }
            }, (err) => console.log(err)
          );
        }
      }, (err) => {
        console.log(err);
      });
  }

  /**
   * Accion para cargar la imagen a firebase
   * @param image 
   */
  uploadImageToFirebase(image){
    let loadingImg = this.loadingCtrl.create();

    loadingImg.present();
    image = normalizeURL(image);
    let randomId = Math.random().toString(36).substr(2, 5);

    //uploads img to firebase storage
    this.lavadoraService.uploadImage(image, randomId)
    .then(photoURL => {
      this.lavadora.foto = photoURL;
      loadingImg.dismiss();
      let toast = this.toastCtrl.create({
        message: 'Imagen actualizada correctamente',
        duration: 3000
      });
      toast.present();
      })
  }

}
