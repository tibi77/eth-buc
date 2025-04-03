import { RequestModule } from './request/request.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthenticationModule } from './authentication/authentication.module';

import { UserModule } from './users/user.module';
import { mongoConfig } from './database/config/database.config';

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'public'),
        }),
        MongooseModule.forRoot(mongoConfig.url),
        UserModule,
        RequestModule,
        AuthenticationModule,
        ScheduleModule.forRoot(),
    ]
})
export class AppModule { }
