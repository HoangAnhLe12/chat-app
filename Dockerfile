# Sử dụng node:alpine làm base image
FROM node:alpine

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép package.json và package-lock.json vào thư mục làm việc
COPY package.json package-lock.json ./

# Cài đặt dependencies
RUN npm install --production

# Sao chép tất cả các file trong thư mục dự án vào thư mục làm việc
COPY . .

# Build ứng dụng Next.js
RUN npm run build

# Thiết lập biến môi trường
ENV NODE_ENV production

# Mở cổng 3000 (hoặc cổng bạn muốn sử dụng)
EXPOSE 3000

# Khởi chạy ứng dụng Next.js
CMD ["npm", "start"]
