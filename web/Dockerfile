FROM node:22

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install --frozen-lockfile

# Копируем исходный код проекта
COPY . .

# Строим проект
RUN npm run build

# Запускаем сервер
CMD ["npm", "run", "preview"]
