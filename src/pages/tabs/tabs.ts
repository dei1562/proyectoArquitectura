import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { LavanderiaPage } from '../lavanderia/lavanderia';
import { ReservasPage } from '../reservas/reservas';
import { UsuariosPage } from '../usuarios/usuarios';

/**
 * Generated class for the TabsPage tabs.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  lavanderiaRoot = LavanderiaPage;
  reservasRoot = ReservasPage;
  usuariosRoot = UsuariosPage;  

  constructor(public navCtrl: NavController) {}

}
