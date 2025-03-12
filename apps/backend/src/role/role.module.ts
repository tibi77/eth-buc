import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/users/user.module';
import { RoleController } from './role.controller';
import { RoleAbilities, RoleAbilitiesSchema } from './role.entry';
import { RoleService } from './role.service';

@Module({
  imports: [MongooseModule.forFeature(
    [{
      name: RoleAbilities.name,
      schema: RoleAbilitiesSchema
    }]
  ), UserModule],
  providers: [RoleService],
  controllers: [RoleController],
  exports: [RoleService],
})
export class RoleModule { }
