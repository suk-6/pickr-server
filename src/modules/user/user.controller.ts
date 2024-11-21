import { CurrentUser } from '@common';

import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { User } from '@prisma/client';

import { AccessGuard } from '@modules/auth/guards/access.guard';

import { UserDTO } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  @UseGuards(AccessGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiOkResponse({ description: 'User profile retrieved', type: UserDTO })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  public getProfile(@CurrentUser() user: User) {
    return this.userService.findOneById(user.id);
  }
}
