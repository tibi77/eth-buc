/* eslint-disable @darraghor/nestjs-typed/api-method-should-specify-api-response */
// request.controller.ts
import {
    Controller,
    Post,
    Body,
} from '@nestjs/common';
import {
    ApiTags,
} from '@nestjs/swagger';
import { RequestService } from "./request.service"
import {
    CreateRequestDto,
    RequestResponseDto,
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
}