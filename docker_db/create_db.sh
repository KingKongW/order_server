
docker ps -a 

docker stop order_db

docker rm order_db

docker run -d -p 254:3306 --restart=always --network order_network --name order_db -v $PWD/docker_db/sql:/docker-entrypoint-initdb.d -e TZ="Asia/Shanghai" -e MYSQL_DATABASE="order" -e MYSQL_ROOT_PASSWORD="123"  mysql --init-connect='SET NAMES utf8' --character-set-server=utf8 --collation-server=utf8_general_ci --explicit_defaults_for_timestamp=1

