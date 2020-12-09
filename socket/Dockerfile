FROM node:13.12.0-alpine
RUN apk update && apk upgrade && apk add --no-cache bash git openssh gcc libc-dev
WORKDIR /app
COPY source/package.json .
COPY source/package-lock.json .
RUN npm install --silent
COPY source/ .
EXPOSE 8081 
CMD ["node", "index.js"]
