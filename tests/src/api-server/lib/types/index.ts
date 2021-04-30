export interface Instantiable {
  new (...args: any[]): any
}

export interface ObjectData {
  [index: string]: any
}

export * as Patient from './patient'
export * as Journey from './journey'
