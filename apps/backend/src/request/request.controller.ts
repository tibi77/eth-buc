/* eslint-disable @darraghor/nestjs-typed/api-method-should-specify-api-response */
// request.controller.ts
import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Patch,
} from '@nestjs/common';
import {
    ApiTags,
} from '@nestjs/swagger';
import { RequestService } from "./request.service"
import {
    CreateRequestDto,
    RequestResponseDto,
    RequestStatusDto,
    PaymentCalldataDto,
    PayRequestDto,
    PayResponseDto
} from "./requst.dto"

@ApiTags('Request')
@Controller('v1')
export class RequestController {
    constructor(private readonly requestService: RequestService) { }

    @Post('request')
    async createRequest(
        @Body() createRequestDto: CreateRequestDto
    ): Promise<RequestResponseDto> {
        return this.requestService.createRequest(createRequestDto);
    }

    @Get('request/:paymentReference')
    async getRequestStatus(
        @Param('paymentReference') paymentReference: string
    ): Promise<RequestStatusDto> {
        return this.requestService.getRequestStatus(paymentReference);
    }

    @Patch('request/:paymentReference/stop-recurrence')
    async stopRecurrenceRequest(
        @Param('paymentReference') paymentReference: string
    ): Promise<void> {
        return this.requestService.stopRecurrenceRequest(paymentReference);
    }

    @Get('request/:paymentReference/pay')
    async getPaymentCalldata(
        @Param('paymentReference') paymentReference: string
    ): Promise<PaymentCalldataDto> {
        return this.requestService.getPaymentCalldata(paymentReference);
    }

    @Post('pay')
    async payRequest(
        @Body() payRequestDto: PayRequestDto
    ): Promise<PayResponseDto> {
        return this.requestService.payRequest(payRequestDto);
    }
}