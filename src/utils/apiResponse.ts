import { Response } from "express";

export enum StatusCode {
  SUCCESS = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  FAILURE = 422,
  INTERNAL_SERVER_ERROR = 500,
}

export enum ResponseStatus {
  SUCCESS = "success",
  ERROR = "error",
}

export abstract class ApiResponse {
  constructor(
    public statusCode: StatusCode,
    public status: ResponseStatus,
    public message: string
  ) {}

  prepare(
    res: Response,
    body?: any,
    headers: { [key: string]: string } = {}
  ): Response {
    res.set(headers);

    const response: any = {
      status: this.statusCode,
      message: this.message,
    };

    if (body !== undefined) {
      response.data = body;
    }

    return res.status(this.statusCode).json(response);
  }
}

export class SuccessResponse<T> extends ApiResponse {
  constructor(message: string, private data: T) {
    super(StatusCode.SUCCESS, ResponseStatus.SUCCESS, message);
  }

  send(res: Response, headers: { [key: string]: string } = {}): Response {
    return super.prepare(res, this.data, headers);
  }
}

export class ErrorResponse extends ApiResponse {
  constructor(
    message: string,
    statusCode: StatusCode = StatusCode.INTERNAL_SERVER_ERROR
  ) {
    super(statusCode, ResponseStatus.ERROR, message);
  }

  send(res: Response, headers: { [key: string]: string } = {}): Response {
    return super.prepare(res, undefined, headers);
  }
}

export class AuthFailureResponse extends ApiResponse {
  constructor(message: string = "Unauthorized") {
    super(StatusCode.UNAUTHORIZED, ResponseStatus.ERROR, message);
  }

  send(res: Response): Response {
    return super.prepare(res);
  }
}

export class NotFoundResponse extends ApiResponse {
  constructor(message: string = "Resource not found") {
    super(StatusCode.NOT_FOUND, ResponseStatus.ERROR, message);
  }

  send(res: Response): Response {
    return super.prepare(res);
  }
}

export class ForbiddenResponse extends ApiResponse {
  constructor(message: string = "Access forbidden") {
    super(StatusCode.FORBIDDEN, ResponseStatus.ERROR, message);
  }

  send(res: Response): Response {
    return super.prepare(res);
  }
}

export class BadRequestResponse extends ApiResponse {
  constructor(message: string = "Bad request") {
    super(StatusCode.BAD_REQUEST, ResponseStatus.ERROR, message);
  }

  send(res: Response): Response {
    return super.prepare(res);
  }
}

export class InternalErrorResponse extends ApiResponse {
  constructor(message: string = "Internal server error") {
    super(StatusCode.INTERNAL_SERVER_ERROR, ResponseStatus.ERROR, message);
  }

  send(res: Response): Response {
    return super.prepare(res);
  }
}

export class FailureMsgResponse extends ApiResponse {
  constructor(message: string) {
    super(StatusCode.FAILURE, ResponseStatus.ERROR, message);
  }

  send(res: Response): Response {
    return super.prepare(res);
  }
}
