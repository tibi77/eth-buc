/* eslint-disable @darraghor/nestjs-typed/api-property-returning-array-should-set-array */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// create-request.dto.ts
export class RecurrenceDto {
    @ApiProperty({
        description: 'The start date of the invoice',
        format: 'date-time',
        example: '2025-01-01T00:00:00.000Z'
    })
    startDate: string;

    @ApiProperty({
        description: 'The frequency of the invoice',
        enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'],
        example: 'DAILY'
    })
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
}

export class CreateRequestDto {
    @ApiPropertyOptional({
        description: 'The wallet address of the payer',
        example: '0x1234567890abcdef1234567890abcdef12345678'
    })
    payer?: string;

    @ApiProperty({
        description: 'The wallet address of the payee',
        example: '0x6923831ACf5c327260D7ac7C9DfF5b1c3cB3C7D7'
    })
    payee: string;

    @ApiProperty({
        description: 'The payable amount of the invoice, in human readable format',
        example: '10'
    })
    amount: string;

    @ApiProperty({
        description: 'Invoice Currency ID, from the Request Network Token List',
        example: 'USD'
    })
    invoiceCurrency: string;

    @ApiProperty({
        description: 'Payment currency ID, from the Request Network Token List',
        example: 'ETH-sepolia-sepolia'
    })
    paymentCurrency: string;

    @ApiPropertyOptional({
        description: 'The recurrence of the invoice',
        type: RecurrenceDto
    })
    recurrence?: RecurrenceDto;
}

// request-response.dto.ts
export class RequestResponseDto {
    @ApiProperty({
        description: 'Unique identifier of the request, commonly used to look up a request in Request Scan',
        example: '01e273ecc29d4b526df3a0f1f05ffc59372af8752c2b678096e49ac270416a7cdb'
    })
    requestID: string;

    @ApiProperty({
        description: 'Unique identifier of the request, used to pay the request as well as check the status of the request',
        example: '0xb3581f0b0f74cc61'
    })
    paymentReference: string;
}

// request-status.dto.ts
export class RequestStatusDto {
    @ApiProperty({
        description: 'Whether the request has been paid or not',
        example: false
    })
    hasBeenPaid: boolean;

    @ApiProperty({
        description: 'The payment reference of the request',
        example: '0xb3581f0b0f74cc61'
    })
    paymentReference: string;

    @ApiProperty({
        description: 'The request ID of the request',
        example: '01e273ecc29d4b526df3a0f1f05ffc59372af8752c2b678096e49ac270416a7cdb'
    })
    requestId: string;

    @ApiProperty({
        description: 'Whether the request is listening for a payment',
        example: false
    })
    isListening: boolean;

    @ApiProperty({
        description: 'The transaction hash of the payment',
        example: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        nullable: true
    })
    txHash: string | null;
}

// payment-calldata.dto.ts
export class BigNumberDto {
    @ApiProperty({
        description: 'Type of BigNumber',
        example: 'BigNumber'
    })
    type: string;

    @ApiProperty({
        description: 'Payment amount in EVM-compatible format, encoded in hex',
        example: '0x038d7ea4c68000'
    })
    hex: string;
}

export class TransactionDto {
    @ApiProperty({
        description: 'Transaction calldata',
        example: '0xb868980b...00'
    })
    data: string;

    @ApiProperty({
        description: 'Target contract address',
        example: '0x11BF2fDA23bF0A98365e1A4e04A87C9339e8687'
    })
    to: string;

    @ApiProperty({
        description: 'Payment amount',
        type: BigNumberDto,
        nullable: true
    })
    value: BigNumberDto | number;
}

export class PaymentMetadataDto {
    @ApiProperty({
        description: 'The number of transactions required to pay the request',
        example: 1
    })
    stepsRequired: number;

    @ApiProperty({
        description: 'Whether the payment requires approval of the token',
        example: false
    })
    needsApproval: boolean;

    @ApiProperty({
        description: 'The index of the approval transaction',
        example: null,
        nullable: true
    })
    approvalTransactionIndex: number | null;
}

export class PaymentCalldataDto {
    @ApiProperty({
        description: 'The transactions needed to pay the request',
        type: [TransactionDto],
    })
    transactions: TransactionDto[];

    @ApiProperty({
        description: 'Metadata about the payment',
        type: PaymentMetadataDto
    })
    metadata: PaymentMetadataDto;
}

// pay-request.dto.ts
export class PayRequestDto {
    @ApiProperty({
        description: 'The wallet address of the payee',
        example: '0x6923831ACf5c327260D7ac7C9DfF5b1c3cB3C7D7'
    })
    payee: string;

    @ApiProperty({
        description: 'The payable amount of the invoice, in human readable format',
        example: '10'
    })
    amount: string;

    @ApiProperty({
        description: 'Invoice Currency ID, from the Request Network Token List',
        example: 'USD'
    })
    invoiceCurrency: string;

    @ApiProperty({
        description: 'Payment currency ID, from the Request Network Token List',
        example: 'ETH-sepolia-sepolia'
    })
    paymentCurrency: string;
}

// pay-response.dto.ts
export class PayResponseDto {
    @ApiProperty({
        description: 'Unique identifier of the request, commonly used to look up a request in Request Scan',
        example: '01e273ecc29d4b526df3a0f1f05ffc59372af8752c2b678096e49ac270416a7cdb'
    })
    requestID: string;

    @ApiProperty({
        description: 'Unique identifier of the request, used to pay the request as well as check the status of the request',
        example: '0xb3581f0b0f74cc61'
    })
    paymentReference: string;

    @ApiProperty({
        description: 'The transactions needed to pay the request',
        type: [TransactionDto],
    })
    transactions: TransactionDto[];

    @ApiProperty({
        description: 'Metadata about the payment',
        type: PaymentMetadataDto
    })
    metadata: PaymentMetadataDto;
}