import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ToastController } from 'ionic-angular';

import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { AuthService } from '../core/auth.service';
import { UserService } from '../core/user.service';

@Component({
  selector: 'page-usuarios-form-modal',
  templateUrl: 'usuarios-form-modal.html',
})
export class UsuariosFormModalPage {

  registerForm: FormGroup;
  errorMessage: string = '';

  // Variables de configuracion para el titulo, el boton de accion y el eliminar
  titulo = 'Nuevo Usuario';
  flagButton = false;
  flagEliminar = false;
  userKey:string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public formBuilder: FormBuilder,
    public authService: AuthService,
    public userService: UserService,
    public viewCtrl: ViewController,
    private toastCtrl: ToastController,) {
  }

  ionViewWillLoad(){
    this.registerForm = this.formBuilder.group({
      email: new FormControl(),
      password: new FormControl(),
      administrador: new FormControl(),
      industrial: new FormControl()
    });
  }

  ionViewDidLoad() {
    
    var tempUsuario = this.navParams.get("usuario");
    this.userKey = "";
    if(tempUsuario !== null && tempUsuario !== undefined){

      this.userKey = tempUsuario.payload.doc.id;

      this.registerForm.get('email').setValue(tempUsuario.payload.doc.data().email);
      this.registerForm.get('administrador').setValue(tempUsuario.payload.doc.data().administrador);
      this.registerForm.get('industrial').setValue(tempUsuario.payload.doc.data().industrial);

      this.titulo   = "Editar Usuario";
      this.flagButton = true;

    }
  }

  tryRegister(value){

    if(this.flagButton === false) {

      this.authService.doRegister(value)
        .then(res => {
  
          value.uid = res.user.uid;
          value.displayName = res.user.displayName;
  
          this.userService.addUser(value)
          .then(res => {
  
            this.presentToast("Usuario creado correctamente");
            this.dismiss();
            this.errorMessage = "";
          }, err => {
            this.errorMessage = err.message;
          })
  
        }, err => {
          this.errorMessage = err.message;
        })
    } else {

      this.userService.updateUser(value, this.userKey)
        .then(res => {

          this.presentToast("Usuario actualizado correctamente");
          this.dismiss();
          this.errorMessage = "";
        }, err => {
          this.errorMessage = err.message;
        })
    }
  }

  /**
   * Destruye el modal que se encuentra activo
   */
  dismiss() {
    this.viewCtrl.dismiss();
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

}
