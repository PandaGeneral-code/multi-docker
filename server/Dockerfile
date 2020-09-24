FROM node:alpine
WORKDIR "/app"
COPY ./package.json ./
RUN npm intall
COPY ./ ./
CMD ["npm", "run", "start"]