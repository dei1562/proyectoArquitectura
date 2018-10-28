export class FirebaseReservaModel {
    key ?: string;
    lavadora: string;
    usuario: string;
    fecha_inicio: Date;
    hora_inicio: Date;
    hora_fin: Date;
    confirmado: string;
    precio: number;
    valor: number;
    dataLavadora ?: any;
}