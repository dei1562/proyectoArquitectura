export class FirebaseUserModel {
  uid ?: string;
  image: string;
  name: string;
  provider: string;
  email: string;
  industrial: boolean;
  administrador: boolean;
  saldoanterior: number;
  saldo: number;

  constructor(){
    this.image = "";
    this.name = "";
    this.provider = "";
    this.email = "";
    this.industrial = false;
    this.administrador = false;
    this.saldoanterior = 0;
    this.saldo = 0;
  }
}
