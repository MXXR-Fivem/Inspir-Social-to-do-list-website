# On part de l'image de NodeJS v18 (en gros a peu près la dernière version)
FROM node:20.9.0

# Creer le dossier de travail
WORKDIR /app

# Copie les fichiers nécessaires pour installer les dependances
COPY frontend/package*.json ./

# Installe les dependances
RUN npm install

# Copie le fichier .env pour les variables d'environnement
COPY .env .env

# Copie tout le code source du frontend
COPY frontend/ .

# Build l'application Next.js pour la prod
# RUN npm run build

# next js port 3000 (http://localhost:3000)
EXPOSE 3000

# Lance le serveur en mode production
# CMD ["npm", "start"]

# Mode dev
CMD ["npm", "run", "dev"]