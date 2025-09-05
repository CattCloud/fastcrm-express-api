const { z } = require('zod');

const ContactSchema = z.object({
  name: z.string().min(1).max(100),
  whatsapp: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Formato de WhatsApp inválido"),
  authorId: z.string().length(24, "authorId debe tener 24 caracteres")
});

module.exports = {
  ContactSchema,
};