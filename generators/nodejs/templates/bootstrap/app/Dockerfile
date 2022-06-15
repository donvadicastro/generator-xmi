FROM nginx:1.17.1-alpine

COPY app/nginx.conf /etc/nginx/nginx.conf
COPY dist/app_compiled /usr/share/nginx/html

EXPOSE 80
