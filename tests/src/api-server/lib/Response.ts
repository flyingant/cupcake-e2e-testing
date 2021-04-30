import { ObjectData } from './types'

export interface ResponsePagination {
  totalRows: number
  pageNum: number
  pageSize: number
}

export interface ResponseError {
  message: string
  details?: string | ObjectData
}

export interface ResponsePayload {
  data?: ObjectData
  pages?: ResponsePagination
  error?: ResponseError
}

export interface ResponseStringified {
  statusCode: number
  headers: ObjectData
  body: string
}

export interface HandlerResponse {
  ready: boolean
  status: (status: number) => HandlerResponse
  cors: (origin: string) => HandlerResponse
  headers: (headers: ObjectData) => HandlerResponse
  error: (error: ResponseError, status?: number) => HandlerResponse
  data: (data: ObjectData | { data: ObjectData; pages: ResponsePagination }, status?: number) => HandlerResponse
  toString: () => {
    statusCode: number
    headers: ObjectData
    body: string
  }
}

export class Response implements HandlerResponse {
  protected props = {
    cors: '*',
    status: 0,
    headers: {},
    payload: {},
  }

  public constructor(payload?: ResponsePayload) {
    this.props.payload = payload || {}
  }

  public status(status: number): HandlerResponse {
    this.props.status = status
    return this
  }

  public cors(origin: string): HandlerResponse {
    this.props.cors = origin
    return this
  }

  public headers(headers: ObjectData): HandlerResponse {
    Object.assign(this.props.headers, headers)
    return this
  }

  public error(error: ResponseError, status?: number): HandlerResponse {
    if (status) {
      this.props.status = status
    }
    Object.assign(this.props.payload, { error })
    return this
  }

  public data(data: ObjectData | { data: ObjectData; pages: ResponsePagination }, status?: number): HandlerResponse {
    if (status) {
      this.props.status = status
    }
    if (data && data.pages) {
      Object.assign(this.props.payload, { ...data })
    } else {
      Object.assign(this.props.payload, { data })
    }
    return this
  }

  public toString(): ResponseStringified {
    return {
      statusCode: this.props.status === 0 ? 200 : this.props.status,
      headers: {
        'Access-Control-Allow-Origin': this.props.cors,
        'Access-Control-Allow-Credentials': true,
        ...this.props.headers,
      },
      body: Object.keys(this.props.payload).length ? JSON.stringify(this.props.payload) : null,
    }
  }

  get ready(): boolean {
    return this.props.status > 0
  }
}
