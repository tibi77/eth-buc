/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AgentService } from './agent.service';

@Controller("agentNetwork")
@ApiTags('Agent')
export class AgentController {

    constructor(
        private readonly agentService: AgentService, // Injecting the AgentService to use its methods
    ) { }


    @Post("startTrading")
    @ApiOkResponse({ description: 'Trading started successfully', type: String })
    @ApiBody({
        description: 'Trading parameters',
        type: Object,
        examples: {
            example1: {
                value: {
                    iterations: 10,
                    pair: "BTC/USD"
                },
            },
        },
    })
    async startTrading(@Body()
    {
        iterations,
        pair
    }: {
        iterations: number;
        pair: string;
    }): Promise<string> {
        await this.agentService.startTrading(
            iterations,
            pair
        );
        return "Trading started successfully";
    }
}
