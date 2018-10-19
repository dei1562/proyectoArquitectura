import { Component } from '@angular/core';
import { MenuController } from 'ionic-angular';

/**
 * Generated class for the MenuComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'menu',
  templateUrl: 'menu.html'
})
export class MenuComponent {

  activeMenu: string;

  text: string;

  constructor(public menu: MenuController) {
  }

}
