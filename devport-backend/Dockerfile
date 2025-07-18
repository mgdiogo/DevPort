FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install && \
	npm install bcrypt && \
	npm install passport && \
	npm install passport-jwt && \ 
	npm install passport-local && \
	npm install @nestjs/jwt && \
	npm install @nestjs/passport && \
	npm install cookie-parser && \
	npm install uuid

COPY . .

RUN npx prisma generate && npm run build

EXPOSE 3000
CMD ["node", "dist/src/main"]
