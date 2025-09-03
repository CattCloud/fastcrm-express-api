require('dotenv').config();
const {conectarDB, mongoose}=require("./config/db");
const express=require("express");
const app=express();
const {mongooseErrorTransform,errorHandler}=require("./middlewares/errorMiddlewares");
const { cargarEtiquetasSugeridas } = require("./utils/etiquetasSugeridas");
const cors = require("./middlewares/cors");



// Rutas principales
const routesTemplate = require('./routes/templateRoutes');
const routesAuthor =require("./routes/authorRouter");
const routesTag = require("./routes/tagsRouter");
//Establecer conexion con la bd
conectarDB();

app.use(express.json()); 
app.use(cors);
cargarEtiquetasSugeridas();

app.use('/template', routesTemplate);
app.use('/author', routesAuthor);
app.use('/tag', routesTag);


app.use(mongooseErrorTransform);
// Middleware de manejo de errores 
app.use(errorHandler);


const port=process.env.PORT;
app.listen(port, () => {
  console.log(`✅ Servidor corriendo en puerto ${port}`);
});