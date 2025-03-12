import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRoleAbilities } from './dto/role.dto';
import { RoleAbilities } from './role.entry';

@Injectable()
export class RoleService {
    constructor(
        @InjectModel(RoleAbilities.name)
        private readonly roleModel: Model<RoleAbilities>
    ) { }
    async getUnauthorizedDashboardItems(roles: string[]): Promise<string[]> {
        const roleAuthorizations = await this.roleModel.findOne({
            role: {
                $in: roles
            }
        });
        if (!roleAuthorizations?.disabledWidgets) {
            return ["*"];
        }

        return roleAuthorizations.disabledWidgets;
    }

   
    async getRoleAbilities(roles: string[]): Promise<CreateRoleAbilities | null> {
        return this.roleModel.findOne({
            role: {
                $in: roles
            }
        });
    }
}
