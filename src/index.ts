import express from 'express';
import cartsController from './cartsController';
import DatabaseConnection from './databaseConnection';

const app = express();
const port = 3000;

app.use('/carts', cartsController);

const databaseConnection = new DatabaseConnection();
const initializeServer = async () => {
  try {
    await databaseConnection.executeQuery('SELECT 1'); // Check database connection

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
};

initializeServer();