FROM node:16-alpine3.16 As development

#Specify a working directory
WORKDIR /app/order-service

#Copy the dependencies file
COPY package*.json ./

RUN npm install

COPY . .


RUN npx prisma generate

RUN npm run build

FROM node:16-alpine3.16 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app/order-service

COPY package*.json ./

RUN npm install --only=production

COPY . .

RUN npm i -g prisma
RUN npx prisma generate

COPY --from=development /app/order-service/dist ./dist

CMD ["node", "dist/main"]