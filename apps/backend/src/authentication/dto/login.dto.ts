import {createZodDto} from '@anatine/zod-nestjs';
import {LoginResponseShape} from '@bookIt/types/authentication';

export class LoginResponseShapeDto extends createZodDto(LoginResponseShape) {}
