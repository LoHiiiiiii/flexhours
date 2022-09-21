#!/usr/bin/env bash
FILE_PATH="$(cd "$(dirname "$1")"; pwd -P)/$(basename "$1")"server/open-api/swagger.yaml
docker stop flex-hours-swagger
docker rm flex-hours-swagger
docker run -d --name flex-hours-swagger -p 5000:8080 -v $FILE_PATH:/swagger.yaml -e SWAGGER_JSON=/swagger.yaml swaggerapi/swagger-ui
echo "swagger is running in http://localhost:5000"