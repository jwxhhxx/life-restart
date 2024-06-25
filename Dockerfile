# 使用官方的 Node.js 镜像作为基础镜像
FROM node:16

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json（如果有）
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制项目文件
COPY . .

# 构建 React 应用
RUN npm run build

# 使用 Nginx 作为静态文件服务器
FROM nginx:alpine

# 复制自定义 Nginx 配置文件
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=0 /app/build /usr/share/nginx/html

# 暴露端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
