FROM node:18

# Crie e defina o diretório de trabalho
WORKDIR /app

# Instale o NestJS CLI globalmente
RUN npm install -g @nestjs/cli

# Copie os arquivos de dependências
COPY package*.json ./

# Instale as dependências
RUN npm install
RUN npm install @prisma/client@latest

# Copie o diretório prisma e o restante do código da aplicação
COPY prisma ./prisma
COPY . .

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

# Execute as migrações do Prisma
RUN npx prisma migrate deploy

# Gere o Prisma Client
RUN npx prisma generate

# Compile a aplicação NestJS
RUN npm run build

# Exponha a porta que a aplicação irá utilizar
EXPOSE 3333

# Defina o comando para iniciar a aplicação
CMD ["npm", "run", "start:prod"]