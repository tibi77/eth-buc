/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AgentService } from './agent.service';

@Controller("agentNetwork")
@ApiTags('Agent')
export class AgentController {

    constructor(
        private readonly agentService: AgentService, // Injecting the AgentService to use its methods
    ) { }


    @Post("startTrading")
    @ApiOkResponse({ description: 'Trading started successfully', type: String })
    async startTrading(): Promise<string> {
        await this.agentService.startTrading();
        return "Trading started successfully";
    }
}
