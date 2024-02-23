FROM node:18

WORKDIR /user/src/app
COPY . .


RUN yarn install


CMD npm run serve