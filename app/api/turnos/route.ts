import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Turno from '@/app/models/Turno';

export async function GET() {
  try {
    await dbConnect();
    const turnos = await Turno.find().sort({ fecha: 1, hora: 1 });
    return NextResponse.json(turnos);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener los turnos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();
    const turno = await Turno.create(data);
    return NextResponse.json(turno);
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear el turno' }, { status: 500 });
  }
} 