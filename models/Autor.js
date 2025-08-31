const { mongoose } = require("../config/db.js");


const Autor = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        usernameLower: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: function () {
                return this.role !== "invitado";
            }
        },
        accessCount: {
            type: Number,
            required: true,
            default: 0
        },
        role: {
            type: String,
            required: true,
            enum: ["admin", "invitado", "usuario"],
            default: "invitado"
        },
        isActive: {
            type: Boolean,
            required: true,
            default: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }

)

const authors = mongoose.model("Autor", Autor);

module.exports = { authors };
