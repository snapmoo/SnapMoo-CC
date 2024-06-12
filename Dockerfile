# Gunakan Node.js sebagai base image
FROM node:20-alpine

# Set working directory
WORKDIR /src/app

# Salin package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin sisa kode aplikasi
COPY . .

# Expose port yang digunakan oleh aplikasi
EXPOSE 8080
# Menjalankan aplikasi
CMD ["node", "index.js"]
