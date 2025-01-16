import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class CustomExceptionFilters implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Determine the status and message for HttpExceptions and non-HttpExceptions
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;
    const message =
      exception instanceof HttpException
        ? exception.message || exception.getResponse()
        : 'Internal server error';

    let errors = [];
    if (exception instanceof BadRequestException) {
      const badRequestResponse: any = exception.getResponse();
      errors = badRequestResponse.message || [];
    }

    if (exception instanceof NotFoundException) {
      console.log('Exception type is NotFoundException');
    }

    if (exception instanceof UnauthorizedException) {
      console.log('Exception type is UnauthorizedException');
    }

    // Log the exception for debugging (optional)
    console.error('Exception caught by filter:', exception);

    // Respond with a standardized error object
    response.status(status).json({
      statusCode: status,
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url,
      errors: errors,
    });
  }
}
