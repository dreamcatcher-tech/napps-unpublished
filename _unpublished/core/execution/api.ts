import type {
  Address,
  Artifact,
  Effects,
  Fibers,
  JsonValue,
  Lineage,
  Meta,
  Read,
  State,
  Write,
} from '@artifact/api'
import { jsonSchema, stateSchema } from '@artifact/api'
import type { z, ZodRecord, ZodTypeAny } from 'zod'
import type { Trail } from './trail.ts'
import type { Action } from '../api/actions.ts'

// Example debug logger
// import Debug from 'debug'
// const debug = Debug('api')

/**
 * Concrete implementation of the `Artifact` interface.
 * Bound to a single canonical `address` for all read/write/lineage.
 */
export class Api implements Artifact {
  /**
   * Create a new Artifact from a given trail and address.
   */
  static create = (trail: Trail, address: Address): Api =>
    new Api(trail, address)

  // Private fields
  #address: Address
  #state: State
  #read: Read
  #write: Write
  #fibers: Fibers
  #lineage: Lineage
  #effects: Effects

  private constructor(private trail: Trail, address: Address) {
    this.#address = address
    this.#state = createState(trail)
    this.#read = createRead(trail)
    this.#write = createWrite(trail)
    this.#fibers = createFibers(trail)
    this.#lineage = createLineage(trail)
    this.#effects = createEffects(trail)

    // Freeze for immutability
    Object.freeze(this)
    Object.freeze(this.#address)
    Object.freeze(this.#state)
    Object.freeze(this.#read)
    Object.freeze(this.#write)
    Object.freeze(this.#fibers)
    Object.freeze(this.#lineage)
    Object.freeze(this.#effects)
  }

  /** The canonical Address for this artifact. */
  get scope(): Address {
    return this.#address
  }

  /** State management for process-level data in the artifact. */
  get state(): State {
    return this.#state
  }

  /** Low-level read operations. */
  get read(): Read {
    return this.#read
  }

  /** Low-level write operations. */
  get write(): Write {
    return this.#write
  }

  /** Manages process spawning, action dispatch, fiber lifecycle, etc. */
  get fibers(): Fibers {
    return this.#fibers
  }

  /** Combined interface for commits, snapshots, merges, forks, etc. */
  get lineage(): Lineage {
    return this.#lineage
  }

  /** Provides side effect hooks like abort signals or ephemeral context. */
  get effects(): Effects {
    return this.#effects
  }

  /**
   * Create a new `Api` instance referencing the same trail and address.
   * (A cheap clone)
   */
  rebind = (): Artifact => {
    return Api.create(this.trail, this.#address)
  }

  /**
   * Return a new `Api` instance bound to a different address,
   * but sharing the same underlying environment/trail.
   */
  checkout = (address: Address): Artifact => {
    return Api.create(this.trail, address)
  }
}

// Below are factory functions to build each sub-interface.
// Replace `Promise.reject('Not implemented')` with your actual logic.

/**
 * Create a State object bound to the provided `trail`.
 * Demonstrates how you'd dispatch an action to read/write state.
 */
const createState = (trail: Trail): State => ({
  get: async <T extends ZodRecord = typeof stateSchema>(
    schema?: T,
    fallback?: z.infer<T>,
  ) => {
    const _schema = schema ?? stateSchema
    const action: Action = {
      napp: '@artifact/api',
      tool: 'state/get',
      parameters: {},
    }
    const result = await trail.push(action)
    if (result === undefined && fallback !== undefined) {
      return fallback
    }
    return _schema.parse(result) as z.infer<T>
  },

  set: async <T extends ZodRecord = typeof stateSchema>(
    state: z.infer<T>,
    schema?: T,
  ) => {
    const _schema = schema ?? stateSchema
    _schema.parse(state)
    const action: Action = {
      napp: '@artifact/api',
      tool: 'state/set',
      parameters: {},
    }
    await trail.push(action, { json: state })
  },
})

/**
 * Create a Read object bound to the provided `trail`.
 */
const createRead = (trail: Trail): Read => ({
  meta: async (path) => {
    const action: Action = {
      napp: '@artifact/api',
      tool: 'read/meta',
      parameters: { path },
    }
    return trail.push<Meta>(action)
  },

  json: async <T extends ZodTypeAny = typeof jsonSchema>(
    path: string,
    options?: { schema?: T },
  ) => {
    const { schema = jsonSchema } = options ?? {}
    // first read the file as text
    const text = await createRead(trail).text(path)
    // parse JSON
    const parsed = JSON.parse(text)
    // validate
    return schema.parse(parsed) as z.infer<T>
  },

  text: async (path) => {
    const action: Action = {
      napp: '@artifact/api',
      tool: 'read/text',
      parameters: { path },
    }
    return trail.push<string>(action)
  },

  binary: async (path) => {
    const action: Action = {
      napp: '@artifact/api',
      tool: 'read/binary',
      parameters: { path },
    }
    return trail.push<Uint8Array>(action)
  },

  exists: async (path) => {
    const action: Action = {
      napp: '@artifact/api',
      tool: 'read/exists',
      parameters: { path },
    }
    return trail.push<boolean>(action)
  },

  ls: async (path = '.') => {
    const action: Action = {
      napp: '@artifact/api',
      tool: 'read/ls',
      parameters: { path },
    }
    return trail.push<Meta[]>(action)
  },
})

/**
 * Create a Write object bound to the provided `trail`.
 */
const createWrite = (trail: Trail): Write => ({
  json: async (path, content) => {
    const text = JSON.stringify(content, null, 2)
    await createWrite(trail).text(path, text)
  },

  text: async (path, content) => {
    const action: Action = {
      napp: '@artifact/api',
      tool: 'write/text',
      parameters: { path },
    }
    await trail.push(action, { text: content })
  },

  binary: async (path, content) => {
    const action: Action = {
      napp: '@artifact/api',
      tool: 'write/binary',
      parameters: { path },
    }
    await trail.push(action, { binary: content })
  },

  rm: async (path) => {
    const action: Action = {
      napp: '@artifact/api',
      tool: 'write/rm',
      parameters: { path },
    }
    await trail.push(action)
  },

  mv: async (from, to) => {
    const action: Action = {
      napp: '@artifact/api',
      tool: 'write/mv',
      parameters: { from, to },
    }
    await trail.push(action)
  },

  cp: async (from, to) => {
    const action: Action = {
      napp: '@artifact/api',
      tool: 'write/cp',
      parameters: { from, to },
    }
    await trail.push(action)
  },
})

/**
 * Create a Fibers object bound to the provided `trail`.
 */
const createFibers = (trail: Trail): Fibers => ({
  spawn: async () => Promise.reject('Not implemented'),
  rm: async () => Promise.reject('Not implemented'),
  await: async () => Promise.reject('Not implemented'),
  mv: async () => Promise.reject('Not implemented'),
  cp: async () => Promise.reject('Not implemented'),
  nice: () => {
    throw new Error('Not implemented')
  },
  napp: () => {
    throw new Error('Not implemented')
  },

  dispatch: async (action) => {
    const wrapped: Action = {
      napp: '@artifact/api',
      tool: 'processes/dispatch',
      parameters: { action },
    }
    return trail.push<JsonValue | undefined>(wrapped)
  },

  dispatchWithMeta: async () => Promise.reject('Not implemented'),
})

/**
 * Create a combined Lineage object, merging snapshot & graph logic.
 */
const createLineage = (trail: Trail): Lineage => ({
  latest: async () => Promise.reject('Not implemented'),
  parents: async () => Promise.reject('Not implemented'),
  history: async () => Promise.reject('Not implemented'),
  diff: async () => Promise.reject('Not implemented'),

  fork: async () => Promise.reject('Not implemented'),
  merge: async () => Promise.reject('Not implemented'),
  commit: async () => Promise.reject('Not implemented'),
  reset: async () => Promise.reject('Not implemented'),
  push: async () => Promise.reject('Not implemented'),
  pull: async () => Promise.reject('Not implemented'),
  getRemotes: async () => Promise.reject('Not implemented'),
  addRemote: async () => Promise.reject('Not implemented'),
  rm: async () => Promise.reject('Not implemented'),
})

/**
 * Create an Effects object that surfaces the trail’s abort signal
 * and provides a context store for ephemeral usage.
 */
const createEffects = (trail: Trail): Effects => ({
  get signal() {
    return trail.signal
  },

  get isEffectRecovered() {
    // Example: check if we forcibly replaced a prior run
    return false
  },

  set context(value: unknown) {
    trail.context = value
  },

  get context() {
    return trail.context
  },
})
