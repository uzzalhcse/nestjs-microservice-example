FROM node:16-alpine As development

#Specify a working directory
WORKDIR /app/user-service

#Copy the dependencies file
COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app/user-service

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /app/user-service/dist ./dist

CMD ["node", "dist/main"]