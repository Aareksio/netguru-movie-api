import { Exception } from 'tsoa';

export class OMDBError implements Exception {
  public status = 400;
  public name = 'OMDBError';

  constructor(public message: string) { }
}

export class ConflictError implements Exception {
  public status = 409;
  public name = 'ConflictError';

  constructor(public message: string) { }
}
