import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      to, 
      subject, 
      html, 
      text 
    } = body;

    // Validaciones
    if (!to || !subject || (!html && !text)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Faltan campos requeridos: to, subject, y html o text' 
        },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Formato de email inválido' 
        },
        { status: 400 }
      );
    }

    // Verificar que las variables de entorno estén configuradas
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Variables de entorno de email no configuradas');
      return NextResponse.json(
        { 
          success: false, 
          message: 'Configuración de email no disponible' 
        },
        { status: 500 }
      );
    }

    // Configurar el transporter de nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Cambia según tu proveedor de email
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verificar la conexión
    await transporter.verify();

    // Configurar las opciones del email
    const mailOptions = {
      from: `"Spa Sentirse Bien" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: html,
      text: text || html.replace(/<[^>]*>/g, ''), // Fallback a texto plano si no se proporciona
    };

    // Enviar el email
    const info = await transporter.sendMail(mailOptions);

    console.log('Email enviado exitosamente:', info.messageId);

    return NextResponse.json({ 
      success: true, 
      message: 'Email enviado exitosamente',
      messageId: info.messageId
    });

  } catch (error: any) {
    console.error('Error al enviar email:', error);
    
    // Manejar errores específicos
    if (error.code === 'EAUTH') {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Error de autenticación. Verifica las credenciales de email.' 
        },
        { status: 401 }
      );
    }
    
    if (error.code === 'ECONNECTION') {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Error de conexión con el servidor de email.' 
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        message: 'Error al enviar el email: ' + (error.message || 'Error desconocido') 
      },
      { status: 500 }
    );
  }
} 