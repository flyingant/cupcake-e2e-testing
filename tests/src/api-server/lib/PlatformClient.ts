import fetch, { RequestInit, Response } from 'node-fetch'
import { Base64 } from 'js-base64'
import { PlatformError } from './errors/PlatformError'
import { ObjectData } from './types'
import AppConf from '../../AppConf'
import https from 'https'


export enum AuthType {
  Basic,
  Token,
}

export interface PlatformRequestOptions {
  url: string
  auth?: AuthType
  payload?: {}
  headers?: {}
}

export class PlatformClient {
  readonly authToken: string | null
  readonly authSecret: string

  /**
   * @param {string} token
   */
  constructor(token?: string, clientId:string = AppConf.ccClientId(), clientSecret: string = AppConf.ccClientSecret()) {
    this.authToken = token ? token.replace('Bearer ', '') : ''
    this.authSecret = Base64.encode(clientId + ':' + clientSecret)
  }

  /**
   * --------------------------------------------------------------------------
   * Get type request
   * --------------------------------------------------------------------------
   * @param {PlatformRequestOptions} request
   * @returns {Promise<ObjectData>}
   */
  public get(request: PlatformRequestOptions): Promise<ObjectData | undefined> {
    const reqInit: RequestInit = {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(request.auth),

        ...(request.headers || {}),
      },
    }

    if (request.payload) {
      request.url =
        request.url +
        '?' +
        Object.keys(request.payload || {})
          .map((key) => {
              return encodeURIComponent(key) + '=' + encodeURIComponent(request.payload[key])
          })
          .join('&')
    }

    return this.requestHandler(request.url, reqInit)
  }

  /**
   * --------------------------------------------------------------------------
   * Post type request
   * --------------------------------------------------------------------------
   * @param {PlatformRequestOptions} request
   * @returns {Promise<ObjectData>}
   */
  public post(request: PlatformRequestOptions): Promise<ObjectData | undefined> {
    const reqInit: RequestInit = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(request.auth),
        ...(request.headers ? request.headers : {}),
      },
      body: JSON.stringify(request.payload || {}),
    }

    console.log(JSON.stringify(reqInit));
    return this.requestHandler(request.url, reqInit)
  }

  /**
   * --------------------------------------------------------------------------
   * Patch type request
   * --------------------------------------------------------------------------
   * @param {PlatformRequestOptions} request
   * @returns {Promise<ObjectData>}
   */
  public patch(request: PlatformRequestOptions): Promise<ObjectData | undefined> {
    const reqInit: RequestInit = {
      method: 'patch',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(request.auth),
        ...(request.headers ? request.headers : {}),
      },
      body: JSON.stringify(request.payload || {}),
    }

    return this.requestHandler(request.url, reqInit)
  }

  /**
   * --------------------------------------------------------------------------
   * Post type request with form-url-encoded payload
   * --------------------------------------------------------------------------
   * @param {PlatformRequestOptions} request
   * @returns {Promise<ObjectData>}
   */
  public form(request: PlatformRequestOptions): Promise<ObjectData> {
    const reqInit: RequestInit = {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...this.getAuthHeader(request.auth),
        ...(request.headers ? request.headers : {}),
      },
      body: Object.keys(request.payload || {})
        .map((key) => {
          return encodeURIComponent(key) + '=' + encodeURIComponent(request.payload[key])
        })
        .join('&'),
    }

    return this.requestHandler(request.url, reqInit)
  }

  /**
   * --------------------------------------------------------------------------
   * Delete type request
   * --------------------------------------------------------------------------
   * @param {PlatformRequestOptions} request
   * @returns {Promise<ObjectData>}
   */
  public delete(request: PlatformRequestOptions): Promise<ObjectData> {
    const reqInit: RequestInit = {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(request.auth),
        ...(request.headers ? request.headers : {}),
      },
    }

    return this.requestHandler(request.url, reqInit)
  }

  /**
   * --------------------------------------------------------------------------
   * Prepare Authorization header
   * --------------------------------------------------------------------------
   * @param {AuthType} auth
   * @returns {{Authorization?: string}}
   */
  protected getAuthHeader(auth?: AuthType): { Authorization: string } {
    if (this.authToken) {
      return { Authorization: `Bearer ${this.authToken}` }
    }
    if (auth === AuthType.Basic) {
      return { Authorization: `Basic ${this.authSecret}` }
    }
    throw new Error("unknown auth type " + auth);
  }

  /**
   * --------------------------------------------------------------------------
   * Handle node-fetch request
   * --------------------------------------------------------------------------
   * @param {string} url
   * @param {RequestInit} reqInit
   * @returns {Promise<ObjectData>}
   */
  protected async requestHandler(url: string, reqInit: RequestInit): Promise<ObjectData> {
    try {
      const agent = new https.Agent({ keepAlive: true });
      const response = await fetch(url, {...reqInit, agent})
      return await this.responseHandler(response)
    } catch (e) {
      this.errorHandler(e)
    }
  }

  /**
   * --------------------------------------------------------------------------
   * Handle node-fetch response
   * --------------------------------------------------------------------------
   * @param {Response} res
   * @returns {Promise<ObjectData>}
   */
  protected async responseHandler(res: Response): Promise<ObjectData> {
    const resText = await res.text()

    const payload = resText ? JSON.parse(resText) : {}

    if (res.status > 399) {
      if (payload.error_description.includes('Invalid access token')) {
        payload.error_description = 'Invalid access token.'
      }
      throw new PlatformError(res.status, payload.error_description)
    }

    return payload
  }

  /**
   * --------------------------------------------------------------------------
   * Handel node-fetch request error
   * --------------------------------------------------------------------------
   * @param {Error} err
   */
  protected errorHandler(err: Error): void {
    if (err instanceof PlatformError) {
      throw err
    }
    console.log(err)
    throw new PlatformError(500, err.message)
  }
}
