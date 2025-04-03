// request.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import {
    CreateRequestDto,
    RequestResponseDto,
    RequestStatusDto,
    PaymentCalldataDto,
    PayRequestDto,
    PayResponseDto
} from "./requst.dto"

@Injectable()
export class RequestService {
    /**
     * Creates a new payment request
     * @param createRequestDto Request details
     * @returns The created request information
     */
    async createRequest(_createRequestDto: CreateRequestDto): Promise<RequestResponseDto> {
        // Implementation would connect to the Request Network API
        return {
            requestID: '01e273ecc29d4b526df3a0f1f05ffc59372af8752c2b678096e49ac270416a7cdb',
            paymentReference: '0xb3581f0b0f74cc61'
        };
    }

    /**
     * Gets the status of a payment request
     * @param paymentReference The payment reference of the request
     * @returns The status of the request
     */
    async getRequestStatus(paymentReference: string): Promise<RequestStatusDto> {
        // Implementation would connect to the Request Network API
        // Check if request exists
        if (!this.requestExists(paymentReference)) {
            throw new NotFoundException(`Request with payment reference ${paymentReference} not found`);
        }

        return {
            hasBeenPaid: false,
            paymentReference,
            requestId: '01e273ecc29d4b526df3a0f1f05ffc59372af8752c2b678096e49ac270416a7cdb',
            isListening: false,
            txHash: null
        };
    }

    /**
     * Stops a recurring request
     * @param paymentReference The payment reference of the request
     */
    async stopRecurrenceRequest(paymentReference: string): Promise<void> {
        // Implementation would connect to the Request Network API
        // Check if request exists
        if (!this.requestExists(paymentReference)) {
            throw new NotFoundException(`Request with payment reference ${paymentReference} not found`);
        }

        // Logic to stop recurrence
        return;
    }

    /**
     * Gets the calldata needed to pay a request
     * @param paymentReference The payment reference of the request
     * @returns The calldata for payment
     */
    async getPaymentCalldata(paymentReference: string): Promise<PaymentCalldataDto> {
        // Implementation would connect to the Request Network API
        // Check if request exists
        if (!this.requestExists(paymentReference)) {
            throw new NotFoundException(`Request with payment reference ${paymentReference} not found`);
        }

        return {
            transactions: [
                {
                    data: '0xb868980b...00',
                    to: '0x11BF2fDA23bF0A98365e1A4e04A87C9339e8687',
                    value: {
                        type: 'BigNumber',
                        hex: '0x038d7ea4c68000'
                    }
                }
            ],
            metadata: {
                stepsRequired: 1,
                needsApproval: false,
                approvalTransactionIndex: null
            }
        };
    }

    /**
     * Initiates a payment without having to create a request first
     * @param payRequestDto Payment details
     * @returns Created request and payment information
     */
    async payRequest(_payRequestDto: PayRequestDto): Promise<PayResponseDto> {
        // Implementation would connect to the Request Network API
        return {
            requestID: '01e273ecc29d4b526df3a0f1f05ffc59372af8752c2b678096e49ac270416a7cdb',
            paymentReference: '0xb3581f0b0f74cc61',
            transactions: [
                {
                    data: '0xb868980b...00',
                    to: '0x11BF2fDA23bF0A98365e1A4e04A87C9339e8687',
                    value: {
                        type: 'BigNumber',
                        hex: '0x038d7ea4c68000'
                    }
                }
            ],
            metadata: {
                stepsRequired: 1,
                needsApproval: false,
                approvalTransactionIndex: null
            }
        };
    }

    /**
     * Helper method to check if a request exists
     * @param paymentReference The payment reference to check
     * @returns Whether the request exists
     */
    private requestExists(_paymentReference: string): boolean {
        // This would be implemented to check in a database or with the Request Network API
        return true; // Mocked for now
    }
}