import { RequestController } from './request.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Invoices, InvoiceSchema } from './request.entry';

@Module({
    imports: [MongooseModule.forFeature([
        {
            name: Invoices.name,
            schema: InvoiceSchema,
        },])],
    controllers: [RequestController,],
    providers: [RequestService],
})
export class RequestModule { }
