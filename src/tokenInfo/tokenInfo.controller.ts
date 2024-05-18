import { Controller, Get, Req } from '@nestjs/common';
import { TokenInfoService } from './tokenInfo.service';

@Controller('token-info')
export class TokenInfoController {
  constructor(private tokenInfoService: TokenInfoService) {}

  @Get('mock-data')
  async getMockData(@Req() req) {
    const ip = req.connection.remoteAddress;
    const accessKey = req.headers['access-key'];
    return await this.tokenInfoService.getMockData(accessKey, ip);
  }
}
