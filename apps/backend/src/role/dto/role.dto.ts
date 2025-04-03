import { createZodDto } from '@anatine/zod-nestjs';
import { RoleAbilities } from '@metavest/types/roles/abilities.type';

export class CreateRoleAbilities extends createZodDto(RoleAbilities) { }