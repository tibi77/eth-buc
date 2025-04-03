// request.controller.ts
import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Patch,
    Headers,
    HttpCode,
    HttpStatus
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiParam,
    ApiHeader,
    ApiUnauthorizedResponse,
    ApiNotFoundResponse,
    ApiTooManyRequestsResponse,
    ApiOkResponse,
    ApiCreatedResponse
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
    @ApiOperation({ summary: 'Create a new request', description: 'Create a new payment request' })
    @ApiHeader({ name: 'x-api-key', description: 'API key for authentication', required: true })
    @ApiCreatedResponse({
        description: 'Request created successfully',
        type: RequestResponseDto
    })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiNotFoundResponse({ description: 'Wallet not found' })
    @ApiTooManyRequestsResponse({ description: 'Too Many Requests' })
    async createRequest(
        @Headers('x-api-key') apiKey: string,
        @Body() createRequestDto: CreateRequestDto
    ): Promise<RequestResponseDto> {
        return this.requestService.createRequest(createRequestDto);
    }

    @Get('request/:paymentReference')
    @ApiOperation({ summary: 'Get request status', description: 'Get the status of a payment request' })
    @ApiParam({ name: 'paymentReference', description: 'The payment reference of the request', example: '0xb3581f0b0f74cc61' })
    @ApiHeader({ name: 'x-api-key', description: 'API key for authentication', required: true })
    @ApiOkResponse({
        description: 'Request status retrieved successfully',
        type: RequestStatusDto
    })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiNotFoundResponse({ description: 'Request not found' })
    @ApiTooManyRequestsResponse({ description: 'Too Many Requests' })
    async getRequestStatus(
        @Headers('x-api-key') apiKey: string,
        @Param('paymentReference') paymentReference: string
    ): Promise<RequestStatusDto> {
        return this.requestService.getRequestStatus(paymentReference);
    }

    @Patch('request/:paymentReference/stop-recurrence')
    @ApiOperation({ summary: 'Stop a recurring request', description: 'Stop a recurring request' })
    @ApiParam({ name: 'paymentReference', description: 'The payment reference of the request', example: '0xb3581f0b0f74cc61' })
    @ApiHeader({ name: 'x-api-key', description: 'API key for authentication', required: true })
    @ApiOkResponse({ description: 'Recurrence stopped successfully' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiNotFoundResponse({ description: 'Request not found' })
    @ApiTooManyRequestsResponse({ description: 'Too Many Requests' })
    @HttpCode(HttpStatus.OK)
    async stopRecurrenceRequest(
        @Headers('x-api-key') apiKey: string,
        @Param('paymentReference') paymentReference: string
    ): Promise<void> {
        return this.requestService.stopRecurrenceRequest(paymentReference);
    }

    @Get('request/:paymentReference/pay')
    @ApiOperation({
        summary: 'Get payment calldata',
        description: 'Get the calldata needed to pay a request. Returns different transaction structures for native currency vs ERC20 token payments.'
    })
    @ApiParam({ name: 'paymentReference', description: 'The payment reference of the request', example: '0xb3581f0b0f74cc61' })
    @ApiHeader({ name: 'x-api-key', description: 'API key for authentication', required: true })
    @ApiOkResponse({
        description: 'Payment calldata retrieved successfully',
        type: PaymentCalldataDto
    })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiNotFoundResponse({ description: 'Request not found' })
    @ApiTooManyRequestsResponse({ description: 'Too Many Requests' })
    async getPaymentCalldata(
        @Headers('x-api-key') apiKey: string,
        @Param('paymentReference') paymentReference: string
    ): Promise<PaymentCalldataDto> {
        return this.requestService.getPaymentCalldata(paymentReference);
    }

    @Post('pay')
    @ApiOperation({ summary: 'Initiate a payment', description: 'Initiate a payment without having to create a request first' })
    @ApiHeader({ name: 'x-api-key', description: 'API key for authentication', required: true })
    @ApiCreatedResponse({
        description: 'Request created and payment initiated successfully',
        type: PayResponseDto
    })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @ApiNotFoundResponse({ description: 'Wallet not found' })
    @ApiTooManyRequestsResponse({ description: 'Too Many Requests' })
    async payRequest(
        @Headers('x-api-key') apiKey: string,
        @Body() payRequestDto: PayRequestDto
    ): Promise<PayResponseDto> {
        return this.requestService.payRequest(payRequestDto);
    }
}