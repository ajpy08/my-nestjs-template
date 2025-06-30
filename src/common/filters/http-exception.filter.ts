import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { TypeORMError } from 'typeorm';

interface ExceptionResponse {
  message?: string;
  error?: string;
  errors?: unknown;
  status?: number;
}

interface ExtendedException {
  detail?: string;
  name: string;
  message: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const getExceptionMessage = (): string => {
      if (exception instanceof HttpException) {
        const response = exception.getResponse() as ExceptionResponse;
        if (response?.message) {
          return response.message;
        }

        if (
          typeof exception.message === 'object' &&
          exception.message !== null
        ) {
          const messageObj = exception.message as Record<string, unknown>;
          if ('error' in messageObj && typeof messageObj.error === 'string') {
            return messageObj.error;
          }
        }

        return exception.message;
      }

      const extException = exception as ExtendedException;

      return (
        extException.message ?? extException.detail ?? 'Internal server error'
      );
    };

    let status: number =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message: string = getExceptionMessage();

    if (exception instanceof TypeORMError) {
      const typeormError = exception as ExtendedException;
      message = typeormError.detail ?? 'Database error';
      status = HttpStatus.BAD_REQUEST;
    }

    const getExceptionError = (): string => {
      if (exception instanceof HttpException) {
        const response = exception.getResponse() as ExceptionResponse;

        return response?.error ?? 'Error';
      }
      const extException = exception as ExtendedException;

      return extException.name ?? 'Error';
    };

    const getExceptionErrors = (): unknown => {
      if (exception instanceof HttpException) {
        const response = exception.getResponse() as ExceptionResponse;

        return response?.errors;
      }

      return undefined;
    };

    const error: string = getExceptionError();
    const errors: unknown = getExceptionErrors();

    const errorResponse = {
      message,
      error,
      errors,
      statusCode: status,
      path: `[${request.method}] ${request.url}`,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(errorResponse);
  }
}
