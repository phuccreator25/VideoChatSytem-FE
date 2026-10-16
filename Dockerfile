# BUILD REACT + TS trước 
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# RUN PRODUCTION
FROM nginx:alpine AS runner

# Xóa file html mặc định của nginx 
RUN rm -rf /usr/share/nginx/html/*

# đưa code đã build vào nginx 
COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]