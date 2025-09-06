const { z } = require('zod');

const ContactSchema = z.object({
  name: z.string().min(1).max(100),
  whatsapp: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Formato de WhatsApp inválido"),
  authorId: z.string().length(24, "authorId debe tener 24 caracteres"),
  companyId: z.number().optional() 
});

const CompanySchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100),
  ruc: z.string().length(11, "El RUC debe tener exactamente 11 dígitos")
});


module.exports = {
  ContactSchema,
  CompanySchema
};