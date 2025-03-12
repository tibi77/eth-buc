import { patchNestjsSwagger, ZodValidationPipe } from '@anatine/zod-nestjs';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import * as fs from 'fs';
import * as path from 'path';
import metadata from '../metadata';
import { AppModule } from './app.module';

let projectRootPath = process.env.PROJECT_ROOT_PATH ?? null;

function pathContainFile(
    startPathTokens: string[],
    file: string
): string | null {
    const currentPath = startPathTokens.join(path.sep);
    const currentFile = path.join(currentPath, file);
    if (fs.existsSync(currentFile)) {
        return currentPath;
    }
    if (startPathTokens.length === 0) {
        return null;
    }
    startPathTokens.pop();
    return pathContainFile(startPathTokens, file);
}


function adjustSwaggerSchemas(document: OpenAPIObject) {
    const schemas = document.components?.schemas;
    const objectIdSchema = schemas?.ObjectId;
    if (objectIdSchema) {
        // ObjectId is automatically transformed to a string
        schemas!.ObjectId = {
            type: 'string',
            example: '5f2e6f5f8b0e3b1b3c1f3b1e'
        };
    }
    return document;
}

export function getMonoRepoRootPath() {
    const pathTokens = __dirname.split(path.sep);
    const monoRepoRoot = pathContainFile(pathTokens, 'pnpm-workspace.yaml');
    if (monoRepoRoot) {
        return monoRepoRoot;
    }
    throw new Error('Could not find monorepo root path.');
}

export function getProjectRootPath() {
    if (projectRootPath) {
        return projectRootPath;
    }
    const monoRepoRoot = getMonoRepoRootPath();
    if (monoRepoRoot) {
        const bePath = path.join(monoRepoRoot, 'apps', 'backend');
        projectRootPath = bePath;
        return bePath;
    }
    throw new Error('Could not find project root path for the backend project.');
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const config = new DocumentBuilder()
        .setTitle('bookIt')
        .setDescription('The bookIt API')
        .setVersion('1.0')
        .addTag('bookIt')
        .build();
    patchNestjsSwagger();

    await SwaggerModule.loadPluginMetadata(metadata);
    patchNestjsSwagger();
    let document = SwaggerModule.createDocument(app, config);
    document = adjustSwaggerSchemas(document);

    if (process.env.NODE_ENV === 'development') {
        SwaggerModule.setup('api', app, document, {
            // TODO: Turn off if we ever stop having large responses
            swaggerOptions: { syntaxHighlight: { activated: false } }
        });
    }
    if (process.env.NODE_ENV === 'development') {
        fs.promises
            .writeFile(
                path.join(
                    getProjectRootPath(),
                    '..',
                    'frontend',
                    'src',
                    'api-openapi-spec.json'
                ),
                JSON.stringify(document)
            )
            .catch((error) => {
                console.error(
                    'Failed to write OpenAPI spec to file in the frontend src directory',
                    error
                );
            });
        const projectRootPath = path.join(__dirname, '..', '..', 'frontend', 'src');
        const openApiSpecPath = path.join(projectRootPath, 'api-openapi-spec.json');

        fs.promises
            .writeFile(openApiSpecPath, JSON.stringify(document))
            .catch((error) => {
                console.error('Failed to write OpenAPI spec to file in the frontend src directory', error);
            });
    }
    app.useGlobalPipes(new ZodValidationPipe(
        {
            // whitelist: true, // Remove non-whitelisted properties
            // forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
            // transformOptions: {
            //     enableImplicitConversion: true
            // },
            // validationError: {
            //     target: true,
            //     value: false
            // },
            // skipMissingProperties: false,
            // dismissDefaultMessages: false,
            // errorHttpStatusCode: 400
        }
    ));
    app.use(session({
        secret: process.env.SESSION_SECRET ?? "secret",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.DB_URL,
            collectionName: 'sessions',
        }),
        cookie: {
            secure: process.env.NODE_ENV !== 'development',
            maxAge: 24 * 60 * 60 * 1000, //24hrs,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        }
    }));
    app.enableCors();
    fs.promises
        .writeFile(
            path.join(
                getProjectRootPath(),
                '..',
                'frontend',
                'src',
                'api-openapi-spec.json'
            ),
            JSON.stringify(document)
        )
        .catch((error) => {
            console.error(
                'Failed to write OpenAPI spec to file in the frontend src directory',
                error
            );
        });
    await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
