import { HttpError } from './HttpError'
import { ObjectData } from '../types'

export class ForbiddenError extends HttpError {
  constructor(message?: string, details?: string | ObjectData) {
    super(403, message, details)
  }
}
