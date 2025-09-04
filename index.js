require('dotenv').config();
const { conectarDB, mongoose } = require("./config/db");
const express = require("express");
const app = express();
const { mongooseErrorTransform, errorHandler } = require("./middlewares/errorMiddlewares");
const { cargarEtiquetasSugeridas } = require("./utils/etiquetasSugeridas");
const cors = require("./middlewares/cors");

// Rutas principales
const routesTemplate = require('./routes/templateRoutes');
const routesAuthor = require("./routes/authorRouter");
const routesTag = require("./routes/tagsRouter");

// Middleware base
app.use(express.json());
app.use(cors);
app.use('/template', routesTemplate);
app.use('/author', routesAuthor);
app.use('/tag', routesTag);
app.use(mongooseErrorTransform);
app.use(errorHandler);

conectarDB()
  .then(async () => {
    console.log("✅ Conectado a MongoDB");
    await cargarEtiquetasSugeridas();
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`✅ Servidor corriendo en puerto ${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error al conectar a MongoDB:", err);
  });