import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { FirebaseLavadoraModel } from '../../models/lavadora.model';
import { LavadoraProvider } from '../../providers/lavadora/lavadora';

@Component({
  selector: 'page-lavanderia',
  templateUrl: 'lavanderia.html',
})
export class LavanderiaPage {

  listLavadoras;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private lavadoraProvider: LavadoraProvider) {

    this.listLavadoras = this.lavadoraProvider.getLavadoras();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LavanderiaPage');
  }

}
