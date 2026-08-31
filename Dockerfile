# Etapa base con Node.js v20 en Alpine Linux
FROM node:20-alpine

# Definición del directorio de trabajo
WORKDIR /app

# Copia de archivos de dependencias y configuración
COPY package*.json ./
COPY tsconfig.json ./

# Instalación de dependencias
RUN npm install

# Copia del código fuente y recursos
COPY src/ ./src
COPY uploads/ ./uploads

# Compilación del proyecto TypeScript a JavaScript
RUN npm run build

# Exposición del puerto de la aplicación
EXPOSE 3000

# Variables de entorno por defecto
ENV NODE_ENV=production

# Comando para ejecutar la aplicación compilada
CMD ["npm", "start"]
