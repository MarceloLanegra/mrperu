import { ActionError, defineAction } from "astro:actions";
import { FROM_EMAIL, RESEND_API_KEY, TO_EMAIL } from "astro:env/server";
import { z } from "astro:schema";
import { Resend } from "resend";

const resend = new Resend(RESEND_API_KEY)

export const server = {
    sendContactEmail: defineAction({
        accept: 'form',
        input: z.object({
            fullName: z.string().min(5, 'Nombre y Apellido inválido'),
            company: z.string().min(1, 'Empresa inválida'),
            email: z.string().email('Correo electrónico inválido'),
            phone: z.string().min(7, 'Teléfono inválido')
        }),
        handler: async(fields) => {
            const {fullName, company, email, phone} = fields
            
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