# This is a dockfile for secmonitor_server_img
FROM  node

#  Commands when make image
RUN npm config set registry=http://registry.npm.taobao.org
RUN cd /home

COPY ./src /home
WORKDIR /home

RUN cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN npm install typescript -g
RUN npm install mocha -g
RUN npm install node-gyp -g
RUN npm install
# for mac  
# RUN npm rebuild

EXPOSE 7202

# Commands when container start 
RUN tsc 
CMD node /home/bin/app.js