import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Observable } from 'rxjs/Observable'

import { FirebaseLavadoraModel } from '../../models/lavadora.model';
import { LavadoraProvider } from '../../providers/lavadora/lavadora';

@Component({
  selector: 'page-lavanderia',
  templateUrl: 'lavanderia.html',
})
export class LavanderiaPage {

  listLavadoras: Observable<FirebaseLavadoraModel[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private lavadoraProvider: LavadoraProvider) {

    this.listLavadoras = this.lavadoraProvider.getLavadoras()
                          .snapshotChanges()
                          .map(
                            changes => {
                              return changes.map(c => ({
                                key: c.payload.key, ...c.payload.val()
                              }))
                            }
                          );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LavanderiaPage');
  }

}
