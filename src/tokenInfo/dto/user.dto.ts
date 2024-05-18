import { IsNumber, IsString } from 'class-validator';

export class UserDataDto {
  @IsString()
  hash: string;

  @IsString()
  userEmail: string;

  @IsNumber()
  requestRateLimit: number;

  @IsNumber()
  expirationTimeInSec: number;
}
