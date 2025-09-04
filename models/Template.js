const { mongoose } = require("../config/db.js");

const Template = new mongoose.Schema(
    {
        type: {
            type: String,
            required: true,
            default: "saludo",
            enum: [
                "saludo",
                "recordatorio",
                "seguimiento",
                "despedida",
                "felicitación",
                "agradecimiento",
                "promoción",
                "urgente",
                "confirmación",
                "reprogramación"
            ],
            //index: true
        },
        content: {
            type: String,
            required: true,
            index: true
        },
        labels: {
            type: [String], //Array de Strings
            required: true,
            validate: {
                validator: function (value) {
                    const uniqueArray = [...new Set(value.map(tag => tag.toLowerCase().trim()))];
                    return uniqueArray.length === value.length;
                },
                message: 'Las etiquetas no deben estar duplicadas'
            }
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Autor',
            required: true
        },
    },
    {
        timestamps: true,         // Agrega createdAt y updatedAt automáticamente
        versionKey: false         // Elimina el campo __v  
    }
)


const templates= mongoose.model("Template",Template)

module.exports={templates};
