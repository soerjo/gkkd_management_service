import { ArgumentsHost, Catch, ExceptionFilter, HttpCode, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError, HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    let response: {
      responseCode: number;
      message: string;
    };

    if (exception instanceof QueryFailedError) {
      response = {
        responseCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: exception.message,
      };
    }

    if (exception instanceof HttpException) {
      response = {
        responseCode: exception.getStatus(),
        message: (exception.getResponse() as any)?.message,
      };
    }

    const ctx = host.switchToHttp();
    const responseCtx = ctx.getResponse<Response>();
    responseCtx.status(response.responseCode).send(response);
  }
}
