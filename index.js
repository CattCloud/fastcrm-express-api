require('dotenv').config();
const {conectarDB, mongoose}=require("./config/db");
const express=require("express");
const app=express();
const {mongooseErrorTransform,errorHandler}=require("./middlewares/errorMiddlewares");
const { cargarEtiquetasSugeridas } = require("./utils/etiquetasSugeridas");

// Rutas principales
const routesTemplate = require('./routes/templateRoutes');
const routesAuthor =require("./routes/authorRouter");
const routesTag = require("./routes/tagsRouter");
//Establecer conexion con la bd
conectarDB();

// Middleware temporal para simular autenticación
app.use((req, res, next) => {
  req.user = { id: "68b32dccd8f3dc2924b21840" }; 
  next();
});


app.use(express.json()); 

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