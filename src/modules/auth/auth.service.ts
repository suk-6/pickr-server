import { compare, genSalt, hash } from 'bcrypt';

import { Cache } from '@nestjs/cache-manager';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { JwtPhonePayload } from '@common/models/phone';
import { CoolsmsService } from '@common/modules/coolsms/coolsms.service';

import { UserService } from '@modules/user/user.service';

import { RegisterDTO } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly cacheService: Cache,
    private readonly userService: UserService,
    private readonly coolsmsService: CoolsmsService,
  ) {}

  private async _generateAccessToken(id: string) {
    const token = await this.jwtService.signAsync(
      { id, type: 'ACCESS' },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRATION'),
      },
    );

    return token;
  }

  private async _generateRefreshToken(id: string) {
    const token = await this.jwtService.signAsync(
      { id, type: 'REFRESH' },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRATION'),
      },
    );

    await this.cacheService.set(`REFRESH/${id}`, token);

    return token;
  }

  public async generateTokens(id: string) {
    const accessToken = await this._generateAccessToken(id);
    const refreshToken = await this._generateRefreshToken(id);

    return { accessToken, refreshToken };
  }

  public async verifyAccessToken(id: string, token: string) {
    const _token = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get('JWT_SECRET'),
    });

    return _token.id === id;
  }

  public async verifyRefreshToken(id: string, token: string) {
    return (await this.cacheService.get(`REFRESH/${id}`)) === token;
  }

  public async removeRefreshToken(id: string) {
    await this.cacheService.del(`REFRESH/${id}`);
  }

  public async login(loginId: string, password: string) {
    const user = await this.userService.findOneById(loginId);

    if (
      !user || // 유저를 찾지 못함
      (user && !(await compare(password, user.password))) // 비밀번호가 일치하지 않음
    )
      throw new NotFoundException('아이디 또는 비밀번호가 잘못되었습니다.');

    return this.generateTokens(user.id);
  }

  public async register(dto: RegisterDTO) {
    if (await this.userService.findOneById(dto.loginId))
      throw new ConflictException(
        '이미 해당 아이디를 사용하는 유저가 존재합니다.',
      );

    const hashedPassword = await hash(dto.password, await genSalt(10));

    const user = await this.userService.create({
      loginId: dto.loginId,
      password: hashedPassword,
    });

    return this.generateTokens(user.id);
  }

  public async requestPhoneOTP(id: string, phone: string) {
    await this.cacheService.del(`PHONE/${id}`);

    const phoneToken = await this.jwtService.signAsync(
      {
        id,
        phone,
      },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '3m',
      },
    );

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await this.cacheService.set(`PHONE/${id}`, otp, 180000); // 3분
    await this.coolsmsService.sendSMS(
      phone,
      `[Pickr] 인증번호 [${otp}]를 입력해주세요.`,
    );

    return { phoneToken };
  }

  public async registerPhone(userId: string, phoneToken: string, otp: string) {
    const { id, phone } = await this.jwtService.verifyAsync<JwtPhonePayload>(
      phoneToken,
      {
        secret: this.configService.get('JWT_SECRET'),
      },
    );

    if (userId !== id)
      throw new BadRequestException('이 계정에서 요청한 인증이 아닙니다.');

    const realOTP = await this.cacheService.get<string>(`PHONE/${userId}`);

    if (realOTP !== otp)
      throw new BadRequestException('인증번호가 맞지 않습니다.');

    await this.cacheService.del(`PHONE/${userId}`);

    try {
      await this.userService.registerPhone(userId, phone);
    } catch {
      throw new InternalServerErrorException(
        '휴대전화 번호 등록에 문제가 생겼습니다.',
      );
    }

    return { success: true };
  }
}
