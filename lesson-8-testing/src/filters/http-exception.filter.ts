import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    console.log('HttpExceptionFilter');
    response
      .status(status)
      .json({
        microservice: 'Nestjs Course Microservice',
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}