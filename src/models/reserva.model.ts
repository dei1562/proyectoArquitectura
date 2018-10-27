export class FirebaseReservaModel {
    key ?: string;
    lavadora: string;
    usuario: string;
    fecha_inicio: Date;
    hora_inicio: Date;
    hora_fin: Date;
    confirmado: string;
    valor: number;
    dataLavadora ?: any;
}