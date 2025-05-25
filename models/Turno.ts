import mongoose from 'mongoose';

const turnoSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  servicio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  fecha: {
    type: Date,
    required: true
  },
  hora: {
    type: String,
    required: true
  },
  detalles: {
    type: String
  },
  estado: {
    type: String,
    enum: ['pendiente', 'confirmado', 'cancelado'],
    default: 'pendiente'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Turno || mongoose.model('Turno', turnoSchema); 