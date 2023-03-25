FROM node:16-alpine As development

#Specify a working directory
WORKDIR /app/api-gateway

#Copy the dependencies file
COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:16-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app/api-gateway

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=development /app/api-gateway/dist ./dist

CMD ["node", "dist/main"]