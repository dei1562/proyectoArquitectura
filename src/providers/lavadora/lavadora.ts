import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { FirebaseLavadoraModel } from '../../models/lavadora.model';

@Injectable()
export class LavadoraProvider {

  // Se crea el objeto donde seran almacenadas las lavadoras
  listLavadoras: Observable<FirebaseLavadoraModel[]>;

  constructor(public http: HttpClient, public db: AngularFireDatabase) {

    /*
      Se realiza la consulta a la base de datos en el constructor para tener 
      la informacion al momento de llamar el servicio
    */
    this.listLavadoras = this.db.list<FirebaseLavadoraModel>('Lavadoras')
                          .snapshotChanges()
                          .map(
                            changes => {
                              return changes.map( c=> ({
                                key: c.payload.key, ...c.payload.val()
                              }))
                            }
                          );
  }

  /**
   * Servicio encargado de listar las lavadoras
   */
  getLavadoras() {

    return this.listLavadoras;
  }

}
