require('dotenv').config();

const ConnectDB = require("./config/database");
const { createServer } = require("./utils/serverUtils");
ConnectDB();

const app = createServer();

const expressSwagger = require('express-swagger-generator')(app);
expressSwagger({
    swaggerDefinition: {
      info: {
        title: 'Book Library API',
        description: 'Book Library API Documentation',
        version: '1.0.0',
      },
      host: 'localhost:5555', 
      basePath: '/api', 
      produces: ['application/json'], 
      schemes: ['http','https'], 
    },
    basedir: __dirname, 
    files: ['./routes/**/*.js'], 
  });

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`server listening at port ${PORT} `)
);