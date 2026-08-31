import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDB } from './config/database';

const PORT = Number(process.env.PORT || 3000);

/**
 * Función principal para inicializar la base de datos y levantar el servidor
 */
const startServer = async (): Promise<void> => {
  try {
    // Conectar y sincronizar la base de datos
    await connectDB();

    app.listen(PORT, () => {
      console.log(` Servidor ejecutándose exitosamente en el puerto ${PORT}`);
      console.log(` URL base: http://localhost:${PORT}/api/v1`);
      console.log(` Healthcheck: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error(' Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();
