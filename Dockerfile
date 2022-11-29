# 安装alpine系统 3.13
FROM alpine:latest

# 使用 HTTPS 协议访问容器云调用证书安装
RUN apk add ca-certificates

# 选用国内镜像源以提高下载速度
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.tencent.com/g' /etc/apk/repositories && apk add --update --no-cache nodejs npm

# # 指定工作目录
WORKDIR /app

# 拷贝包管理文件
COPY package*.json /app/

# npm 源，选用国内镜像源以提高下载速度
RUN npm config set registry https://mirrors.cloud.tencent.com/npm/

# npm 安装依赖
RUN npm install

# 将当前目录下所有文件都拷贝到工作目录下
COPY . /app

# 执行服务器
CMD ["npm", "start"]
