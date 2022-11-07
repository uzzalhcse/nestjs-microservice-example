FROM node:14-alpine As development

#Specify a working directory
WORKDIR /app/client

#Copy the dependencies file
COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]