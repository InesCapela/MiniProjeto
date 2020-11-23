FROM node:alpine

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh gcc libc-dev

WORKDIR /app

COPY src/package.json .

RUN yarn install

COPY src/ .

CMD ["yarn", "run", "start"]


