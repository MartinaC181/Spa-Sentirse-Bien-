import { ObjectId } from "mongoose";
import { JSX } from "react";

export interface IService {
    _id: ObjectId;
    nombre: string,
    Image: string,
    tipo: string,
    precio: number,
    descripcion: string,
}

export interface IUser {
  _id?: ObjectId;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  is_admin: boolean;
  role: 'admin' | 'cliente' | 'profesional';
}

export interface ITurno {
  map(arg0: (turno: ITurno, index: number) => JSX.Element): import("react").ReactNode;
  _id: ObjectId;
  cliente?: IUser, 
  servicio?: IService, 
  profesional?: IUser,
  fecha: Date,
  hora: string,
  estado: 'pendiente' | 'confirmado' | 'cancelado' | 'realizado',
}