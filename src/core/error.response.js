const statusCode = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  CONFILICT: 409,
};

const messages = {
  BAD_REQUEST: "Bad Request",
  UNAUTHORIZED: "Unauthorized",
  FORBIDDEN: "Forbidden",
  NOT_FOUND: "Not Found",
  INTERNAL_SERVER_ERROR: "Internal Server Error",
  CONFLICT: "Conflict",
};

class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message = messages.BAD_REQUEST,
    status = statusCode.BAD_REQUEST
  ) {
    super(message, status);
  }
}

class ConFiflictError extends ErrorResponse {
  constructor(message = messages.CONFLICT, status = statusCode.CONFILICT) {
    super(message, status);
  }
}

module.exports = {
  ErrorResponse,
  BadRequestError,
  ConFiflictError,
  statusCode,
  messages,
};
