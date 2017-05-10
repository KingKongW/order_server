tslint "./src/**/*.ts" -e "./src/node_modules/**" -e "./src/bin/**"
tsc
mocha bin/test/index.js