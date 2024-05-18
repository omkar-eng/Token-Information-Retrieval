import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class ValidateTokenMiddleware implements NestMiddleware {
  use(req: any, res: any, next: (error?: any) => void) {
    const accessToken: string = req.headers['access-key'];
    if (!accessToken) {
      return res.status(400).send({ error: 'Please provide the access token' });
    }
    next();
  }
}
