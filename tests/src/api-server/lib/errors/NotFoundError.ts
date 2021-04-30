import { HttpError } from './HttpError'
import { ObjectData } from '../types'

export class NotFoundError extends HttpError {
  constructor(message?: string, details?: string | ObjectData) {
    super(404, message, details)
  }
}
