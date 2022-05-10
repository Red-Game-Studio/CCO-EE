@echo off

set CCO_buildType=vanilla_client

call tsc lib.ts --target es2022
call coffee -c main.coffee
type lib.js > ..\..\Build\%CCO_buildType%.js
type main.js >> ..\..\Build\%CCO_buildType%.js
del lib.js
del main.js