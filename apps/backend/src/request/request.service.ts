// request.service.ts
import { Injectable } from '@nestjs/common';
import {
    CreateRequestDto,
    PayRequestDto,
} from "./requst.dto"
import axios from 'axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoices } from './request.entry';

@Injectable()
export class RequestService {

    constructor(
        @InjectModel(Invoices.name)
        private readonly invoicesModel: Model<Invoices>,
    ) { }
    /**
     * Creates a new payment request
     * @param createRequestDto Request details
     * @returns The created request information
     */
    async createRequest(_createRequestDto: CreateRequestDto) {
        // Implementation would connect to the Request Network API
        const data = {
            "payee": process.env.PAYEE,
            "amount": _createRequestDto.amount,
            "invoiceCurrency": "USD",
            "paymentCurrency": "ETH-sepolia-sepolia",
            "recurrence": {
                "startDate": new Date(),
                "frequency": "MONTHLY"
            }
        }
        const options = {
            method: 'POST',
            url: 'https://api.request.network/v1/request',
            headers: { 'X-Api-Key': process.env.REQUEST_API, 'Content-Type': 'application/html' },
            data: JSON.stringify(data)
        };

        try {
            const { data } = await axios.request(options);
            console.log(data);

            this.invoicesModel.create({
                userWallet: _createRequestDto.payer,
                invoice_id: data.requestId,
                status: "pending",
                amount: _createRequestDto.amount,
                requestId: data.requestId,
                paymentReference: data.paymentReference,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            return data;
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Gets the status of a payment request
     * @param paymentReference The payment reference of the request
     * @returns The status of the request
     */
    async getRequestStatus(paymentReference: string): Promise<any> {
        // Implementation would connect to the Request Network API
        // Check if request exists

        const options = {
            method: 'GET',
            url: 'https://api.request.network/v1/request/' + paymentReference,
            headers: { 'X-Api-Key': process.env.REQUEST_API, 'Content-Type': 'application/html' }
        };

        try {
            const { data } = await axios.request(options);
            console.log(data);
            return data;
        } catch (error) {
            console.error(error);
        }
    }

    async payRequest(_payRequestDto: PayRequestDto): Promise<any> {

        const options = {
            method: 'POST',
            url: 'https://api.request.network/v1/pay',
            headers: { 'X-Api-Key': process.env.REQUEST_API, 'Content-Type': 'application/json' },
            data: {
                payee: process.env.PAYEE,
                amount: _payRequestDto.amount,
                invoiceCurrency: 'USD',
                paymentCurrency: 'ETH-sepolia-sepolia'
            }
        };

        try {
            const { data } = await axios.request(options);
            console.log(data);
            this.invoicesModel.updateOne(
                { paymentReference: _payRequestDto.payee },
                {
                    status: "paid",
                    updatedAt: new Date(),
                }
            );
            return data;
        } catch (error) {
            console.error(error);
        }
    }
}