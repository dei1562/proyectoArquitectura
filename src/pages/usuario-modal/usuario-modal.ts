import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController, Loading, ToastController } from 'ionic-angular';
import { UserService } from '../core/user.service';

import { FirebaseUserModel } from '../core/user.model';

@Component({
  selector: 'page-usuario-modal',
  templateUrl: 'usuario-modal.html',
})
export class UsuarioModalPage {

  usuario: FirebaseUserModel;
  keyDoc: string;
  saldo_nuevo: number = null;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private viewCtrl: ViewController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private userService: UserService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UsuarioModalPage');
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
  

    this.userService.getExtraInfoUser()
    .then(usuario => {
      this.usuario = usuario[0].payload.doc.data();
      this.keyDoc = usuario[0].payload.doc.id;

      loading.dismiss();
    });  
}

  /**
   * Cierra el modal actualmente activo
   */
  dismiss() {
    this.viewCtrl.dismiss();
  }

  /**
   * Actualiza el saldo actual del usuario con el valor ingresado
   */
  actualizarSaldo() {

    console.log("saldo_nuevo", this.saldo_nuevo);

    if(this.saldo_nuevo > 0) {

      this.usuario.saldoanterior = (this.usuario.saldo) ? this.usuario.saldo : 0;
      this.usuario.saldo = (this.usuario.saldo) ? (this.usuario.saldo + this.saldo_nuevo) : this.saldo_nuevo;

      this.userService.updateUser(this.usuario, this.keyDoc)
        .then(res => {

          this.saldo_nuevo = null;
          this.presentToast("Saldo actualizado correctamente.");
        }, err => {
          this.presentToast(err.message, true);
        })
    }else{

      this.presentToast("Por favor ingrese un valor mayor a cero.");
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

}
