FROM node:17 AS builder

RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

WORKDIR /usr/web/

COPY package.json \
     pnpm-lock.yaml \
     craco.config.js \
     tsconfig.json \
     tsconfig.paths.json \
     .eslintrc.json \
     /usr/web/

COPY public/ /usr/web/public/
COPY src/ /usr/web/src/

RUN pnpm install -P --frozen-lockfile
RUN pnpm build


FROM alpine:edge

RUN apk update \
    && apk add lighttpd \
    && rm -rf /var/cache/apk/*

COPY --from=builder /usr/web/build/ /var/www/localhost/htdocs/

COPY ./env.sh .
COPY ./.env .
COPY ./entrypoint.sh .

RUN chmod +x ./env.sh

# make entrypoint executable
RUN chmod +x entrypoint.sh

EXPOSE 80

# excute the entrypoint.sh file
ENTRYPOINT ["./entrypoint.sh"]
