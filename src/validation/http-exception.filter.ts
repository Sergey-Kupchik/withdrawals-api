import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    let errorResp = [];
    const exceptionResponse: any = exception.getResponse();
    // if (exceptionResponse.message && Array.isArray(exceptionResponse.message)) {
    //   exceptionResponse.message?.forEach((e) => {
    //     errorResp.push({
    //       message: e,
    //       field: e.match(/^(\S+)\s(.*)/).slice(1)[0],
    //     });
    //   });
    // } else {
    errorResp = exceptionResponse.message;
    // }
    response.status(status).json({
      errorsMessages: errorResp,
    });
  }
}
