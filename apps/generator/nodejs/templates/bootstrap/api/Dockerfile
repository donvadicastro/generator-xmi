FROM node:11

# Copy app source
COPY ./dist .
COPY ./ormconfig.json .

RUN npm install
#RUN npm install pm2@latest -g

ENV NODE_ENV production
EXPOSE 3000

#CMD [ "pm2", "start", "api/server/index.js", "--no-daemon" ]
CMD [ "node", "api/server/index.js" ]
