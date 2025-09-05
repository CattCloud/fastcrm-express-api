const { ContactSchema } = require('../utils/validations');
const { AppError } = require('../utils/AppError');
const {
    createContact,
    getContacts,
    findContactById,
    deleteContact,
    validateDuplicateContact,
    getContactsByAuthorID
} = require('../services/contactService');

const autorService = require("../services/authorsServices");


const createContactController = async (req, res, next) => {
  try {
    const result = ContactSchema.safeParse(req.body);
    if (!result.success) {
      const firstMessage = result.error.errors[0]?.message || 'Error de validación';
      return next(new AppError(firstMessage, 400, 'validation'));
    }

    const validatedData = result.data;

    console.log("Data ",validatedData);
    const { authorId } = validatedData;
    //Validar si el autor existe en la bd
    await autorService.getAuthorByID(authorId); 

    await validateDuplicateContact(authorId,validatedData.name, validatedData.whatsapp);
    const newContact = await createContact(validatedData);

    res.status(201).json({
      message: "Contacto creado correctamente",
      contact: newContact
    });
  } catch (error) {
    console.log("Error createContactController:", error);
    next(error);
  }
};

const getContactsController = async (req, res, next) => {
    try {
        const contacts = await getContacts(req.query);

        res.status(200).json({
            contacts,
            total: contacts.length
        });
    } catch (error) {
        console.log("Error getContactsController:", error);
        next(error);
    }
};

const getContactsByAuthorController = async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log("Author ID:", id);
        // Validar existencia del autor
        await autorService.getAuthorByID(id);
        
        const contacts = await getContactsByAuthorID(id);

        res.status(200).json({
            contacts,
            total: contacts.length
        });
    } catch (error) {
        console.log("Error getContactsByAuthorController:", error);
        next(error);
    }
};



const deleteContactController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const contact = await findContactById(id);

        if (!contact) {
            throw new AppError("Contacto no encontrado", 404, "contact");
        }

        await deleteContact(id);
        res.status(200).json({
            message: "Contacto eliminado correctamente"
        });
    } catch (error) {
        console.log("Error deleteContactController:", error);
        next(error);
    }
};


module.exports = {
    createContactController,
    getContactsController,
    getContactsByAuthorController,
    deleteContactController
};