import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TRoleAbilities } from '@metavest/types/roles/abilities.type';
import { Document } from 'mongoose';
import { Role } from './role.enum';

export type RoleAbilitiesDocument = RoleAbilities & Document;
@Schema({
    collection: 'roles_abilities'
})
export class RoleAbilities implements TRoleAbilities {
    @Prop({
        type: String,
        required: true,
        enum: Object.values(Role)
    })
    role: Role;

    @Prop({
        type: [String],
        required: true
    })
    disabledWidgets: string[];

    @Prop({
        type: Number,
        required: true
    })
    maxNumBots: number;

    @Prop({
        type: Number,
        required: true
    })
    maxButtonsIntegrations: number;

    @Prop({
        type: Number,
        required: true
    })
    maxMBFiles: number;

    @Prop({
        type: Number,
        required: true
    })
    maxUserAgents: number;

    @Prop({
        type: Boolean,
        required: true
    })
    accessToAllBots: boolean;

    @Prop({
        type: Boolean,
        required: true
    })
    accessToBotsDashboard: boolean;


    @Prop({
        type: Boolean,
        required: true
    })
    accessToUsers: boolean;

    @Prop({
        type: Boolean,
        required: true
    })
    accessToAllInvoices: boolean;

    @Prop({
        type: Boolean,
        required: true
    })
    accessToLiveChat: boolean;

    @Prop({
        type: Boolean,
        required: true
    })
    accessToAllPersonalBots: boolean;

    @Prop({
        type: Number,
        required: true
    })
    cost: number;

    @Prop({
        type: Boolean,
        required: true
    })
    accessApiToken: boolean;

    @Prop({
        type: Boolean,
        required: true
    })
    accessWhatsApp: boolean;

    @Prop({
        type: Number,
        required: true
    })
    maxMessagesPerMonth: number;
}

const RoleAbilitiesSchema = SchemaFactory.createForClass(RoleAbilities);
RoleAbilitiesSchema.index({ role: 1 });

export { RoleAbilitiesSchema };
