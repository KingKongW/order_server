tslint "./src/**/*.ts" -e "./src/node_modules/**" -e "./src/node_modules/@types/**" -e "./src/bin/**"
tsc
node bin/app.js