const StatusCode = {
  Ok: 200,
  Created: 201,
};

const ReasonStatusCode = {
  CREATED: "Created successfully",
  OK: "Request successful",
};

class SuccessResponse {
  constructor(
    message,
    statusCode = StatusCode.Ok,
    reasonStatusCode = ReasonStatusCode.OK,
    metaData = {}
  ) {
    this.message = !message ? reasonStatusCode : message;
    this.status = statusCode;
    this.metaData = metaData;
  }

  send(res, headers = {}) {
    return res.status(this.status).json(this);
  }
}

class OK extends SuccessResponse {
  constructor({ message, metaData }) {
    super(message, metaData);
  }
}

class Created extends SuccessResponse {
  constructor({
    message,
    statusCode = StatusCode.Created,
    reasonStatusCode = ReasonStatusCode.CREATED,
    metaData,
  }) {
    super(message, statusCode, reasonStatusCode, metaData);
  }
}

module.exports = {
  OK,
  Created,
};
