# Используем официальный образ Node.js в качестве базового образа
# В данном случае выбрана версия 18 с минимальным окружением
FROM node:18-alpine AS builder

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем package.json и yarn.lock для установки зависимостей
COPY package.json yarn.lock ./

# Устанавливаем зависимости
RUN yarn install --frozen-lockfile

# Копируем весь код приложения
COPY . ./

# Собираем приложение Next.js
RUN yarn build

# Убираем devDependencies для уменьшения размера конечного образа
RUN yarn install --production --frozen-lockfile

# Используем минимальный Node.js образ для запуска
FROM node:18-alpine AS runner

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем собранное приложение и production-зависимости из builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Устанавливаем переменные окружения для Next.js
ENV NODE_ENV=production
ENV PORT=3000

# Открываем порт для приложения
EXPOSE 3000

# Запускаем приложение
CMD ["yarn", "start"]
