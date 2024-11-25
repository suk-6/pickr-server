import { PickType } from '@nestjs/swagger';

import { UserDTO } from '@modules/user/dto/user.dto';

export class LoginDTO extends PickType(UserDTO, ['loginId', 'password']) {}
