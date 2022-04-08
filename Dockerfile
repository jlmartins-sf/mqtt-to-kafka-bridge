FROM node:17.8.0 AS build
WORKDIR /app
COPY package*.json ./
RUN ["npm", "install"]
COPY . .
EXPOSE 3967
ENTRYPOINT ["npm", "start"]
