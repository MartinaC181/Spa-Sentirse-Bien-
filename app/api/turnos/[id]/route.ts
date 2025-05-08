import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import Turno from '../../../../models/Turno';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const data = await request.json();
    const turno = await Turno.findByIdAndUpdate(
      params.id,
      { $set: data },
      { new: true }
    );

    if (!turno) {
      return NextResponse.json(
        { error: 'Turno no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(turno);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al actualizar el turno' },
      { status: 500 }
    );
  }
} 