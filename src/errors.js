const definitions = {
  SUPPLIER_INVALID_RESPONSE: [502, 'The supplier returned invalid stock data.'],
  SUPPLIER_UNAVAILABLE: [502, 'The supplier is currently unavailable.'],
  SUPPLIER_TIMEOUT: [504, 'The supplier request timed out.'],
  SYNC_IN_PROGRESS: [409, 'A synchronization is already in progress.'],
  NOT_FOUND: [404, 'The requested resource was not found.'],
  INTERNAL_ERROR: [500, 'The request could not be completed.']
};
export class ServiceError extends Error {
  constructor(code) {
    const [status, message] = definitions[code] ?? definitions.INTERNAL_ERROR;
    super(message);
    this.code = definitions[code] ? code : 'INTERNAL_ERROR';
    this.status = status;
  }
}
export function publicError(error) {
  const safe = error instanceof ServiceError ? new ServiceError(error.code) : new ServiceError('INTERNAL_ERROR');
  return { status: safe.status, body: { error: { code: safe.code, message: safe.message } } };
}
