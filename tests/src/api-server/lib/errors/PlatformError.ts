import { HttpError } from './HttpError'

export class PlatformError extends HttpError {
  constructor(code, details?: string) {
    super(code, 'Platform request error')
    this.details = details
  }
}
