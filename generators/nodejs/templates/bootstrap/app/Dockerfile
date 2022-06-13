FROM node:16

# Copy app source
COPY . .

RUN npm install

ENV NODE_ENV production
EXPOSE 4200

RUN npm run app:build

CMD [ "npm", "run", "app:start" ]
