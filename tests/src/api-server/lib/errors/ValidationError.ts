import { HttpError } from './HttpError'
import { ObjectData } from '../types'

export class ValidationError extends HttpError {
  constructor(message: string, details?: ObjectData) {
    super(400, message, details)
  }
}
