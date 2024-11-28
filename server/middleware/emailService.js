const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // O utiliza el servicio que prefieras
    auth: {
        user: process.env.EMAIL_USER, // Tu correo
        pass: process.env.EMAIL_PASSWORD // Contraseña o clave de aplicación del correo
    }
});

const enviarCorreo = async (destinatario, asunto, mensaje) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER, // Remitente del correo
            to: destinatario, // Destinatario del correo
            subject: asunto, // Asunto del correo
            html: mensaje // Contenido en HTML
        });
        console.log('Correo enviado exitosamente');
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        throw new Error('No se pudo enviar el correo.');
    }
};

module.exports = enviarCorreo;
