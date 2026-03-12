# 1. Usar una imagen de Node.js ligera
FROM node:22-alpine

# 2. Directorio de trabajo dentro del contenedor
WORKDIR /frontend

# 3. Copiar archivos de dependencias primero (optimiza caché)
COPY package*.json ./

# 4. Instalar dependencias
RUN npm install

# 5. Copiar el resto del código
COPY . .

# 6. Exponer el puerto por defecto de Angular
EXPOSE 4200

# 7. Comando para iniciar con hot reload y permitir conexiones externas
CMD ["npm", "run", "start", "--", "--host", "0.0.0.0"]