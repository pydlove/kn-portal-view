FROM cnmicbase.azurecr.cn/pipeline/nginx:1.27.2

ADD conf/mime.types  /app/
ADD conf/nginx.conf /app/nginx.conf
COPY dist/ /app/nginx/html/

USER root

CMD [ "/usr/sbin/nginx","-g","daemon off;","-c", "/app/nginx.conf"]