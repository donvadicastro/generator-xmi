FROM node:16

# Copy app source
COPY ./dist .
COPY ./ormconfig.json .
COPY ./node_modules ./node_modules

ENV NODE_ENV production
EXPOSE 3000

CMD [ "node", "api/server/index.js" ]
