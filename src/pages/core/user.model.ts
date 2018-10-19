export class FirebaseUserModel {
  uid ?: string;
  image: string;
  name: string;
  provider: string;
  correo: string;
  industrial: boolean;
  administrador: boolean;

  constructor(){
    this.image = "";
    this.name = "";
    this.provider = "";
    this.correo = "";
    this.industrial = false;
    this.administrador = false;
  }
}
