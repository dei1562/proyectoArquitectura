export class FirebaseUserModel {
  uid ?: string;
  image: string;
  name: string;
  provider: string;
  email: string;
  industrial: boolean;
  administrador: boolean;

  constructor(){
    this.image = "";
    this.name = "";
    this.provider = "";
    this.email = "";
    this.industrial = false;
    this.administrador = false;
  }
}
