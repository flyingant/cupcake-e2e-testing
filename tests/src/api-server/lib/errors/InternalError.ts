import { HttpError } from './HttpError'
import { ObjectData } from '../types'

export class InternalError extends HttpError {
  constructor(message?: string, details?: string | ObjectData) {
    super(500, message, details)
  }
}
