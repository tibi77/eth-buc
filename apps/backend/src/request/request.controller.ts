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
@Controller('requestNetwork')
export class RequestController {
    constructor(private readonly requestService: RequestService) { }

   @Post("create")
    async createRequest(
          @Body() createRequestDto: CreateRequestDto,
     ): Promise<RequestResponseDto> {
          return this.requestService.createRequest(createRequestDto);
     }
    
     
    //  @Get("get/:id")
    //  async getRequest(
    //       @Param('id') id: string,
    //  ): Promise<RequestResponseDto> {
    //       return this.requestService.getRequest(id);
    //  }
    
    //  @Patch("updateStatus")
    //  async updateStatus(
    //       @Body() requestStatusDto: RequestStatusDto,
    //  ): Promise<RequestResponseDto> {
    //       return this.requestService.updateStatus(requestStatusDto);
    //  }
    
    //  @Post("paymentCalldata")
    //  async paymentCalldata(
    //       @Body() paymentCalldataDto: PaymentCalldataDto,
    //  ): Promise<PayResponseDto> {
    //       return this.requestService.paymentCalldata(paymentCalldataDto);
    //  }
    
    //  @Post("pay")
    //  async pay(
    //       @Body() payRequestDto: PayRequestDto,
    //  ): Promise<PayResponseDto> {
    //       return this.requestService.pay(payRequestDto);
    //  }

}