import {baseName} from "./index.js"

export const swaggeroptions = {
    swaggerDefinition: {
        openapi: '3.0.1',
        info: {
            title: 'API',
            version: '1.0.0',
            description: 'API description'
        }
    },
    apis: [baseName+'/docs/**/*.yaml']
}