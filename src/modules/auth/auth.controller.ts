import { CurrentUser } from 'src/common';

import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { User } from '@prisma/client';

import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import {
  PhoneTokenDTO,
  PhoneTokenWithOtpDTO,
  RequestOtpDTO,
} from './dto/phone.dto';
import { RegisterDTO } from './dto/register.dto';
import { TokenDto } from './dto/token.dto';
import { AccessGuard } from './guards/access.guard';
import { RefreshGuard } from './guards/refresh.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/refresh')
  @UseGuards(RefreshGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiOkResponse({ description: 'Access token refreshed', type: TokenDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  public async getAccessToken(@CurrentUser() { id }: Pick<User, 'id'>) {
    return await this.authService.generateTokens(id);
  }

  @Get('/login')
  @ApiOperation({ summary: 'Login' })
  @ApiOkResponse({ description: 'Login successful', type: TokenDto })
  @ApiNotFoundResponse({ description: '로그인 실패' })
  public async login(@Body() { loginId, password }: LoginDTO) {
    return await this.authService.login(loginId, password);
  }

  @Get('/logout')
  @UseGuards(AccessGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout' })
  @ApiOkResponse({ description: 'Logout successful' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  public async logout(@CurrentUser() { id }: Pick<User, 'id'>) {
    return await this.authService.removeRefreshToken(id);
  }

  @Post('/register')
  @ApiOperation({ summary: '회원가입' })
  @ApiOkResponse({ description: 'register successful', type: TokenDto })
  @ApiConflictResponse({
    description: '이미 해당 아이디를 사용하는 유저가 존재함',
  })
  public async register(@Body() dto: RegisterDTO) {
    return await this.authService.register(dto);
  }

  @Get('/phone')
  @UseGuards(AccessGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '전화번호 등록 OTP 요청하기' })
  @ApiOkResponse({ description: 'Phone Token', type: PhoneTokenDTO })
  public async requestPhoneOTP(
    @CurrentUser() { id }: Pick<User, 'id'>,
    @Body() { phone }: RequestOtpDTO,
  ) {
    return await this.authService.requestPhoneOTP(id, phone);
  }

  @Put('/phone')
  @UseGuards(AccessGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '전화번호 등록' })
  @ApiOkResponse({ description: '성공' })
  @ApiBadRequestResponse({ description: '인증번호가 맞지 않음' })
  @ApiInternalServerErrorResponse({
    description: '전화번호 등록에 문제가 생김',
  })
  public async registerPhone(
    @CurrentUser() { id }: Pick<User, 'id'>,
    @Body() { phoneToken, otp }: PhoneTokenWithOtpDTO,
  ) {
    return await this.authService.registerPhone(id, phoneToken, otp);
  }
}
