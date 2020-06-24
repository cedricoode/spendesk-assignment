export class ParameterError extends Error {
  parentError: Error;
  statusCode: Number;
  constructor(msg: string, err?: Error) {
    super('Invalid query parameter: ' + msg);
    this.statusCode = 422;
    this.parentError = err;
  }
}

export class InvalidRequestError extends Error {
  parentError: Error;
  statusCode: Number;
  constructor(msg: string, err?: Error) {
    super('Invalid input: ' + msg);
    this.statusCode = 400;
    this.parentError = err;
  }
}
