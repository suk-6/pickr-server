import { ApiProperty, PickType } from '@nestjs/swagger';

import { UserDTO } from '@modules/user/dto/user.dto';

export class RequestOtpDTO extends PickType(UserDTO, ['phone']) {}

export class PhoneTokenDTO {
  @ApiProperty({ description: 'Phone token' })
  phoneToken: string;
}

export class PhoneTokenWithOtpDTO extends PhoneTokenDTO {
  @ApiProperty({ description: 'OTP' })
  otp: string;
}
