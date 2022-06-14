FROM node:16
WORKDIR api

# Copy app source
COPY . .

#RUN npm install
#RUN npm install pm2@latest -g

ENV NODE_ENV production
EXPOSE 3000

RUN npm run api:compile

#CMD [ "pm2", "start", "api/server/index.js", "--no-daemon" ]
CMD [ "node", "api/server/index.js" ]
