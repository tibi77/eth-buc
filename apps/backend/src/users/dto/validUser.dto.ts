import { createZodDto } from '@anatine/zod-nestjs';
import { ValidUserShape } from '@bookIt/types/user';

export class ValidUserDto extends createZodDto(ValidUserShape) { }
