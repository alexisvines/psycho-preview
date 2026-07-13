import { z } from 'zod'

// Extraído de Booking.jsx para poder testearlo de forma aislada (vitest).
export const bookingSchema = z.object({
  patientName: z.string().min(2, 'Ingresa tu nombre completo'),
  patientEmail: z.string().email('Email inválido'),
  patientPhone: z.string().min(6, 'Ingresa un teléfono válido'),
  reasonForConsult: z.string().optional(),
  // Honeypot: campo oculto para bots. Las personas nunca lo ven ni lo completan.
  honeypot: z.string().optional(),
})
