FROM node:13.12.0-alpine
RUN apk update && apk upgrade && apk add --no-cache bash git openssh gcc libc-dev
WORKDIR /app
COPY source/package.json .
COPY source/package-lock.json .
RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent
COPY source/ .
EXPOSE 3000 
CMD ["npm", "start"]
