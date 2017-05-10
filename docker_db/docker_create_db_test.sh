docker ps -a 

docker stop user_center_db_test

docker rm user_center_db_test -f

docker network rm user_center_network

docker network create user_center_network

docker run -d -p 7204:3306 --restart=always --network user_center_network --name user_center_db_test -v /etc/localtime:/etc/localtime -v $PWD/docker_db/sql:/docker-entrypoint-initdb.d -e TZ="Asia/Shanghai" -e MYSQL_DATABASE="user_center" -e MYSQL_ROOT_PASSWORD="123"  mysql --init-connect='SET NAMES utf8' --character-set-server=utf8 --collation-server=utf8_general_ci --explicit_defaults_for_timestamp=1