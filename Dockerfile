# Base image
FROM node:18

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install && npm install -g pm2

# Bundle app source
COPY . .

# Copy the .env and .env.development files
COPY .env ./

# Creates a "dist" folder with the production build
RUN npm run build

# Expose the port on which the app will run
EXPOSE 3000

# RUN -d -p 3306:3306 --name gaboot-cms -e MYSQL_ROOT_PASSWORD= MYSQL_DATABASE=gaboot -e MYSQL_USER=root -e MYSQL_PASSWORD= mysql/mysql-server:latest

# Start the server using the production build
RUN pm2 start dist/main.js