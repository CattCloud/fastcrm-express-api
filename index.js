require('dotenv').config();
const { conectarDB, mongoose } = require("./config/db");
const express = require("express");
const app = express();
const { mongooseErrorTransform, errorHandler } = require("./middlewares/errorMiddlewares");
const { cargarEtiquetasSugeridas } = require("./utils/etiquetasSugeridas");
const cors = require("./middlewares/cors");
//const insertarPlantillasMasivas = require("./utils/insercionMasiva");
const { prisma,verificarConexionPostgres} = require('./config/prisma'); // o donde tengas tu inicialización


// Rutas principales
const routesTemplate = require('./routes/templateRoutes');
const routesAuthor = require("./routes/authorRouter");
const routesTag = require("./routes/tagsRouter");
const routesContact = require("./routes/contactRouter");
const routesCompany = require("./routes/companyRouter");
const routesContactLog = require("./routes/contactLogRouter");
// Middleware base
app.use(express.json());
app.use(cors);
app.use('/template', routesTemplate);
app.use('/author', routesAuthor);
app.use('/tag', routesTag);
app.use("/contact",routesContact);
app.use("/company",routesCompany);
app.use("/contactlog",routesContactLog);

app.use(mongooseErrorTransform);
app.use(errorHandler);

conectarDB()
  .then(async () => {
    console.log("✅ Conectado a MongoDB");
    await cargarEtiquetasSugeridas();
    await verificarConexionPostgres();
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`✅ Servidor corriendo en puerto ${port}`);
    });
    //insertarPlantillasMasivas();
  })
  .catch((err) => {
    console.error("❌ Error al conectar a MongoDB:", err);
  });