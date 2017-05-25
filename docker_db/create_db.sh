
docker ps -a 

docker stop user_center_db

docker rm user_center_db

docker run -d -p 254:3306 --restart=always --network ota_network --name user_center_db -v /etc/localtime:/etc/localtime -v $PWD/docker_db/sql:/docker-entrypoint-initdb.d -e TZ="Asia/Shanghai" -e MYSQL_DATABASE="user_center" -e MYSQL_ROOT_PASSWORD="123"  mysql --init-connect='SET NAMES utf8' --character-set-server=utf8 --collation-server=utf8_general_ci --explicit_defaults_for_timestamp=1

