export class FirebaseReservaModel {
    key ?: string;
    lavadora: string;
    usuario: string;
    fecha_inicio: string;
    hora_inicio: string;
    hora_fin: string;
    confirmado: string;
    precio: number;
    valor: number;
    estado: boolean;
    dataLavadora ?: any;
}