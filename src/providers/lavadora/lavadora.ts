import { Injectable } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';
import { FirebaseLavadoraModel } from '../../models/lavadora.model';

@Injectable()
export class LavadoraProvider {

  // Se crea el objeto donde seran almacenadas las lavadoras
  private listLavadoras = this.db.list<FirebaseLavadoraModel>('Lavadoras');

  constructor(public db: AngularFireDatabase) {}

  /**
   * Servicio encargado de listar las lavadoras
   */
  getLavadoras() {

    return this.listLavadoras;
  }

}
