SWAGGER_FILE=http://localhost:3300/docs-json
npx @openapitools/openapi-generator-cli generate -i $SWAGGER_FILE -g typescript-axios -o src/api/generated --skip-validate-spec

replace="import type { AxiosPromise, AxiosInstance, RawAxiosRequestConfig } from 'axios';"
replacewith="import type { AxiosPromise, AxiosInstance, AxiosRequestConfig as RawAxiosRequestConfig } from 'axios';"
sed "s/$replace/$replacewith/g" src/api/generated/api.ts > src/api/generated/api.ts.tmp && mv src/api/generated/api.ts.tmp src/api/generated/api.ts

replace="export const BASE_PATH = \"http://localhost\".replace(/\/+$/, \"\");"
replacewith="export const BASE_PATH = process.env.NODE_ENV !== 'production'?\"http://localhost:3300\":\"https://chvalotce.cz/api\";"
sed "s|${replace//\//\\/}|${replacewith//\//\\/}|g" src/api/generated/base.ts > src/api/generated/base.ts.tmp && mv src/api/generated/base.ts.tmp src/api/generated/base.ts
