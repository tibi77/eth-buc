import { RequestController } from './request.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { RequestService } from './request.service';

@Module({
    imports: [RequestService],
    controllers: [RequestController,],
    providers: [RequestService],
})
export class RequestModule { }
