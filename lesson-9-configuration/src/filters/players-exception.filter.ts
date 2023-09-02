import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class PlayersExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    console.log('PlayersExceptionFilter');
    response.status(status).json({
      statusCode: status,
      message: `Error while handling player: ${exception.message}`,
    });
  }
}