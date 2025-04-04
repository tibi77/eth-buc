import { AgentService } from './agent.service';
import { AgentController } from './agent.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
    imports: [],
    controllers: [
        AgentController,],
    providers: [
        AgentService,],
})
export class AgentModule { }
