import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, ModalController, LoadingController, Loading } from 'ionic-angular';

import { UsuariosFormModalPage } from '../usuarios-form-modal/usuarios-form-modal';

import { FirebaseUsuarioModel } from '../../models/usuario.model';
import { UserService } from '../core/user.service';

import { AuthService } from '../core/auth.service';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-usuarios',
  templateUrl: 'usuarios.html',
})
export class UsuariosPage {

  /**
   * Variable global donde se guardan todos los usuarios
   */
  listUsuarios: Array<FirebaseUsuarioModel>;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController, 
    public authService: AuthService,
    public userService: UserService,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UsuariosPage');
    this.getData();
  }

  ionViewWillEnter(){      
  }

  /**
   * Consulta toda la informacion de los usuarios
   */
  getData() {

    let loading = this.loadingCtrl.create({
      content: 'Por favor espere...'
    });

    loading.present();

      this.userService.getUsuarios()
      .then(usuarios => {
        console.log("usuarios", usuarios);
        this.listUsuarios = usuarios;

        loading.dismiss();
      });
  }

  /**
   * Presenta en pantalla el formulario para crear un nuevo registro
   */
  openNewUsuarioModal(){
    let modal = this.modalCtrl.create(UsuariosFormModalPage);
    modal.onDidDismiss(data => {
      this.getData();
    });
    modal.present();
  }

  /**
   * Presenta en pantalla el formulario para actualizar o eliminar el registro seleccionado
   */
  openEditUsuarioModal(event, usuario){

    event.stopPropagation();

    let modal = this.modalCtrl.create(UsuariosFormModalPage, {'usuario': usuario});
    modal.onDidDismiss(data => {
      this.getData();
    });
    modal.present();
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
