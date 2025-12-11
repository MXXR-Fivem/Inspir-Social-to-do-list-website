FROM node:18

WORKDIR /docker-express

# Copier d'abord package.json pour profiter du cache Docker
COPY ./backend/package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code
COPY ./backend .

# Utiliser nodemon pour le hot reload
CMD [ "npm", "run", "dev" ]

EXPOSE 80