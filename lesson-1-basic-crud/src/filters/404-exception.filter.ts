import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(NotFoundException)
export class HttpError404Filter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    console.log('HttpError404Filter');

    response.status(404).json({
      statusCode: 404,
      message: 'Resource not found',
    });
  }
}
