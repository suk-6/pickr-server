import { PickType } from '@nestjs/swagger';

import { UserDTO } from '@modules/user/dto/user.dto';

export class RegisterDTO extends PickType(UserDTO, ['loginId', 'password']) {}
