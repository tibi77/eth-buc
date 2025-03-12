import { createZodDto } from '@anatine/zod-nestjs';
import { UserShape } from '@bookIt/types/user';

export class UserDto extends createZodDto(UserShape) { }
