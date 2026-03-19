import { ActionError, defineAction } from "astro:actions";
import { FROM_EMAIL, RESEND_API_KEY, TO_EMAIL, RECAPTCHA_SECRET_KEY } from "astro:env/server";
import { z } from "astro/zod";
import { Resend } from "resend";

const resend = new Resend(RESEND_API_KEY)

export const server = {
    sendContactEmail: defineAction({
        accept: 'form',
        input: z.object({
            fullName: z.string().min(5, 'Nombre y Apellido inválido'),
            company: z.string().min(1, 'Empresa inválida'),
            email: z.email('Correo electrónico inválido'),
            phone: z.string().min(7, 'Teléfono inválido'),
            recaptcha: z.string()
        }),
        handler: async(fields) => {
            const {fullName, company, email, phone, recaptcha} = fields
            
            const recaptchaURL = 'https://www.google.com/recaptcha/api/siteverify';
            const requestBody = new URLSearchParams({
                secret: RECAPTCHA_SECRET_KEY,
                response: recaptcha
            });

            const response = await fetch(recaptchaURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: requestBody.toString()
            });

            const recaptchaData = await response.json();

            if (!recaptchaData.success) {
                throw new ActionError({
                    code: 'BAD_REQUEST',
                    message: 'Falló la verificación de reCAPTCHA'
                });
            }

            const { error} = await resend.emails.send({
                from: FROM_EMAIL,
                to: TO_EMAIL,
                subject: 'Solicitud de diagnóstico gratuito',
                html: `Datos de Cliente:<br/>Nombre: ${fullName}<br/>Empresa: ${company}<br/>Correo de contacto: ${email}<br/>Teléfono: ${phone}`,
                text: 'Alguien desea ser contactado'
            })

            if (error) {
                throw new ActionError({
                code: 'BAD_REQUEST',
                message: error.message
                })
            }

            return {
                success: true,
                message: '¡Formulario enviado!'
            }
        }
    })
}