FROM node:16

# Copy app source
COPY ./dist ./api
COPY ./ormconfig.json ./api
COPY ./node_modules ./api

ENV NODE_ENV production
EXPOSE 3000

WORKDIR api
CMD [ "node", "api/server/index.js" ]
