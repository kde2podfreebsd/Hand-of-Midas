ARG WORK_DIR=/opt/app

FROM node:20.18-alpine3.19 AS build

ARG WORK_DIR
WORKDIR $WORK_DIR

COPY ./package.json ./yarn.lock ./tsconfig.json ./tsconfig.build.json ./nest-cli.json ./
COPY ./ruscamp-contracts ./ruscamp-contracts
COPY ./src ./src
COPY ./prisma ./prisma

RUN yarn

RUN yarn prisma:generate
RUN yarn build

# remove devDependencies
RUN rm -rf node_modules
RUN yarn cache clean
RUN yarn install --production

FROM node:20.18-alpine3.19 AS runner

ARG WORK_DIR
WORKDIR $WORK_DIR

ENV NODE_ENV=test

# COPY BACK
COPY --from=build --chown=node:node $WORK_DIR/package.json         $WORK_DIR/package.json
COPY --from=build --chown=node:node $WORK_DIR/tsconfig.json        $WORK_DIR/tsconfig.json
COPY --from=build --chown=node:node $WORK_DIR/dist                 $WORK_DIR/dist
COPY --from=build --chown=node:node $WORK_DIR/node_modules         $WORK_DIR/node_modules
COPY --from=build --chown=node:node $WORK_DIR/prisma               $WORK_DIR/prisma

EXPOSE 3040
USER node

CMD ["/bin/sh", "-c", "npm run migrate:prod && npm run build:start"]
