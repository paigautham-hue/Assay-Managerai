
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Organization
 * 
 */
export type Organization = $Result.DefaultSelection<Prisma.$OrganizationPayload>
/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model InterviewSession
 * 
 */
export type InterviewSession = $Result.DefaultSelection<Prisma.$InterviewSessionPayload>
/**
 * Model TranscriptEntry
 * 
 */
export type TranscriptEntry = $Result.DefaultSelection<Prisma.$TranscriptEntryPayload>
/**
 * Model Observation
 * 
 */
export type Observation = $Result.DefaultSelection<Prisma.$ObservationPayload>
/**
 * Model AssessorVerdict
 * 
 */
export type AssessorVerdict = $Result.DefaultSelection<Prisma.$AssessorVerdictPayload>
/**
 * Model Report
 * 
 */
export type Report = $Result.DefaultSelection<Prisma.$ReportPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Organizations
 * const organizations = await prisma.organization.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Organizations
   * const organizations = await prisma.organization.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.organization`: Exposes CRUD operations for the **Organization** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Organizations
    * const organizations = await prisma.organization.findMany()
    * ```
    */
  get organization(): Prisma.OrganizationDelegate<ExtArgs>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.interviewSession`: Exposes CRUD operations for the **InterviewSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more InterviewSessions
    * const interviewSessions = await prisma.interviewSession.findMany()
    * ```
    */
  get interviewSession(): Prisma.InterviewSessionDelegate<ExtArgs>;

  /**
   * `prisma.transcriptEntry`: Exposes CRUD operations for the **TranscriptEntry** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TranscriptEntries
    * const transcriptEntries = await prisma.transcriptEntry.findMany()
    * ```
    */
  get transcriptEntry(): Prisma.TranscriptEntryDelegate<ExtArgs>;

  /**
   * `prisma.observation`: Exposes CRUD operations for the **Observation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Observations
    * const observations = await prisma.observation.findMany()
    * ```
    */
  get observation(): Prisma.ObservationDelegate<ExtArgs>;

  /**
   * `prisma.assessorVerdict`: Exposes CRUD operations for the **AssessorVerdict** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AssessorVerdicts
    * const assessorVerdicts = await prisma.assessorVerdict.findMany()
    * ```
    */
  get assessorVerdict(): Prisma.AssessorVerdictDelegate<ExtArgs>;

  /**
   * `prisma.report`: Exposes CRUD operations for the **Report** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Reports
    * const reports = await prisma.report.findMany()
    * ```
    */
  get report(): Prisma.ReportDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Organization: 'Organization',
    User: 'User',
    InterviewSession: 'InterviewSession',
    TranscriptEntry: 'TranscriptEntry',
    Observation: 'Observation',
    AssessorVerdict: 'AssessorVerdict',
    Report: 'Report'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "organization" | "user" | "interviewSession" | "transcriptEntry" | "observation" | "assessorVerdict" | "report"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Organization: {
        payload: Prisma.$OrganizationPayload<ExtArgs>
        fields: Prisma.OrganizationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OrganizationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OrganizationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>
          }
          findFirst: {
            args: Prisma.OrganizationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OrganizationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>
          }
          findMany: {
            args: Prisma.OrganizationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>[]
          }
          create: {
            args: Prisma.OrganizationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>
          }
          createMany: {
            args: Prisma.OrganizationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OrganizationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>[]
          }
          delete: {
            args: Prisma.OrganizationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>
          }
          update: {
            args: Prisma.OrganizationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>
          }
          deleteMany: {
            args: Prisma.OrganizationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OrganizationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.OrganizationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>
          }
          aggregate: {
            args: Prisma.OrganizationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOrganization>
          }
          groupBy: {
            args: Prisma.OrganizationGroupByArgs<ExtArgs>
            result: $Utils.Optional<OrganizationGroupByOutputType>[]
          }
          count: {
            args: Prisma.OrganizationCountArgs<ExtArgs>
            result: $Utils.Optional<OrganizationCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      InterviewSession: {
        payload: Prisma.$InterviewSessionPayload<ExtArgs>
        fields: Prisma.InterviewSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InterviewSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InterviewSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InterviewSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InterviewSessionPayload>
          }
          findFirst: {
            args: Prisma.InterviewSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InterviewSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InterviewSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InterviewSessionPayload>
          }
          findMany: {
            args: Prisma.InterviewSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InterviewSessionPayload>[]
          }
          create: {
            args: Prisma.InterviewSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InterviewSessionPayload>
          }
          createMany: {
            args: Prisma.InterviewSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InterviewSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InterviewSessionPayload>[]
          }
          delete: {
            args: Prisma.InterviewSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InterviewSessionPayload>
          }
          update: {
            args: Prisma.InterviewSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InterviewSessionPayload>
          }
          deleteMany: {
            args: Prisma.InterviewSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InterviewSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.InterviewSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InterviewSessionPayload>
          }
          aggregate: {
            args: Prisma.InterviewSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInterviewSession>
          }
          groupBy: {
            args: Prisma.InterviewSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<InterviewSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.InterviewSessionCountArgs<ExtArgs>
            result: $Utils.Optional<InterviewSessionCountAggregateOutputType> | number
          }
        }
      }
      TranscriptEntry: {
        payload: Prisma.$TranscriptEntryPayload<ExtArgs>
        fields: Prisma.TranscriptEntryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TranscriptEntryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptEntryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TranscriptEntryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptEntryPayload>
          }
          findFirst: {
            args: Prisma.TranscriptEntryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptEntryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TranscriptEntryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptEntryPayload>
          }
          findMany: {
            args: Prisma.TranscriptEntryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptEntryPayload>[]
          }
          create: {
            args: Prisma.TranscriptEntryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptEntryPayload>
          }
          createMany: {
            args: Prisma.TranscriptEntryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TranscriptEntryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptEntryPayload>[]
          }
          delete: {
            args: Prisma.TranscriptEntryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptEntryPayload>
          }
          update: {
            args: Prisma.TranscriptEntryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptEntryPayload>
          }
          deleteMany: {
            args: Prisma.TranscriptEntryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TranscriptEntryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TranscriptEntryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TranscriptEntryPayload>
          }
          aggregate: {
            args: Prisma.TranscriptEntryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTranscriptEntry>
          }
          groupBy: {
            args: Prisma.TranscriptEntryGroupByArgs<ExtArgs>
            result: $Utils.Optional<TranscriptEntryGroupByOutputType>[]
          }
          count: {
            args: Prisma.TranscriptEntryCountArgs<ExtArgs>
            result: $Utils.Optional<TranscriptEntryCountAggregateOutputType> | number
          }
        }
      }
      Observation: {
        payload: Prisma.$ObservationPayload<ExtArgs>
        fields: Prisma.ObservationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ObservationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObservationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ObservationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObservationPayload>
          }
          findFirst: {
            args: Prisma.ObservationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObservationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ObservationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObservationPayload>
          }
          findMany: {
            args: Prisma.ObservationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObservationPayload>[]
          }
          create: {
            args: Prisma.ObservationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObservationPayload>
          }
          createMany: {
            args: Prisma.ObservationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ObservationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObservationPayload>[]
          }
          delete: {
            args: Prisma.ObservationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObservationPayload>
          }
          update: {
            args: Prisma.ObservationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObservationPayload>
          }
          deleteMany: {
            args: Prisma.ObservationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ObservationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ObservationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ObservationPayload>
          }
          aggregate: {
            args: Prisma.ObservationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateObservation>
          }
          groupBy: {
            args: Prisma.ObservationGroupByArgs<ExtArgs>
            result: $Utils.Optional<ObservationGroupByOutputType>[]
          }
          count: {
            args: Prisma.ObservationCountArgs<ExtArgs>
            result: $Utils.Optional<ObservationCountAggregateOutputType> | number
          }
        }
      }
      AssessorVerdict: {
        payload: Prisma.$AssessorVerdictPayload<ExtArgs>
        fields: Prisma.AssessorVerdictFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AssessorVerdictFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssessorVerdictPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AssessorVerdictFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssessorVerdictPayload>
          }
          findFirst: {
            args: Prisma.AssessorVerdictFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssessorVerdictPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AssessorVerdictFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssessorVerdictPayload>
          }
          findMany: {
            args: Prisma.AssessorVerdictFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssessorVerdictPayload>[]
          }
          create: {
            args: Prisma.AssessorVerdictCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssessorVerdictPayload>
          }
          createMany: {
            args: Prisma.AssessorVerdictCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AssessorVerdictCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssessorVerdictPayload>[]
          }
          delete: {
            args: Prisma.AssessorVerdictDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssessorVerdictPayload>
          }
          update: {
            args: Prisma.AssessorVerdictUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssessorVerdictPayload>
          }
          deleteMany: {
            args: Prisma.AssessorVerdictDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AssessorVerdictUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AssessorVerdictUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssessorVerdictPayload>
          }
          aggregate: {
            args: Prisma.AssessorVerdictAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAssessorVerdict>
          }
          groupBy: {
            args: Prisma.AssessorVerdictGroupByArgs<ExtArgs>
            result: $Utils.Optional<AssessorVerdictGroupByOutputType>[]
          }
          count: {
            args: Prisma.AssessorVerdictCountArgs<ExtArgs>
            result: $Utils.Optional<AssessorVerdictCountAggregateOutputType> | number
          }
        }
      }
      Report: {
        payload: Prisma.$ReportPayload<ExtArgs>
        fields: Prisma.ReportFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReportFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReportFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>
          }
          findFirst: {
            args: Prisma.ReportFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReportFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>
          }
          findMany: {
            args: Prisma.ReportFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>[]
          }
          create: {
            args: Prisma.ReportCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>
          }
          createMany: {
            args: Prisma.ReportCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ReportCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>[]
          }
          delete: {
            args: Prisma.ReportDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>
          }
          update: {
            args: Prisma.ReportUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>
          }
          deleteMany: {
            args: Prisma.ReportDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReportUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ReportUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReportPayload>
          }
          aggregate: {
            args: Prisma.ReportAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReport>
          }
          groupBy: {
            args: Prisma.ReportGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReportGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReportCountArgs<ExtArgs>
            result: $Utils.Optional<ReportCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type OrganizationCountOutputType
   */

  export type OrganizationCountOutputType = {
    users: number
    sessions: number
  }

  export type OrganizationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | OrganizationCountOutputTypeCountUsersArgs
    sessions?: boolean | OrganizationCountOutputTypeCountSessionsArgs
  }

  // Custom InputTypes
  /**
   * OrganizationCountOutputType without action
   */
  export type OrganizationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganizationCountOutputType
     */
    select?: OrganizationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * OrganizationCountOutputType without action
   */
  export type OrganizationCountOutputTypeCountUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }

  /**
   * OrganizationCountOutputType without action
   */
  export type OrganizationCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InterviewSessionWhereInput
  }


  /**
   * Count Type InterviewSessionCountOutputType
   */

  export type InterviewSessionCountOutputType = {
    transcripts: number
    observations: number
    verdicts: number
    reports: number
  }

  export type InterviewSessionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    transcripts?: boolean | InterviewSessionCountOutputTypeCountTranscriptsArgs
    observations?: boolean | InterviewSessionCountOutputTypeCountObservationsArgs
    verdicts?: boolean | InterviewSessionCountOutputTypeCountVerdictsArgs
    reports?: boolean | InterviewSessionCountOutputTypeCountReportsArgs
  }

  // Custom InputTypes
  /**
   * InterviewSessionCountOutputType without action
   */
  export type InterviewSessionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InterviewSessionCountOutputType
     */
    select?: InterviewSessionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * InterviewSessionCountOutputType without action
   */
  export type InterviewSessionCountOutputTypeCountTranscriptsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TranscriptEntryWhereInput
  }

  /**
   * InterviewSessionCountOutputType without action
   */
  export type InterviewSessionCountOutputTypeCountObservationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ObservationWhereInput
  }

  /**
   * InterviewSessionCountOutputType without action
   */
  export type InterviewSessionCountOutputTypeCountVerdictsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AssessorVerdictWhereInput
  }

  /**
   * InterviewSessionCountOutputType without action
   */
  export type InterviewSessionCountOutputTypeCountReportsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReportWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Organization
   */

  export type AggregateOrganization = {
    _count: OrganizationCountAggregateOutputType | null
    _min: OrganizationMinAggregateOutputType | null
    _max: OrganizationMaxAggregateOutputType | null
  }

  export type OrganizationMinAggregateOutputType = {
    id: string | null
    name: string | null
    createdAt: Date | null
  }

  export type OrganizationMaxAggregateOutputType = {
    id: string | null
    name: string | null
    createdAt: Date | null
  }

  export type OrganizationCountAggregateOutputType = {
    id: number
    name: number
    settings: number
    createdAt: number
    _all: number
  }


  export type OrganizationMinAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
  }

  export type OrganizationMaxAggregateInputType = {
    id?: true
    name?: true
    createdAt?: true
  }

  export type OrganizationCountAggregateInputType = {
    id?: true
    name?: true
    settings?: true
    createdAt?: true
    _all?: true
  }

  export type OrganizationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Organization to aggregate.
     */
    where?: OrganizationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Organizations to fetch.
     */
    orderBy?: OrganizationOrderByWithRelationInput | OrganizationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OrganizationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Organizations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Organizations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Organizations
    **/
    _count?: true | OrganizationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OrganizationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OrganizationMaxAggregateInputType
  }

  export type GetOrganizationAggregateType<T extends OrganizationAggregateArgs> = {
        [P in keyof T & keyof AggregateOrganization]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOrganization[P]>
      : GetScalarType<T[P], AggregateOrganization[P]>
  }




  export type OrganizationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrganizationWhereInput
    orderBy?: OrganizationOrderByWithAggregationInput | OrganizationOrderByWithAggregationInput[]
    by: OrganizationScalarFieldEnum[] | OrganizationScalarFieldEnum
    having?: OrganizationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OrganizationCountAggregateInputType | true
    _min?: OrganizationMinAggregateInputType
    _max?: OrganizationMaxAggregateInputType
  }

  export type OrganizationGroupByOutputType = {
    id: string
    name: string
    settings: JsonValue
    createdAt: Date
    _count: OrganizationCountAggregateOutputType | null
    _min: OrganizationMinAggregateOutputType | null
    _max: OrganizationMaxAggregateOutputType | null
  }

  type GetOrganizationGroupByPayload<T extends OrganizationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OrganizationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OrganizationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OrganizationGroupByOutputType[P]>
            : GetScalarType<T[P], OrganizationGroupByOutputType[P]>
        }
      >
    >


  export type OrganizationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    settings?: boolean
    createdAt?: boolean
    users?: boolean | Organization$usersArgs<ExtArgs>
    sessions?: boolean | Organization$sessionsArgs<ExtArgs>
    _count?: boolean | OrganizationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["organization"]>

  export type OrganizationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    settings?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["organization"]>

  export type OrganizationSelectScalar = {
    id?: boolean
    name?: boolean
    settings?: boolean
    createdAt?: boolean
  }

  export type OrganizationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | Organization$usersArgs<ExtArgs>
    sessions?: boolean | Organization$sessionsArgs<ExtArgs>
    _count?: boolean | OrganizationCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type OrganizationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $OrganizationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Organization"
    objects: {
      users: Prisma.$UserPayload<ExtArgs>[]
      sessions: Prisma.$InterviewSessionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      settings: Prisma.JsonValue
      createdAt: Date
    }, ExtArgs["result"]["organization"]>
    composites: {}
  }

  type OrganizationGetPayload<S extends boolean | null | undefined | OrganizationDefaultArgs> = $Result.GetResult<Prisma.$OrganizationPayload, S>

  type OrganizationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<OrganizationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: OrganizationCountAggregateInputType | true
    }

  export interface OrganizationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Organization'], meta: { name: 'Organization' } }
    /**
     * Find zero or one Organization that matches the filter.
     * @param {OrganizationFindUniqueArgs} args - Arguments to find a Organization
     * @example
     * // Get one Organization
     * const organization = await prisma.organization.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OrganizationFindUniqueArgs>(args: SelectSubset<T, OrganizationFindUniqueArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Organization that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {OrganizationFindUniqueOrThrowArgs} args - Arguments to find a Organization
     * @example
     * // Get one Organization
     * const organization = await prisma.organization.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OrganizationFindUniqueOrThrowArgs>(args: SelectSubset<T, OrganizationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Organization that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationFindFirstArgs} args - Arguments to find a Organization
     * @example
     * // Get one Organization
     * const organization = await prisma.organization.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OrganizationFindFirstArgs>(args?: SelectSubset<T, OrganizationFindFirstArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Organization that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationFindFirstOrThrowArgs} args - Arguments to find a Organization
     * @example
     * // Get one Organization
     * const organization = await prisma.organization.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OrganizationFindFirstOrThrowArgs>(args?: SelectSubset<T, OrganizationFindFirstOrThrowArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Organizations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Organizations
     * const organizations = await prisma.organization.findMany()
     * 
     * // Get first 10 Organizations
     * const organizations = await prisma.organization.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const organizationWithIdOnly = await prisma.organization.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OrganizationFindManyArgs>(args?: SelectSubset<T, OrganizationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Organization.
     * @param {OrganizationCreateArgs} args - Arguments to create a Organization.
     * @example
     * // Create one Organization
     * const Organization = await prisma.organization.create({
     *   data: {
     *     // ... data to create a Organization
     *   }
     * })
     * 
     */
    create<T extends OrganizationCreateArgs>(args: SelectSubset<T, OrganizationCreateArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Organizations.
     * @param {OrganizationCreateManyArgs} args - Arguments to create many Organizations.
     * @example
     * // Create many Organizations
     * const organization = await prisma.organization.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OrganizationCreateManyArgs>(args?: SelectSubset<T, OrganizationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Organizations and returns the data saved in the database.
     * @param {OrganizationCreateManyAndReturnArgs} args - Arguments to create many Organizations.
     * @example
     * // Create many Organizations
     * const organization = await prisma.organization.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Organizations and only return the `id`
     * const organizationWithIdOnly = await prisma.organization.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OrganizationCreateManyAndReturnArgs>(args?: SelectSubset<T, OrganizationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Organization.
     * @param {OrganizationDeleteArgs} args - Arguments to delete one Organization.
     * @example
     * // Delete one Organization
     * const Organization = await prisma.organization.delete({
     *   where: {
     *     // ... filter to delete one Organization
     *   }
     * })
     * 
     */
    delete<T extends OrganizationDeleteArgs>(args: SelectSubset<T, OrganizationDeleteArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Organization.
     * @param {OrganizationUpdateArgs} args - Arguments to update one Organization.
     * @example
     * // Update one Organization
     * const organization = await prisma.organization.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OrganizationUpdateArgs>(args: SelectSubset<T, OrganizationUpdateArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Organizations.
     * @param {OrganizationDeleteManyArgs} args - Arguments to filter Organizations to delete.
     * @example
     * // Delete a few Organizations
     * const { count } = await prisma.organization.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OrganizationDeleteManyArgs>(args?: SelectSubset<T, OrganizationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Organizations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Organizations
     * const organization = await prisma.organization.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OrganizationUpdateManyArgs>(args: SelectSubset<T, OrganizationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Organization.
     * @param {OrganizationUpsertArgs} args - Arguments to update or create a Organization.
     * @example
     * // Update or create a Organization
     * const organization = await prisma.organization.upsert({
     *   create: {
     *     // ... data to create a Organization
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Organization we want to update
     *   }
     * })
     */
    upsert<T extends OrganizationUpsertArgs>(args: SelectSubset<T, OrganizationUpsertArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Organizations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationCountArgs} args - Arguments to filter Organizations to count.
     * @example
     * // Count the number of Organizations
     * const count = await prisma.organization.count({
     *   where: {
     *     // ... the filter for the Organizations we want to count
     *   }
     * })
    **/
    count<T extends OrganizationCountArgs>(
      args?: Subset<T, OrganizationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OrganizationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Organization.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OrganizationAggregateArgs>(args: Subset<T, OrganizationAggregateArgs>): Prisma.PrismaPromise<GetOrganizationAggregateType<T>>

    /**
     * Group by Organization.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OrganizationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OrganizationGroupByArgs['orderBy'] }
        : { orderBy?: OrganizationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OrganizationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrganizationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Organization model
   */
  readonly fields: OrganizationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Organization.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OrganizationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    users<T extends Organization$usersArgs<ExtArgs> = {}>(args?: Subset<T, Organization$usersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany"> | Null>
    sessions<T extends Organization$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, Organization$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InterviewSessionPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Organization model
   */ 
  interface OrganizationFieldRefs {
    readonly id: FieldRef<"Organization", 'String'>
    readonly name: FieldRef<"Organization", 'String'>
    readonly settings: FieldRef<"Organization", 'Json'>
    readonly createdAt: FieldRef<"Organization", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Organization findUnique
   */
  export type OrganizationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * Filter, which Organization to fetch.
     */
    where: OrganizationWhereUniqueInput
  }

  /**
   * Organization findUniqueOrThrow
   */
  export type OrganizationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * Filter, which Organization to fetch.
     */
    where: OrganizationWhereUniqueInput
  }

  /**
   * Organization findFirst
   */
  export type OrganizationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * Filter, which Organization to fetch.
     */
    where?: OrganizationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Organizations to fetch.
     */
    orderBy?: OrganizationOrderByWithRelationInput | OrganizationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Organizations.
     */
    cursor?: OrganizationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Organizations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Organizations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Organizations.
     */
    distinct?: OrganizationScalarFieldEnum | OrganizationScalarFieldEnum[]
  }

  /**
   * Organization findFirstOrThrow
   */
  export type OrganizationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * Filter, which Organization to fetch.
     */
    where?: OrganizationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Organizations to fetch.
     */
    orderBy?: OrganizationOrderByWithRelationInput | OrganizationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Organizations.
     */
    cursor?: OrganizationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Organizations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Organizations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Organizations.
     */
    distinct?: OrganizationScalarFieldEnum | OrganizationScalarFieldEnum[]
  }

  /**
   * Organization findMany
   */
  export type OrganizationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * Filter, which Organizations to fetch.
     */
    where?: OrganizationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Organizations to fetch.
     */
    orderBy?: OrganizationOrderByWithRelationInput | OrganizationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Organizations.
     */
    cursor?: OrganizationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Organizations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Organizations.
     */
    skip?: number
    distinct?: OrganizationScalarFieldEnum | OrganizationScalarFieldEnum[]
  }

  /**
   * Organization create
   */
  export type OrganizationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * The data needed to create a Organization.
     */
    data: XOR<OrganizationCreateInput, OrganizationUncheckedCreateInput>
  }

  /**
   * Organization createMany
   */
  export type OrganizationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Organizations.
     */
    data: OrganizationCreateManyInput | OrganizationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Organization createManyAndReturn
   */
  export type OrganizationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Organizations.
     */
    data: OrganizationCreateManyInput | OrganizationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Organization update
   */
  export type OrganizationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * The data needed to update a Organization.
     */
    data: XOR<OrganizationUpdateInput, OrganizationUncheckedUpdateInput>
    /**
     * Choose, which Organization to update.
     */
    where: OrganizationWhereUniqueInput
  }

  /**
   * Organization updateMany
   */
  export type OrganizationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Organizations.
     */
    data: XOR<OrganizationUpdateManyMutationInput, OrganizationUncheckedUpdateManyInput>
    /**
     * Filter which Organizations to update
     */
    where?: OrganizationWhereInput
  }

  /**
   * Organization upsert
   */
  export type OrganizationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * The filter to search for the Organization to update in case it exists.
     */
    where: OrganizationWhereUniqueInput
    /**
     * In case the Organization found by the `where` argument doesn't exist, create a new Organization with this data.
     */
    create: XOR<OrganizationCreateInput, OrganizationUncheckedCreateInput>
    /**
     * In case the Organization was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OrganizationUpdateInput, OrganizationUncheckedUpdateInput>
  }

  /**
   * Organization delete
   */
  export type OrganizationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * Filter which Organization to delete.
     */
    where: OrganizationWhereUniqueInput
  }

  /**
   * Organization deleteMany
   */
  export type OrganizationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Organizations to delete
     */
    where?: OrganizationWhereInput
  }

  /**
   * Organization.users
   */
  export type Organization$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * Organization.sessions
   */
  export type Organization$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InterviewSession
     */
    select?: InterviewSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InterviewSessionInclude<ExtArgs> | null
    where?: InterviewSessionWhereInput
    orderBy?: InterviewSessionOrderByWithRelationInput | InterviewSessionOrderByWithRelationInput[]
    cursor?: InterviewSessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InterviewSessionScalarFieldEnum | InterviewSessionScalarFieldEnum[]
  }

  /**
   * Organization without action
   */
  export type OrganizationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    role: string | null
    organizationId: string | null
    createdAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    role: string | null
    organizationId: string | null
    createdAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    name: number
    role: number
    organizationId: number
    createdAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    name?: true
    role?: true
    organizationId?: true
    createdAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    name?: true
    role?: true
    organizationId?: true
    createdAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    name?: true
    role?: true
    organizationId?: true
    createdAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    name: string
    role: string
    organizationId: string | null
    createdAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    role?: boolean
    organizationId?: boolean
    createdAt?: boolean
    organization?: boolean | User$organizationArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    role?: boolean
    organizationId?: boolean
    createdAt?: boolean
    organization?: boolean | User$organizationArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    name?: boolean
    role?: boolean
    organizationId?: boolean
    createdAt?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organization?: boolean | User$organizationArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organization?: boolean | User$organizationArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      organization: Prisma.$OrganizationPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      name: string
      role: string
      organizationId: string | null
      createdAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    organization<T extends User$organizationArgs<ExtArgs> = {}>(args?: Subset<T, User$organizationArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'String'>
    readonly organizationId: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User.organization
   */
  export type User$organizationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    where?: OrganizationWhereInput
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model InterviewSession
   */

  export type AggregateInterviewSession = {
    _count: InterviewSessionCountAggregateOutputType | null
    _min: InterviewSessionMinAggregateOutputType | null
    _max: InterviewSessionMaxAggregateOutputType | null
  }

  export type InterviewSessionMinAggregateOutputType = {
    id: string | null
    organizationId: string | null
    status: string | null
    startedAt: Date | null
    endedAt: Date | null
    voiceProvider: string | null
    createdAt: Date | null
  }

  export type InterviewSessionMaxAggregateOutputType = {
    id: string | null
    organizationId: string | null
    status: string | null
    startedAt: Date | null
    endedAt: Date | null
    voiceProvider: string | null
    createdAt: Date | null
  }

  export type InterviewSessionCountAggregateOutputType = {
    id: number
    organizationId: number
    setup: number
    status: number
    startedAt: number
    endedAt: number
    voiceProvider: number
    createdAt: number
    _all: number
  }


  export type InterviewSessionMinAggregateInputType = {
    id?: true
    organizationId?: true
    status?: true
    startedAt?: true
    endedAt?: true
    voiceProvider?: true
    createdAt?: true
  }

  export type InterviewSessionMaxAggregateInputType = {
    id?: true
    organizationId?: true
    status?: true
    startedAt?: true
    endedAt?: true
    voiceProvider?: true
    createdAt?: true
  }

  export type InterviewSessionCountAggregateInputType = {
    id?: true
    organizationId?: true
    setup?: true
    status?: true
    startedAt?: true
    endedAt?: true
    voiceProvider?: true
    createdAt?: true
    _all?: true
  }

  export type InterviewSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InterviewSession to aggregate.
     */
    where?: InterviewSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InterviewSessions to fetch.
     */
    orderBy?: InterviewSessionOrderByWithRelationInput | InterviewSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InterviewSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InterviewSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InterviewSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned InterviewSessions
    **/
    _count?: true | InterviewSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InterviewSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InterviewSessionMaxAggregateInputType
  }

  export type GetInterviewSessionAggregateType<T extends InterviewSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateInterviewSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInterviewSession[P]>
      : GetScalarType<T[P], AggregateInterviewSession[P]>
  }




  export type InterviewSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InterviewSessionWhereInput
    orderBy?: InterviewSessionOrderByWithAggregationInput | InterviewSessionOrderByWithAggregationInput[]
    by: InterviewSessionScalarFieldEnum[] | InterviewSessionScalarFieldEnum
    having?: InterviewSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InterviewSessionCountAggregateInputType | true
    _min?: InterviewSessionMinAggregateInputType
    _max?: InterviewSessionMaxAggregateInputType
  }

  export type InterviewSessionGroupByOutputType = {
    id: string
    organizationId: string | null
    setup: JsonValue
    status: string
    startedAt: Date | null
    endedAt: Date | null
    voiceProvider: string
    createdAt: Date
    _count: InterviewSessionCountAggregateOutputType | null
    _min: InterviewSessionMinAggregateOutputType | null
    _max: InterviewSessionMaxAggregateOutputType | null
  }

  type GetInterviewSessionGroupByPayload<T extends InterviewSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InterviewSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InterviewSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InterviewSessionGroupByOutputType[P]>
            : GetScalarType<T[P], InterviewSessionGroupByOutputType[P]>
        }
      >
    >


  export type InterviewSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    organizationId?: boolean
    setup?: boolean
    status?: boolean
    startedAt?: boolean
    endedAt?: boolean
    voiceProvider?: boolean
    createdAt?: boolean
    organization?: boolean | InterviewSession$organizationArgs<ExtArgs>
    transcripts?: boolean | InterviewSession$transcriptsArgs<ExtArgs>
    observations?: boolean | InterviewSession$observationsArgs<ExtArgs>
    verdicts?: boolean | InterviewSession$verdictsArgs<ExtArgs>
    reports?: boolean | InterviewSession$reportsArgs<ExtArgs>
    _count?: boolean | InterviewSessionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["interviewSession"]>

  export type InterviewSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    organizationId?: boolean
    setup?: boolean
    status?: boolean
    startedAt?: boolean
    endedAt?: boolean
    voiceProvider?: boolean
    createdAt?: boolean
    organization?: boolean | InterviewSession$organizationArgs<ExtArgs>
  }, ExtArgs["result"]["interviewSession"]>

  export type InterviewSessionSelectScalar = {
    id?: boolean
    organizationId?: boolean
    setup?: boolean
    status?: boolean
    startedAt?: boolean
    endedAt?: boolean
    voiceProvider?: boolean
    createdAt?: boolean
  }

  export type InterviewSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organization?: boolean | InterviewSession$organizationArgs<ExtArgs>
    transcripts?: boolean | InterviewSession$transcriptsArgs<ExtArgs>
    observations?: boolean | InterviewSession$observationsArgs<ExtArgs>
    verdicts?: boolean | InterviewSession$verdictsArgs<ExtArgs>
    reports?: boolean | InterviewSession$reportsArgs<ExtArgs>
    _count?: boolean | InterviewSessionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type InterviewSessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    organization?: boolean | InterviewSession$organizationArgs<ExtArgs>
  }

  export type $InterviewSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "InterviewSession"
    objects: {
      organization: Prisma.$OrganizationPayload<ExtArgs> | null
      transcripts: Prisma.$TranscriptEntryPayload<ExtArgs>[]
      observations: Prisma.$ObservationPayload<ExtArgs>[]
      verdicts: Prisma.$AssessorVerdictPayload<ExtArgs>[]
      reports: Prisma.$ReportPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      organizationId: string | null
      setup: Prisma.JsonValue
      status: string
      startedAt: Date | null
      endedAt: Date | null
      voiceProvider: string
      createdAt: Date
    }, ExtArgs["result"]["interviewSession"]>
    composites: {}
  }

  type InterviewSessionGetPayload<S extends boolean | null | undefined | InterviewSessionDefaultArgs> = $Result.GetResult<Prisma.$InterviewSessionPayload, S>

  type InterviewSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<InterviewSessionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: InterviewSessionCountAggregateInputType | true
    }

  export interface InterviewSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['InterviewSession'], meta: { name: 'InterviewSession' } }
    /**
     * Find zero or one InterviewSession that matches the filter.
     * @param {InterviewSessionFindUniqueArgs} args - Arguments to find a InterviewSession
     * @example
     * // Get one InterviewSession
     * const interviewSession = await prisma.interviewSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InterviewSessionFindUniqueArgs>(args: SelectSubset<T, InterviewSessionFindUniqueArgs<ExtArgs>>): Prisma__InterviewSessionClient<$Result.GetResult<Prisma.$InterviewSessionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one InterviewSession that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {InterviewSessionFindUniqueOrThrowArgs} args - Arguments to find a InterviewSession
     * @example
     * // Get one InterviewSession
     * const interviewSession = await prisma.interviewSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InterviewSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, InterviewSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InterviewSessionClient<$Result.GetResult<Prisma.$InterviewSessionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first InterviewSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InterviewSessionFindFirstArgs} args - Arguments to find a InterviewSession
     * @example
     * // Get one InterviewSession
     * const interviewSession = await prisma.interviewSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InterviewSessionFindFirstArgs>(args?: SelectSubset<T, InterviewSessionFindFirstArgs<ExtArgs>>): Prisma__InterviewSessionClient<$Result.GetResult<Prisma.$InterviewSessionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first InterviewSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InterviewSessionFindFirstOrThrowArgs} args - Arguments to find a InterviewSession
     * @example
     * // Get one InterviewSession
     * const interviewSession = await prisma.interviewSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InterviewSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, InterviewSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__InterviewSessionClient<$Result.GetResult<Prisma.$InterviewSessionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more InterviewSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InterviewSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all InterviewSessions
     * const interviewSessions = await prisma.interviewSession.findMany()
     * 
     * // Get first 10 InterviewSessions
     * const interviewSessions = await prisma.interviewSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const interviewSessionWithIdOnly = await prisma.interviewSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InterviewSessionFindManyArgs>(args?: SelectSubset<T, InterviewSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InterviewSessionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a InterviewSession.
     * @param {InterviewSessionCreateArgs} args - Arguments to create a InterviewSession.
     * @example
     * // Create one InterviewSession
     * const InterviewSession = await prisma.interviewSession.create({
     *   data: {
     *     // ... data to create a InterviewSession
     *   }
     * })
     * 
     */
    create<T extends InterviewSessionCreateArgs>(args: SelectSubset<T, InterviewSessionCreateArgs<ExtArgs>>): Prisma__InterviewSessionClient<$Result.GetResult<Prisma.$InterviewSessionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many InterviewSessions.
     * @param {InterviewSessionCreateManyArgs} args - Arguments to create many InterviewSessions.
     * @example
     * // Create many InterviewSessions
     * const interviewSession = await prisma.interviewSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InterviewSessionCreateManyArgs>(args?: SelectSubset<T, InterviewSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many InterviewSessions and returns the data saved in the database.
     * @param {InterviewSessionCreateManyAndReturnArgs} args - Arguments to create many InterviewSessions.
     * @example
     * // Create many InterviewSessions
     * const interviewSession = await prisma.interviewSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many InterviewSessions and only return the `id`
     * const interviewSessionWithIdOnly = await prisma.interviewSession.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InterviewSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, InterviewSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InterviewSessionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a InterviewSession.
     * @param {InterviewSessionDeleteArgs} args - Arguments to delete one InterviewSession.
     * @example
     * // Delete one InterviewSession
     * const InterviewSession = await prisma.interviewSession.delete({
     *   where: {
     *     // ... filter to delete one InterviewSession
     *   }
     * })
     * 
     */
    delete<T extends InterviewSessionDeleteArgs>(args: SelectSubset<T, InterviewSessionDeleteArgs<ExtArgs>>): Prisma__InterviewSessionClient<$Result.GetResult<Prisma.$InterviewSessionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one InterviewSession.
     * @param {InterviewSessionUpdateArgs} args - Arguments to update one InterviewSession.
     * @example
     * // Update one InterviewSession
     * const interviewSession = await prisma.interviewSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InterviewSessionUpdateArgs>(args: SelectSubset<T, InterviewSessionUpdateArgs<ExtArgs>>): Prisma__InterviewSessionClient<$Result.GetResult<Prisma.$InterviewSessionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more InterviewSessions.
     * @param {InterviewSessionDeleteManyArgs} args - Arguments to filter InterviewSessions to delete.
     * @example
     * // Delete a few InterviewSessions
     * const { count } = await prisma.interviewSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InterviewSessionDeleteManyArgs>(args?: SelectSubset<T, InterviewSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more InterviewSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InterviewSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many InterviewSessions
     * const interviewSession = await prisma.interviewSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InterviewSessionUpdateManyArgs>(args: SelectSubset<T, InterviewSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one InterviewSession.
     * @param {InterviewSessionUpsertArgs} args - Arguments to update or create a InterviewSession.
     * @example
     * // Update or create a InterviewSession
     * const interviewSession = await prisma.interviewSession.upsert({
     *   create: {
     *     // ... data to create a InterviewSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the InterviewSession we want to update
     *   }
     * })
     */
    upsert<T extends InterviewSessionUpsertArgs>(args: SelectSubset<T, InterviewSessionUpsertArgs<ExtArgs>>): Prisma__InterviewSessionClient<$Result.GetResult<Prisma.$InterviewSessionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of InterviewSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InterviewSessionCountArgs} args - Arguments to filter InterviewSessions to count.
     * @example
     * // Count the number of InterviewSessions
     * const count = await prisma.interviewSession.count({
     *   where: {
     *     // ... the filter for the InterviewSessions we want to count
     *   }
     * })
    **/
    count<T extends InterviewSessionCountArgs>(
      args?: Subset<T, InterviewSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InterviewSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a InterviewSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InterviewSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InterviewSessionAggregateArgs>(args: Subset<T, InterviewSessionAggregateArgs>): Prisma.PrismaPromise<GetInterviewSessionAggregateType<T>>

    /**
     * Group by InterviewSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InterviewSessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends InterviewSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InterviewSessionGroupByArgs['orderBy'] }
        : { orderBy?: InterviewSessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, InterviewSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInterviewSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the InterviewSession model
   */
  readonly fields: InterviewSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for InterviewSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InterviewSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    organization<T extends InterviewSession$organizationArgs<ExtArgs> = {}>(args?: Subset<T, InterviewSession$organizationArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    transcripts<T extends InterviewSession$transcriptsArgs<ExtArgs> = {}>(args?: Subset<T, InterviewSession$transcriptsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TranscriptEntryPayload<ExtArgs>, T, "findMany"> | Null>
    observations<T extends InterviewSession$observationsArgs<ExtArgs> = {}>(args?: Subset<T, InterviewSession$observationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ObservationPayload<ExtArgs>, T, "findMany"> | Null>
    verdicts<T extends InterviewSession$verdictsArgs<ExtArgs> = {}>(args?: Subset<T, InterviewSession$verdictsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssessorVerdictPayload<ExtArgs>, T, "findMany"> | Null>
    reports<T extends InterviewSession$reportsArgs<ExtArgs> = {}>(args?: Subset<T, InterviewSession$reportsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the InterviewSession model
   */ 
  interface InterviewSessionFieldRefs {
    readonly id: FieldRef<"InterviewSession", 'String'>
    readonly organizationId: FieldRef<"InterviewSession", 'String'>
    readonly setup: FieldRef<"InterviewSession", 'Json'>
    readonly status: FieldRef<"InterviewSession", 'String'>
    readonly startedAt: FieldRef<"InterviewSession", 'DateTime'>
    readonly endedAt: FieldRef<"InterviewSession", 'DateTime'>
    readonly voiceProvider: FieldRef<"InterviewSession", 'String'>
    readonly createdAt: FieldRef<"InterviewSession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * InterviewSession findUnique
   */
  export type InterviewSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InterviewSession
     */
    select?: InterviewSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InterviewSessionInclude<ExtArgs> | null
    /**
     * Filter, which InterviewSession to fetch.
     */
    where: InterviewSessionWhereUniqueInput
  }

  /**
   * InterviewSession findUniqueOrThrow
   */
  export type InterviewSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InterviewSession
     */
    select?: InterviewSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InterviewSessionInclude<ExtArgs> | null
    /**
     * Filter, which InterviewSession to fetch.
     */
    where: InterviewSessionWhereUniqueInput
  }

  /**
   * InterviewSession findFirst
   */
  export type InterviewSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InterviewSession
     */
    select?: InterviewSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InterviewSessionInclude<ExtArgs> | null
    /**
     * Filter, which InterviewSession to fetch.
     */
    where?: InterviewSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InterviewSessions to fetch.
     */
    orderBy?: InterviewSessionOrderByWithRelationInput | InterviewSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InterviewSessions.
     */
    cursor?: InterviewSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InterviewSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InterviewSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InterviewSessions.
     */
    distinct?: InterviewSessionScalarFieldEnum | InterviewSessionScalarFieldEnum[]
  }

  /**
   * InterviewSession findFirstOrThrow
   */
  export type InterviewSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InterviewSession
     */
    select?: InterviewSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InterviewSessionInclude<ExtArgs> | null
    /**
     * Filter, which InterviewSession to fetch.
     */
    where?: InterviewSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InterviewSessions to fetch.
     */
    orderBy?: InterviewSessionOrderByWithRelationInput | InterviewSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for InterviewSessions.
     */
    cursor?: InterviewSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InterviewSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InterviewSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of InterviewSessions.
     */
    distinct?: InterviewSessionScalarFieldEnum | InterviewSessionScalarFieldEnum[]
  }

  /**
   * InterviewSession findMany
   */
  export type InterviewSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InterviewSession
     */
    select?: InterviewSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InterviewSessionInclude<ExtArgs> | null
    /**
     * Filter, which InterviewSessions to fetch.
     */
    where?: InterviewSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of InterviewSessions to fetch.
     */
    orderBy?: InterviewSessionOrderByWithRelationInput | InterviewSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing InterviewSessions.
     */
    cursor?: InterviewSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` InterviewSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` InterviewSessions.
     */
    skip?: number
    distinct?: InterviewSessionScalarFieldEnum | InterviewSessionScalarFieldEnum[]
  }

  /**
   * InterviewSession create
   */
  export type InterviewSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InterviewSession
     */
    select?: InterviewSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InterviewSessionInclude<ExtArgs> | null
    /**
     * The data needed to create a InterviewSession.
     */
    data: XOR<InterviewSessionCreateInput, InterviewSessionUncheckedCreateInput>
  }

  /**
   * InterviewSession createMany
   */
  export type InterviewSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many InterviewSessions.
     */
    data: InterviewSessionCreateManyInput | InterviewSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * InterviewSession createManyAndReturn
   */
  export type InterviewSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InterviewSession
     */
    select?: InterviewSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many InterviewSessions.
     */
    data: InterviewSessionCreateManyInput | InterviewSessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InterviewSessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * InterviewSession update
   */
  export type InterviewSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InterviewSession
     */
    select?: InterviewSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InterviewSessionInclude<ExtArgs> | null
    /**
     * The data needed to update a InterviewSession.
     */
    data: XOR<InterviewSessionUpdateInput, InterviewSessionUncheckedUpdateInput>
    /**
     * Choose, which InterviewSession to update.
     */
    where: InterviewSessionWhereUniqueInput
  }

  /**
   * InterviewSession updateMany
   */
  export type InterviewSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update InterviewSessions.
     */
    data: XOR<InterviewSessionUpdateManyMutationInput, InterviewSessionUncheckedUpdateManyInput>
    /**
     * Filter which InterviewSessions to update
     */
    where?: InterviewSessionWhereInput
  }

  /**
   * InterviewSession upsert
   */
  export type InterviewSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InterviewSession
     */
    select?: InterviewSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InterviewSessionInclude<ExtArgs> | null
    /**
     * The filter to search for the InterviewSession to update in case it exists.
     */
    where: InterviewSessionWhereUniqueInput
    /**
     * In case the InterviewSession found by the `where` argument doesn't exist, create a new InterviewSession with this data.
     */
    create: XOR<InterviewSessionCreateInput, InterviewSessionUncheckedCreateInput>
    /**
     * In case the InterviewSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InterviewSessionUpdateInput, InterviewSessionUncheckedUpdateInput>
  }

  /**
   * InterviewSession delete
   */
  export type InterviewSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InterviewSession
     */
    select?: InterviewSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InterviewSessionInclude<ExtArgs> | null
    /**
     * Filter which InterviewSession to delete.
     */
    where: InterviewSessionWhereUniqueInput
  }

  /**
   * InterviewSession deleteMany
   */
  export type InterviewSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which InterviewSessions to delete
     */
    where?: InterviewSessionWhereInput
  }

  /**
   * InterviewSession.organization
   */
  export type InterviewSession$organizationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    where?: OrganizationWhereInput
  }

  /**
   * InterviewSession.transcripts
   */
  export type InterviewSession$transcriptsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranscriptEntry
     */
    select?: TranscriptEntrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptEntryInclude<ExtArgs> | null
    where?: TranscriptEntryWhereInput
    orderBy?: TranscriptEntryOrderByWithRelationInput | TranscriptEntryOrderByWithRelationInput[]
    cursor?: TranscriptEntryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TranscriptEntryScalarFieldEnum | TranscriptEntryScalarFieldEnum[]
  }

  /**
   * InterviewSession.observations
   */
  export type InterviewSession$observationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Observation
     */
    select?: ObservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObservationInclude<ExtArgs> | null
    where?: ObservationWhereInput
    orderBy?: ObservationOrderByWithRelationInput | ObservationOrderByWithRelationInput[]
    cursor?: ObservationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ObservationScalarFieldEnum | ObservationScalarFieldEnum[]
  }

  /**
   * InterviewSession.verdicts
   */
  export type InterviewSession$verdictsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssessorVerdict
     */
    select?: AssessorVerdictSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssessorVerdictInclude<ExtArgs> | null
    where?: AssessorVerdictWhereInput
    orderBy?: AssessorVerdictOrderByWithRelationInput | AssessorVerdictOrderByWithRelationInput[]
    cursor?: AssessorVerdictWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AssessorVerdictScalarFieldEnum | AssessorVerdictScalarFieldEnum[]
  }

  /**
   * InterviewSession.reports
   */
  export type InterviewSession$reportsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
    where?: ReportWhereInput
    orderBy?: ReportOrderByWithRelationInput | ReportOrderByWithRelationInput[]
    cursor?: ReportWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ReportScalarFieldEnum | ReportScalarFieldEnum[]
  }

  /**
   * InterviewSession without action
   */
  export type InterviewSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the InterviewSession
     */
    select?: InterviewSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InterviewSessionInclude<ExtArgs> | null
  }


  /**
   * Model TranscriptEntry
   */

  export type AggregateTranscriptEntry = {
    _count: TranscriptEntryCountAggregateOutputType | null
    _avg: TranscriptEntryAvgAggregateOutputType | null
    _sum: TranscriptEntrySumAggregateOutputType | null
    _min: TranscriptEntryMinAggregateOutputType | null
    _max: TranscriptEntryMaxAggregateOutputType | null
  }

  export type TranscriptEntryAvgAggregateOutputType = {
    audioTimestamp: number | null
  }

  export type TranscriptEntrySumAggregateOutputType = {
    audioTimestamp: number | null
  }

  export type TranscriptEntryMinAggregateOutputType = {
    id: string | null
    sessionId: string | null
    speaker: string | null
    text: string | null
    timestamp: Date | null
    audioTimestamp: number | null
  }

  export type TranscriptEntryMaxAggregateOutputType = {
    id: string | null
    sessionId: string | null
    speaker: string | null
    text: string | null
    timestamp: Date | null
    audioTimestamp: number | null
  }

  export type TranscriptEntryCountAggregateOutputType = {
    id: number
    sessionId: number
    speaker: number
    text: number
    timestamp: number
    audioTimestamp: number
    _all: number
  }


  export type TranscriptEntryAvgAggregateInputType = {
    audioTimestamp?: true
  }

  export type TranscriptEntrySumAggregateInputType = {
    audioTimestamp?: true
  }

  export type TranscriptEntryMinAggregateInputType = {
    id?: true
    sessionId?: true
    speaker?: true
    text?: true
    timestamp?: true
    audioTimestamp?: true
  }

  export type TranscriptEntryMaxAggregateInputType = {
    id?: true
    sessionId?: true
    speaker?: true
    text?: true
    timestamp?: true
    audioTimestamp?: true
  }

  export type TranscriptEntryCountAggregateInputType = {
    id?: true
    sessionId?: true
    speaker?: true
    text?: true
    timestamp?: true
    audioTimestamp?: true
    _all?: true
  }

  export type TranscriptEntryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TranscriptEntry to aggregate.
     */
    where?: TranscriptEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TranscriptEntries to fetch.
     */
    orderBy?: TranscriptEntryOrderByWithRelationInput | TranscriptEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TranscriptEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TranscriptEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TranscriptEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TranscriptEntries
    **/
    _count?: true | TranscriptEntryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TranscriptEntryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TranscriptEntrySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TranscriptEntryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TranscriptEntryMaxAggregateInputType
  }

  export type GetTranscriptEntryAggregateType<T extends TranscriptEntryAggregateArgs> = {
        [P in keyof T & keyof AggregateTranscriptEntry]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTranscriptEntry[P]>
      : GetScalarType<T[P], AggregateTranscriptEntry[P]>
  }




  export type TranscriptEntryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TranscriptEntryWhereInput
    orderBy?: TranscriptEntryOrderByWithAggregationInput | TranscriptEntryOrderByWithAggregationInput[]
    by: TranscriptEntryScalarFieldEnum[] | TranscriptEntryScalarFieldEnum
    having?: TranscriptEntryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TranscriptEntryCountAggregateInputType | true
    _avg?: TranscriptEntryAvgAggregateInputType
    _sum?: TranscriptEntrySumAggregateInputType
    _min?: TranscriptEntryMinAggregateInputType
    _max?: TranscriptEntryMaxAggregateInputType
  }

  export type TranscriptEntryGroupByOutputType = {
    id: string
    sessionId: string
    speaker: string
    text: string
    timestamp: Date
    audioTimestamp: number | null
    _count: TranscriptEntryCountAggregateOutputType | null
    _avg: TranscriptEntryAvgAggregateOutputType | null
    _sum: TranscriptEntrySumAggregateOutputType | null
    _min: TranscriptEntryMinAggregateOutputType | null
    _max: TranscriptEntryMaxAggregateOutputType | null
  }

  type GetTranscriptEntryGroupByPayload<T extends TranscriptEntryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TranscriptEntryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TranscriptEntryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TranscriptEntryGroupByOutputType[P]>
            : GetScalarType<T[P], TranscriptEntryGroupByOutputType[P]>
        }
      >
    >


  export type TranscriptEntrySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    speaker?: boolean
    text?: boolean
    timestamp?: boolean
    audioTimestamp?: boolean
    session?: boolean | InterviewSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transcriptEntry"]>

  export type TranscriptEntrySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    speaker?: boolean
    text?: boolean
    timestamp?: boolean
    audioTimestamp?: boolean
    session?: boolean | InterviewSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transcriptEntry"]>

  export type TranscriptEntrySelectScalar = {
    id?: boolean
    sessionId?: boolean
    speaker?: boolean
    text?: boolean
    timestamp?: boolean
    audioTimestamp?: boolean
  }

  export type TranscriptEntryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | InterviewSessionDefaultArgs<ExtArgs>
  }
  export type TranscriptEntryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | InterviewSessionDefaultArgs<ExtArgs>
  }

  export type $TranscriptEntryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TranscriptEntry"
    objects: {
      session: Prisma.$InterviewSessionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionId: string
      speaker: string
      text: string
      timestamp: Date
      audioTimestamp: number | null
    }, ExtArgs["result"]["transcriptEntry"]>
    composites: {}
  }

  type TranscriptEntryGetPayload<S extends boolean | null | undefined | TranscriptEntryDefaultArgs> = $Result.GetResult<Prisma.$TranscriptEntryPayload, S>

  type TranscriptEntryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TranscriptEntryFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TranscriptEntryCountAggregateInputType | true
    }

  export interface TranscriptEntryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TranscriptEntry'], meta: { name: 'TranscriptEntry' } }
    /**
     * Find zero or one TranscriptEntry that matches the filter.
     * @param {TranscriptEntryFindUniqueArgs} args - Arguments to find a TranscriptEntry
     * @example
     * // Get one TranscriptEntry
     * const transcriptEntry = await prisma.transcriptEntry.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TranscriptEntryFindUniqueArgs>(args: SelectSubset<T, TranscriptEntryFindUniqueArgs<ExtArgs>>): Prisma__TranscriptEntryClient<$Result.GetResult<Prisma.$TranscriptEntryPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one TranscriptEntry that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TranscriptEntryFindUniqueOrThrowArgs} args - Arguments to find a TranscriptEntry
     * @example
     * // Get one TranscriptEntry
     * const transcriptEntry = await prisma.transcriptEntry.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TranscriptEntryFindUniqueOrThrowArgs>(args: SelectSubset<T, TranscriptEntryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TranscriptEntryClient<$Result.GetResult<Prisma.$TranscriptEntryPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first TranscriptEntry that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptEntryFindFirstArgs} args - Arguments to find a TranscriptEntry
     * @example
     * // Get one TranscriptEntry
     * const transcriptEntry = await prisma.transcriptEntry.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TranscriptEntryFindFirstArgs>(args?: SelectSubset<T, TranscriptEntryFindFirstArgs<ExtArgs>>): Prisma__TranscriptEntryClient<$Result.GetResult<Prisma.$TranscriptEntryPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first TranscriptEntry that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptEntryFindFirstOrThrowArgs} args - Arguments to find a TranscriptEntry
     * @example
     * // Get one TranscriptEntry
     * const transcriptEntry = await prisma.transcriptEntry.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TranscriptEntryFindFirstOrThrowArgs>(args?: SelectSubset<T, TranscriptEntryFindFirstOrThrowArgs<ExtArgs>>): Prisma__TranscriptEntryClient<$Result.GetResult<Prisma.$TranscriptEntryPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more TranscriptEntries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptEntryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TranscriptEntries
     * const transcriptEntries = await prisma.transcriptEntry.findMany()
     * 
     * // Get first 10 TranscriptEntries
     * const transcriptEntries = await prisma.transcriptEntry.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const transcriptEntryWithIdOnly = await prisma.transcriptEntry.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TranscriptEntryFindManyArgs>(args?: SelectSubset<T, TranscriptEntryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TranscriptEntryPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a TranscriptEntry.
     * @param {TranscriptEntryCreateArgs} args - Arguments to create a TranscriptEntry.
     * @example
     * // Create one TranscriptEntry
     * const TranscriptEntry = await prisma.transcriptEntry.create({
     *   data: {
     *     // ... data to create a TranscriptEntry
     *   }
     * })
     * 
     */
    create<T extends TranscriptEntryCreateArgs>(args: SelectSubset<T, TranscriptEntryCreateArgs<ExtArgs>>): Prisma__TranscriptEntryClient<$Result.GetResult<Prisma.$TranscriptEntryPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many TranscriptEntries.
     * @param {TranscriptEntryCreateManyArgs} args - Arguments to create many TranscriptEntries.
     * @example
     * // Create many TranscriptEntries
     * const transcriptEntry = await prisma.transcriptEntry.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TranscriptEntryCreateManyArgs>(args?: SelectSubset<T, TranscriptEntryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TranscriptEntries and returns the data saved in the database.
     * @param {TranscriptEntryCreateManyAndReturnArgs} args - Arguments to create many TranscriptEntries.
     * @example
     * // Create many TranscriptEntries
     * const transcriptEntry = await prisma.transcriptEntry.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TranscriptEntries and only return the `id`
     * const transcriptEntryWithIdOnly = await prisma.transcriptEntry.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TranscriptEntryCreateManyAndReturnArgs>(args?: SelectSubset<T, TranscriptEntryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TranscriptEntryPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a TranscriptEntry.
     * @param {TranscriptEntryDeleteArgs} args - Arguments to delete one TranscriptEntry.
     * @example
     * // Delete one TranscriptEntry
     * const TranscriptEntry = await prisma.transcriptEntry.delete({
     *   where: {
     *     // ... filter to delete one TranscriptEntry
     *   }
     * })
     * 
     */
    delete<T extends TranscriptEntryDeleteArgs>(args: SelectSubset<T, TranscriptEntryDeleteArgs<ExtArgs>>): Prisma__TranscriptEntryClient<$Result.GetResult<Prisma.$TranscriptEntryPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one TranscriptEntry.
     * @param {TranscriptEntryUpdateArgs} args - Arguments to update one TranscriptEntry.
     * @example
     * // Update one TranscriptEntry
     * const transcriptEntry = await prisma.transcriptEntry.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TranscriptEntryUpdateArgs>(args: SelectSubset<T, TranscriptEntryUpdateArgs<ExtArgs>>): Prisma__TranscriptEntryClient<$Result.GetResult<Prisma.$TranscriptEntryPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more TranscriptEntries.
     * @param {TranscriptEntryDeleteManyArgs} args - Arguments to filter TranscriptEntries to delete.
     * @example
     * // Delete a few TranscriptEntries
     * const { count } = await prisma.transcriptEntry.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TranscriptEntryDeleteManyArgs>(args?: SelectSubset<T, TranscriptEntryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TranscriptEntries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptEntryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TranscriptEntries
     * const transcriptEntry = await prisma.transcriptEntry.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TranscriptEntryUpdateManyArgs>(args: SelectSubset<T, TranscriptEntryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one TranscriptEntry.
     * @param {TranscriptEntryUpsertArgs} args - Arguments to update or create a TranscriptEntry.
     * @example
     * // Update or create a TranscriptEntry
     * const transcriptEntry = await prisma.transcriptEntry.upsert({
     *   create: {
     *     // ... data to create a TranscriptEntry
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TranscriptEntry we want to update
     *   }
     * })
     */
    upsert<T extends TranscriptEntryUpsertArgs>(args: SelectSubset<T, TranscriptEntryUpsertArgs<ExtArgs>>): Prisma__TranscriptEntryClient<$Result.GetResult<Prisma.$TranscriptEntryPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of TranscriptEntries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptEntryCountArgs} args - Arguments to filter TranscriptEntries to count.
     * @example
     * // Count the number of TranscriptEntries
     * const count = await prisma.transcriptEntry.count({
     *   where: {
     *     // ... the filter for the TranscriptEntries we want to count
     *   }
     * })
    **/
    count<T extends TranscriptEntryCountArgs>(
      args?: Subset<T, TranscriptEntryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TranscriptEntryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TranscriptEntry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptEntryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TranscriptEntryAggregateArgs>(args: Subset<T, TranscriptEntryAggregateArgs>): Prisma.PrismaPromise<GetTranscriptEntryAggregateType<T>>

    /**
     * Group by TranscriptEntry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TranscriptEntryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TranscriptEntryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TranscriptEntryGroupByArgs['orderBy'] }
        : { orderBy?: TranscriptEntryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TranscriptEntryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTranscriptEntryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TranscriptEntry model
   */
  readonly fields: TranscriptEntryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TranscriptEntry.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TranscriptEntryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    session<T extends InterviewSessionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, InterviewSessionDefaultArgs<ExtArgs>>): Prisma__InterviewSessionClient<$Result.GetResult<Prisma.$InterviewSessionPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TranscriptEntry model
   */ 
  interface TranscriptEntryFieldRefs {
    readonly id: FieldRef<"TranscriptEntry", 'String'>
    readonly sessionId: FieldRef<"TranscriptEntry", 'String'>
    readonly speaker: FieldRef<"TranscriptEntry", 'String'>
    readonly text: FieldRef<"TranscriptEntry", 'String'>
    readonly timestamp: FieldRef<"TranscriptEntry", 'DateTime'>
    readonly audioTimestamp: FieldRef<"TranscriptEntry", 'Float'>
  }
    

  // Custom InputTypes
  /**
   * TranscriptEntry findUnique
   */
  export type TranscriptEntryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranscriptEntry
     */
    select?: TranscriptEntrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptEntryInclude<ExtArgs> | null
    /**
     * Filter, which TranscriptEntry to fetch.
     */
    where: TranscriptEntryWhereUniqueInput
  }

  /**
   * TranscriptEntry findUniqueOrThrow
   */
  export type TranscriptEntryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranscriptEntry
     */
    select?: TranscriptEntrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptEntryInclude<ExtArgs> | null
    /**
     * Filter, which TranscriptEntry to fetch.
     */
    where: TranscriptEntryWhereUniqueInput
  }

  /**
   * TranscriptEntry findFirst
   */
  export type TranscriptEntryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranscriptEntry
     */
    select?: TranscriptEntrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptEntryInclude<ExtArgs> | null
    /**
     * Filter, which TranscriptEntry to fetch.
     */
    where?: TranscriptEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TranscriptEntries to fetch.
     */
    orderBy?: TranscriptEntryOrderByWithRelationInput | TranscriptEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TranscriptEntries.
     */
    cursor?: TranscriptEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TranscriptEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TranscriptEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TranscriptEntries.
     */
    distinct?: TranscriptEntryScalarFieldEnum | TranscriptEntryScalarFieldEnum[]
  }

  /**
   * TranscriptEntry findFirstOrThrow
   */
  export type TranscriptEntryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranscriptEntry
     */
    select?: TranscriptEntrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptEntryInclude<ExtArgs> | null
    /**
     * Filter, which TranscriptEntry to fetch.
     */
    where?: TranscriptEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TranscriptEntries to fetch.
     */
    orderBy?: TranscriptEntryOrderByWithRelationInput | TranscriptEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TranscriptEntries.
     */
    cursor?: TranscriptEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TranscriptEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TranscriptEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TranscriptEntries.
     */
    distinct?: TranscriptEntryScalarFieldEnum | TranscriptEntryScalarFieldEnum[]
  }

  /**
   * TranscriptEntry findMany
   */
  export type TranscriptEntryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranscriptEntry
     */
    select?: TranscriptEntrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptEntryInclude<ExtArgs> | null
    /**
     * Filter, which TranscriptEntries to fetch.
     */
    where?: TranscriptEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TranscriptEntries to fetch.
     */
    orderBy?: TranscriptEntryOrderByWithRelationInput | TranscriptEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TranscriptEntries.
     */
    cursor?: TranscriptEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TranscriptEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TranscriptEntries.
     */
    skip?: number
    distinct?: TranscriptEntryScalarFieldEnum | TranscriptEntryScalarFieldEnum[]
  }

  /**
   * TranscriptEntry create
   */
  export type TranscriptEntryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranscriptEntry
     */
    select?: TranscriptEntrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptEntryInclude<ExtArgs> | null
    /**
     * The data needed to create a TranscriptEntry.
     */
    data: XOR<TranscriptEntryCreateInput, TranscriptEntryUncheckedCreateInput>
  }

  /**
   * TranscriptEntry createMany
   */
  export type TranscriptEntryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TranscriptEntries.
     */
    data: TranscriptEntryCreateManyInput | TranscriptEntryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TranscriptEntry createManyAndReturn
   */
  export type TranscriptEntryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranscriptEntry
     */
    select?: TranscriptEntrySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many TranscriptEntries.
     */
    data: TranscriptEntryCreateManyInput | TranscriptEntryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptEntryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TranscriptEntry update
   */
  export type TranscriptEntryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranscriptEntry
     */
    select?: TranscriptEntrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptEntryInclude<ExtArgs> | null
    /**
     * The data needed to update a TranscriptEntry.
     */
    data: XOR<TranscriptEntryUpdateInput, TranscriptEntryUncheckedUpdateInput>
    /**
     * Choose, which TranscriptEntry to update.
     */
    where: TranscriptEntryWhereUniqueInput
  }

  /**
   * TranscriptEntry updateMany
   */
  export type TranscriptEntryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TranscriptEntries.
     */
    data: XOR<TranscriptEntryUpdateManyMutationInput, TranscriptEntryUncheckedUpdateManyInput>
    /**
     * Filter which TranscriptEntries to update
     */
    where?: TranscriptEntryWhereInput
  }

  /**
   * TranscriptEntry upsert
   */
  export type TranscriptEntryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranscriptEntry
     */
    select?: TranscriptEntrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptEntryInclude<ExtArgs> | null
    /**
     * The filter to search for the TranscriptEntry to update in case it exists.
     */
    where: TranscriptEntryWhereUniqueInput
    /**
     * In case the TranscriptEntry found by the `where` argument doesn't exist, create a new TranscriptEntry with this data.
     */
    create: XOR<TranscriptEntryCreateInput, TranscriptEntryUncheckedCreateInput>
    /**
     * In case the TranscriptEntry was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TranscriptEntryUpdateInput, TranscriptEntryUncheckedUpdateInput>
  }

  /**
   * TranscriptEntry delete
   */
  export type TranscriptEntryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranscriptEntry
     */
    select?: TranscriptEntrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptEntryInclude<ExtArgs> | null
    /**
     * Filter which TranscriptEntry to delete.
     */
    where: TranscriptEntryWhereUniqueInput
  }

  /**
   * TranscriptEntry deleteMany
   */
  export type TranscriptEntryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TranscriptEntries to delete
     */
    where?: TranscriptEntryWhereInput
  }

  /**
   * TranscriptEntry without action
   */
  export type TranscriptEntryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TranscriptEntry
     */
    select?: TranscriptEntrySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TranscriptEntryInclude<ExtArgs> | null
  }


  /**
   * Model Observation
   */

  export type AggregateObservation = {
    _count: ObservationCountAggregateOutputType | null
    _avg: ObservationAvgAggregateOutputType | null
    _sum: ObservationSumAggregateOutputType | null
    _min: ObservationMinAggregateOutputType | null
    _max: ObservationMaxAggregateOutputType | null
  }

  export type ObservationAvgAggregateOutputType = {
    confidence: number | null
  }

  export type ObservationSumAggregateOutputType = {
    confidence: number | null
  }

  export type ObservationMinAggregateOutputType = {
    id: string | null
    sessionId: string | null
    type: string | null
    dimension: string | null
    gate: string | null
    description: string | null
    evidence: string | null
    confidence: number | null
    timestamp: Date | null
  }

  export type ObservationMaxAggregateOutputType = {
    id: string | null
    sessionId: string | null
    type: string | null
    dimension: string | null
    gate: string | null
    description: string | null
    evidence: string | null
    confidence: number | null
    timestamp: Date | null
  }

  export type ObservationCountAggregateOutputType = {
    id: number
    sessionId: number
    type: number
    dimension: number
    gate: number
    description: number
    evidence: number
    confidence: number
    timestamp: number
    _all: number
  }


  export type ObservationAvgAggregateInputType = {
    confidence?: true
  }

  export type ObservationSumAggregateInputType = {
    confidence?: true
  }

  export type ObservationMinAggregateInputType = {
    id?: true
    sessionId?: true
    type?: true
    dimension?: true
    gate?: true
    description?: true
    evidence?: true
    confidence?: true
    timestamp?: true
  }

  export type ObservationMaxAggregateInputType = {
    id?: true
    sessionId?: true
    type?: true
    dimension?: true
    gate?: true
    description?: true
    evidence?: true
    confidence?: true
    timestamp?: true
  }

  export type ObservationCountAggregateInputType = {
    id?: true
    sessionId?: true
    type?: true
    dimension?: true
    gate?: true
    description?: true
    evidence?: true
    confidence?: true
    timestamp?: true
    _all?: true
  }

  export type ObservationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Observation to aggregate.
     */
    where?: ObservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Observations to fetch.
     */
    orderBy?: ObservationOrderByWithRelationInput | ObservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ObservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Observations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Observations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Observations
    **/
    _count?: true | ObservationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ObservationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ObservationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ObservationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ObservationMaxAggregateInputType
  }

  export type GetObservationAggregateType<T extends ObservationAggregateArgs> = {
        [P in keyof T & keyof AggregateObservation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateObservation[P]>
      : GetScalarType<T[P], AggregateObservation[P]>
  }




  export type ObservationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ObservationWhereInput
    orderBy?: ObservationOrderByWithAggregationInput | ObservationOrderByWithAggregationInput[]
    by: ObservationScalarFieldEnum[] | ObservationScalarFieldEnum
    having?: ObservationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ObservationCountAggregateInputType | true
    _avg?: ObservationAvgAggregateInputType
    _sum?: ObservationSumAggregateInputType
    _min?: ObservationMinAggregateInputType
    _max?: ObservationMaxAggregateInputType
  }

  export type ObservationGroupByOutputType = {
    id: string
    sessionId: string
    type: string
    dimension: string | null
    gate: string | null
    description: string
    evidence: string
    confidence: number
    timestamp: Date
    _count: ObservationCountAggregateOutputType | null
    _avg: ObservationAvgAggregateOutputType | null
    _sum: ObservationSumAggregateOutputType | null
    _min: ObservationMinAggregateOutputType | null
    _max: ObservationMaxAggregateOutputType | null
  }

  type GetObservationGroupByPayload<T extends ObservationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ObservationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ObservationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ObservationGroupByOutputType[P]>
            : GetScalarType<T[P], ObservationGroupByOutputType[P]>
        }
      >
    >


  export type ObservationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    type?: boolean
    dimension?: boolean
    gate?: boolean
    description?: boolean
    evidence?: boolean
    confidence?: boolean
    timestamp?: boolean
    session?: boolean | InterviewSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["observation"]>

  export type ObservationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    type?: boolean
    dimension?: boolean
    gate?: boolean
    description?: boolean
    evidence?: boolean
    confidence?: boolean
    timestamp?: boolean
    session?: boolean | InterviewSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["observation"]>

  export type ObservationSelectScalar = {
    id?: boolean
    sessionId?: boolean
    type?: boolean
    dimension?: boolean
    gate?: boolean
    description?: boolean
    evidence?: boolean
    confidence?: boolean
    timestamp?: boolean
  }

  export type ObservationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | InterviewSessionDefaultArgs<ExtArgs>
  }
  export type ObservationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | InterviewSessionDefaultArgs<ExtArgs>
  }

  export type $ObservationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Observation"
    objects: {
      session: Prisma.$InterviewSessionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionId: string
      type: string
      dimension: string | null
      gate: string | null
      description: string
      evidence: string
      confidence: number
      timestamp: Date
    }, ExtArgs["result"]["observation"]>
    composites: {}
  }

  type ObservationGetPayload<S extends boolean | null | undefined | ObservationDefaultArgs> = $Result.GetResult<Prisma.$ObservationPayload, S>

  type ObservationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ObservationFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ObservationCountAggregateInputType | true
    }

  export interface ObservationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Observation'], meta: { name: 'Observation' } }
    /**
     * Find zero or one Observation that matches the filter.
     * @param {ObservationFindUniqueArgs} args - Arguments to find a Observation
     * @example
     * // Get one Observation
     * const observation = await prisma.observation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ObservationFindUniqueArgs>(args: SelectSubset<T, ObservationFindUniqueArgs<ExtArgs>>): Prisma__ObservationClient<$Result.GetResult<Prisma.$ObservationPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Observation that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ObservationFindUniqueOrThrowArgs} args - Arguments to find a Observation
     * @example
     * // Get one Observation
     * const observation = await prisma.observation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ObservationFindUniqueOrThrowArgs>(args: SelectSubset<T, ObservationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ObservationClient<$Result.GetResult<Prisma.$ObservationPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Observation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObservationFindFirstArgs} args - Arguments to find a Observation
     * @example
     * // Get one Observation
     * const observation = await prisma.observation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ObservationFindFirstArgs>(args?: SelectSubset<T, ObservationFindFirstArgs<ExtArgs>>): Prisma__ObservationClient<$Result.GetResult<Prisma.$ObservationPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Observation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObservationFindFirstOrThrowArgs} args - Arguments to find a Observation
     * @example
     * // Get one Observation
     * const observation = await prisma.observation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ObservationFindFirstOrThrowArgs>(args?: SelectSubset<T, ObservationFindFirstOrThrowArgs<ExtArgs>>): Prisma__ObservationClient<$Result.GetResult<Prisma.$ObservationPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Observations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObservationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Observations
     * const observations = await prisma.observation.findMany()
     * 
     * // Get first 10 Observations
     * const observations = await prisma.observation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const observationWithIdOnly = await prisma.observation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ObservationFindManyArgs>(args?: SelectSubset<T, ObservationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ObservationPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Observation.
     * @param {ObservationCreateArgs} args - Arguments to create a Observation.
     * @example
     * // Create one Observation
     * const Observation = await prisma.observation.create({
     *   data: {
     *     // ... data to create a Observation
     *   }
     * })
     * 
     */
    create<T extends ObservationCreateArgs>(args: SelectSubset<T, ObservationCreateArgs<ExtArgs>>): Prisma__ObservationClient<$Result.GetResult<Prisma.$ObservationPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Observations.
     * @param {ObservationCreateManyArgs} args - Arguments to create many Observations.
     * @example
     * // Create many Observations
     * const observation = await prisma.observation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ObservationCreateManyArgs>(args?: SelectSubset<T, ObservationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Observations and returns the data saved in the database.
     * @param {ObservationCreateManyAndReturnArgs} args - Arguments to create many Observations.
     * @example
     * // Create many Observations
     * const observation = await prisma.observation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Observations and only return the `id`
     * const observationWithIdOnly = await prisma.observation.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ObservationCreateManyAndReturnArgs>(args?: SelectSubset<T, ObservationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ObservationPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Observation.
     * @param {ObservationDeleteArgs} args - Arguments to delete one Observation.
     * @example
     * // Delete one Observation
     * const Observation = await prisma.observation.delete({
     *   where: {
     *     // ... filter to delete one Observation
     *   }
     * })
     * 
     */
    delete<T extends ObservationDeleteArgs>(args: SelectSubset<T, ObservationDeleteArgs<ExtArgs>>): Prisma__ObservationClient<$Result.GetResult<Prisma.$ObservationPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Observation.
     * @param {ObservationUpdateArgs} args - Arguments to update one Observation.
     * @example
     * // Update one Observation
     * const observation = await prisma.observation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ObservationUpdateArgs>(args: SelectSubset<T, ObservationUpdateArgs<ExtArgs>>): Prisma__ObservationClient<$Result.GetResult<Prisma.$ObservationPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Observations.
     * @param {ObservationDeleteManyArgs} args - Arguments to filter Observations to delete.
     * @example
     * // Delete a few Observations
     * const { count } = await prisma.observation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ObservationDeleteManyArgs>(args?: SelectSubset<T, ObservationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Observations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObservationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Observations
     * const observation = await prisma.observation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ObservationUpdateManyArgs>(args: SelectSubset<T, ObservationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Observation.
     * @param {ObservationUpsertArgs} args - Arguments to update or create a Observation.
     * @example
     * // Update or create a Observation
     * const observation = await prisma.observation.upsert({
     *   create: {
     *     // ... data to create a Observation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Observation we want to update
     *   }
     * })
     */
    upsert<T extends ObservationUpsertArgs>(args: SelectSubset<T, ObservationUpsertArgs<ExtArgs>>): Prisma__ObservationClient<$Result.GetResult<Prisma.$ObservationPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Observations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObservationCountArgs} args - Arguments to filter Observations to count.
     * @example
     * // Count the number of Observations
     * const count = await prisma.observation.count({
     *   where: {
     *     // ... the filter for the Observations we want to count
     *   }
     * })
    **/
    count<T extends ObservationCountArgs>(
      args?: Subset<T, ObservationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ObservationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Observation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObservationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ObservationAggregateArgs>(args: Subset<T, ObservationAggregateArgs>): Prisma.PrismaPromise<GetObservationAggregateType<T>>

    /**
     * Group by Observation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ObservationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ObservationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ObservationGroupByArgs['orderBy'] }
        : { orderBy?: ObservationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ObservationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetObservationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Observation model
   */
  readonly fields: ObservationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Observation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ObservationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    session<T extends InterviewSessionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, InterviewSessionDefaultArgs<ExtArgs>>): Prisma__InterviewSessionClient<$Result.GetResult<Prisma.$InterviewSessionPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Observation model
   */ 
  interface ObservationFieldRefs {
    readonly id: FieldRef<"Observation", 'String'>
    readonly sessionId: FieldRef<"Observation", 'String'>
    readonly type: FieldRef<"Observation", 'String'>
    readonly dimension: FieldRef<"Observation", 'String'>
    readonly gate: FieldRef<"Observation", 'String'>
    readonly description: FieldRef<"Observation", 'String'>
    readonly evidence: FieldRef<"Observation", 'String'>
    readonly confidence: FieldRef<"Observation", 'Float'>
    readonly timestamp: FieldRef<"Observation", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Observation findUnique
   */
  export type ObservationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Observation
     */
    select?: ObservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObservationInclude<ExtArgs> | null
    /**
     * Filter, which Observation to fetch.
     */
    where: ObservationWhereUniqueInput
  }

  /**
   * Observation findUniqueOrThrow
   */
  export type ObservationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Observation
     */
    select?: ObservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObservationInclude<ExtArgs> | null
    /**
     * Filter, which Observation to fetch.
     */
    where: ObservationWhereUniqueInput
  }

  /**
   * Observation findFirst
   */
  export type ObservationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Observation
     */
    select?: ObservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObservationInclude<ExtArgs> | null
    /**
     * Filter, which Observation to fetch.
     */
    where?: ObservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Observations to fetch.
     */
    orderBy?: ObservationOrderByWithRelationInput | ObservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Observations.
     */
    cursor?: ObservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Observations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Observations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Observations.
     */
    distinct?: ObservationScalarFieldEnum | ObservationScalarFieldEnum[]
  }

  /**
   * Observation findFirstOrThrow
   */
  export type ObservationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Observation
     */
    select?: ObservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObservationInclude<ExtArgs> | null
    /**
     * Filter, which Observation to fetch.
     */
    where?: ObservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Observations to fetch.
     */
    orderBy?: ObservationOrderByWithRelationInput | ObservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Observations.
     */
    cursor?: ObservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Observations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Observations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Observations.
     */
    distinct?: ObservationScalarFieldEnum | ObservationScalarFieldEnum[]
  }

  /**
   * Observation findMany
   */
  export type ObservationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Observation
     */
    select?: ObservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObservationInclude<ExtArgs> | null
    /**
     * Filter, which Observations to fetch.
     */
    where?: ObservationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Observations to fetch.
     */
    orderBy?: ObservationOrderByWithRelationInput | ObservationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Observations.
     */
    cursor?: ObservationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Observations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Observations.
     */
    skip?: number
    distinct?: ObservationScalarFieldEnum | ObservationScalarFieldEnum[]
  }

  /**
   * Observation create
   */
  export type ObservationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Observation
     */
    select?: ObservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObservationInclude<ExtArgs> | null
    /**
     * The data needed to create a Observation.
     */
    data: XOR<ObservationCreateInput, ObservationUncheckedCreateInput>
  }

  /**
   * Observation createMany
   */
  export type ObservationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Observations.
     */
    data: ObservationCreateManyInput | ObservationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Observation createManyAndReturn
   */
  export type ObservationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Observation
     */
    select?: ObservationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Observations.
     */
    data: ObservationCreateManyInput | ObservationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObservationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Observation update
   */
  export type ObservationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Observation
     */
    select?: ObservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObservationInclude<ExtArgs> | null
    /**
     * The data needed to update a Observation.
     */
    data: XOR<ObservationUpdateInput, ObservationUncheckedUpdateInput>
    /**
     * Choose, which Observation to update.
     */
    where: ObservationWhereUniqueInput
  }

  /**
   * Observation updateMany
   */
  export type ObservationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Observations.
     */
    data: XOR<ObservationUpdateManyMutationInput, ObservationUncheckedUpdateManyInput>
    /**
     * Filter which Observations to update
     */
    where?: ObservationWhereInput
  }

  /**
   * Observation upsert
   */
  export type ObservationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Observation
     */
    select?: ObservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObservationInclude<ExtArgs> | null
    /**
     * The filter to search for the Observation to update in case it exists.
     */
    where: ObservationWhereUniqueInput
    /**
     * In case the Observation found by the `where` argument doesn't exist, create a new Observation with this data.
     */
    create: XOR<ObservationCreateInput, ObservationUncheckedCreateInput>
    /**
     * In case the Observation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ObservationUpdateInput, ObservationUncheckedUpdateInput>
  }

  /**
   * Observation delete
   */
  export type ObservationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Observation
     */
    select?: ObservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObservationInclude<ExtArgs> | null
    /**
     * Filter which Observation to delete.
     */
    where: ObservationWhereUniqueInput
  }

  /**
   * Observation deleteMany
   */
  export type ObservationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Observations to delete
     */
    where?: ObservationWhereInput
  }

  /**
   * Observation without action
   */
  export type ObservationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Observation
     */
    select?: ObservationSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ObservationInclude<ExtArgs> | null
  }


  /**
   * Model AssessorVerdict
   */

  export type AggregateAssessorVerdict = {
    _count: AssessorVerdictCountAggregateOutputType | null
    _avg: AssessorVerdictAvgAggregateOutputType | null
    _sum: AssessorVerdictSumAggregateOutputType | null
    _min: AssessorVerdictMinAggregateOutputType | null
    _max: AssessorVerdictMaxAggregateOutputType | null
  }

  export type AssessorVerdictAvgAggregateOutputType = {
    confidence: number | null
  }

  export type AssessorVerdictSumAggregateOutputType = {
    confidence: number | null
  }

  export type AssessorVerdictMinAggregateOutputType = {
    id: string | null
    sessionId: string | null
    role: string | null
    recommendation: string | null
    confidence: number | null
    narrative: string | null
    dissent: string | null
  }

  export type AssessorVerdictMaxAggregateOutputType = {
    id: string | null
    sessionId: string | null
    role: string | null
    recommendation: string | null
    confidence: number | null
    narrative: string | null
    dissent: string | null
  }

  export type AssessorVerdictCountAggregateOutputType = {
    id: number
    sessionId: number
    role: number
    recommendation: number
    confidence: number
    narrative: number
    dimensionScores: number
    deepSignalScores: number
    psychologicalScreening: number
    gateEvaluations: number
    keyInsights: number
    dissent: number
    _all: number
  }


  export type AssessorVerdictAvgAggregateInputType = {
    confidence?: true
  }

  export type AssessorVerdictSumAggregateInputType = {
    confidence?: true
  }

  export type AssessorVerdictMinAggregateInputType = {
    id?: true
    sessionId?: true
    role?: true
    recommendation?: true
    confidence?: true
    narrative?: true
    dissent?: true
  }

  export type AssessorVerdictMaxAggregateInputType = {
    id?: true
    sessionId?: true
    role?: true
    recommendation?: true
    confidence?: true
    narrative?: true
    dissent?: true
  }

  export type AssessorVerdictCountAggregateInputType = {
    id?: true
    sessionId?: true
    role?: true
    recommendation?: true
    confidence?: true
    narrative?: true
    dimensionScores?: true
    deepSignalScores?: true
    psychologicalScreening?: true
    gateEvaluations?: true
    keyInsights?: true
    dissent?: true
    _all?: true
  }

  export type AssessorVerdictAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AssessorVerdict to aggregate.
     */
    where?: AssessorVerdictWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AssessorVerdicts to fetch.
     */
    orderBy?: AssessorVerdictOrderByWithRelationInput | AssessorVerdictOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AssessorVerdictWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AssessorVerdicts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AssessorVerdicts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AssessorVerdicts
    **/
    _count?: true | AssessorVerdictCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AssessorVerdictAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AssessorVerdictSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AssessorVerdictMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AssessorVerdictMaxAggregateInputType
  }

  export type GetAssessorVerdictAggregateType<T extends AssessorVerdictAggregateArgs> = {
        [P in keyof T & keyof AggregateAssessorVerdict]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAssessorVerdict[P]>
      : GetScalarType<T[P], AggregateAssessorVerdict[P]>
  }




  export type AssessorVerdictGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AssessorVerdictWhereInput
    orderBy?: AssessorVerdictOrderByWithAggregationInput | AssessorVerdictOrderByWithAggregationInput[]
    by: AssessorVerdictScalarFieldEnum[] | AssessorVerdictScalarFieldEnum
    having?: AssessorVerdictScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AssessorVerdictCountAggregateInputType | true
    _avg?: AssessorVerdictAvgAggregateInputType
    _sum?: AssessorVerdictSumAggregateInputType
    _min?: AssessorVerdictMinAggregateInputType
    _max?: AssessorVerdictMaxAggregateInputType
  }

  export type AssessorVerdictGroupByOutputType = {
    id: string
    sessionId: string
    role: string
    recommendation: string
    confidence: number
    narrative: string
    dimensionScores: JsonValue
    deepSignalScores: JsonValue | null
    psychologicalScreening: JsonValue | null
    gateEvaluations: JsonValue
    keyInsights: JsonValue
    dissent: string | null
    _count: AssessorVerdictCountAggregateOutputType | null
    _avg: AssessorVerdictAvgAggregateOutputType | null
    _sum: AssessorVerdictSumAggregateOutputType | null
    _min: AssessorVerdictMinAggregateOutputType | null
    _max: AssessorVerdictMaxAggregateOutputType | null
  }

  type GetAssessorVerdictGroupByPayload<T extends AssessorVerdictGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AssessorVerdictGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AssessorVerdictGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AssessorVerdictGroupByOutputType[P]>
            : GetScalarType<T[P], AssessorVerdictGroupByOutputType[P]>
        }
      >
    >


  export type AssessorVerdictSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    role?: boolean
    recommendation?: boolean
    confidence?: boolean
    narrative?: boolean
    dimensionScores?: boolean
    deepSignalScores?: boolean
    psychologicalScreening?: boolean
    gateEvaluations?: boolean
    keyInsights?: boolean
    dissent?: boolean
    session?: boolean | InterviewSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["assessorVerdict"]>

  export type AssessorVerdictSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    role?: boolean
    recommendation?: boolean
    confidence?: boolean
    narrative?: boolean
    dimensionScores?: boolean
    deepSignalScores?: boolean
    psychologicalScreening?: boolean
    gateEvaluations?: boolean
    keyInsights?: boolean
    dissent?: boolean
    session?: boolean | InterviewSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["assessorVerdict"]>

  export type AssessorVerdictSelectScalar = {
    id?: boolean
    sessionId?: boolean
    role?: boolean
    recommendation?: boolean
    confidence?: boolean
    narrative?: boolean
    dimensionScores?: boolean
    deepSignalScores?: boolean
    psychologicalScreening?: boolean
    gateEvaluations?: boolean
    keyInsights?: boolean
    dissent?: boolean
  }

  export type AssessorVerdictInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | InterviewSessionDefaultArgs<ExtArgs>
  }
  export type AssessorVerdictIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | InterviewSessionDefaultArgs<ExtArgs>
  }

  export type $AssessorVerdictPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AssessorVerdict"
    objects: {
      session: Prisma.$InterviewSessionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionId: string
      role: string
      recommendation: string
      confidence: number
      narrative: string
      dimensionScores: Prisma.JsonValue
      deepSignalScores: Prisma.JsonValue | null
      psychologicalScreening: Prisma.JsonValue | null
      gateEvaluations: Prisma.JsonValue
      keyInsights: Prisma.JsonValue
      dissent: string | null
    }, ExtArgs["result"]["assessorVerdict"]>
    composites: {}
  }

  type AssessorVerdictGetPayload<S extends boolean | null | undefined | AssessorVerdictDefaultArgs> = $Result.GetResult<Prisma.$AssessorVerdictPayload, S>

  type AssessorVerdictCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AssessorVerdictFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AssessorVerdictCountAggregateInputType | true
    }

  export interface AssessorVerdictDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AssessorVerdict'], meta: { name: 'AssessorVerdict' } }
    /**
     * Find zero or one AssessorVerdict that matches the filter.
     * @param {AssessorVerdictFindUniqueArgs} args - Arguments to find a AssessorVerdict
     * @example
     * // Get one AssessorVerdict
     * const assessorVerdict = await prisma.assessorVerdict.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AssessorVerdictFindUniqueArgs>(args: SelectSubset<T, AssessorVerdictFindUniqueArgs<ExtArgs>>): Prisma__AssessorVerdictClient<$Result.GetResult<Prisma.$AssessorVerdictPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AssessorVerdict that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AssessorVerdictFindUniqueOrThrowArgs} args - Arguments to find a AssessorVerdict
     * @example
     * // Get one AssessorVerdict
     * const assessorVerdict = await prisma.assessorVerdict.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AssessorVerdictFindUniqueOrThrowArgs>(args: SelectSubset<T, AssessorVerdictFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AssessorVerdictClient<$Result.GetResult<Prisma.$AssessorVerdictPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AssessorVerdict that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssessorVerdictFindFirstArgs} args - Arguments to find a AssessorVerdict
     * @example
     * // Get one AssessorVerdict
     * const assessorVerdict = await prisma.assessorVerdict.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AssessorVerdictFindFirstArgs>(args?: SelectSubset<T, AssessorVerdictFindFirstArgs<ExtArgs>>): Prisma__AssessorVerdictClient<$Result.GetResult<Prisma.$AssessorVerdictPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AssessorVerdict that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssessorVerdictFindFirstOrThrowArgs} args - Arguments to find a AssessorVerdict
     * @example
     * // Get one AssessorVerdict
     * const assessorVerdict = await prisma.assessorVerdict.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AssessorVerdictFindFirstOrThrowArgs>(args?: SelectSubset<T, AssessorVerdictFindFirstOrThrowArgs<ExtArgs>>): Prisma__AssessorVerdictClient<$Result.GetResult<Prisma.$AssessorVerdictPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AssessorVerdicts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssessorVerdictFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AssessorVerdicts
     * const assessorVerdicts = await prisma.assessorVerdict.findMany()
     * 
     * // Get first 10 AssessorVerdicts
     * const assessorVerdicts = await prisma.assessorVerdict.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const assessorVerdictWithIdOnly = await prisma.assessorVerdict.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AssessorVerdictFindManyArgs>(args?: SelectSubset<T, AssessorVerdictFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssessorVerdictPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AssessorVerdict.
     * @param {AssessorVerdictCreateArgs} args - Arguments to create a AssessorVerdict.
     * @example
     * // Create one AssessorVerdict
     * const AssessorVerdict = await prisma.assessorVerdict.create({
     *   data: {
     *     // ... data to create a AssessorVerdict
     *   }
     * })
     * 
     */
    create<T extends AssessorVerdictCreateArgs>(args: SelectSubset<T, AssessorVerdictCreateArgs<ExtArgs>>): Prisma__AssessorVerdictClient<$Result.GetResult<Prisma.$AssessorVerdictPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AssessorVerdicts.
     * @param {AssessorVerdictCreateManyArgs} args - Arguments to create many AssessorVerdicts.
     * @example
     * // Create many AssessorVerdicts
     * const assessorVerdict = await prisma.assessorVerdict.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AssessorVerdictCreateManyArgs>(args?: SelectSubset<T, AssessorVerdictCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AssessorVerdicts and returns the data saved in the database.
     * @param {AssessorVerdictCreateManyAndReturnArgs} args - Arguments to create many AssessorVerdicts.
     * @example
     * // Create many AssessorVerdicts
     * const assessorVerdict = await prisma.assessorVerdict.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AssessorVerdicts and only return the `id`
     * const assessorVerdictWithIdOnly = await prisma.assessorVerdict.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AssessorVerdictCreateManyAndReturnArgs>(args?: SelectSubset<T, AssessorVerdictCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssessorVerdictPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AssessorVerdict.
     * @param {AssessorVerdictDeleteArgs} args - Arguments to delete one AssessorVerdict.
     * @example
     * // Delete one AssessorVerdict
     * const AssessorVerdict = await prisma.assessorVerdict.delete({
     *   where: {
     *     // ... filter to delete one AssessorVerdict
     *   }
     * })
     * 
     */
    delete<T extends AssessorVerdictDeleteArgs>(args: SelectSubset<T, AssessorVerdictDeleteArgs<ExtArgs>>): Prisma__AssessorVerdictClient<$Result.GetResult<Prisma.$AssessorVerdictPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AssessorVerdict.
     * @param {AssessorVerdictUpdateArgs} args - Arguments to update one AssessorVerdict.
     * @example
     * // Update one AssessorVerdict
     * const assessorVerdict = await prisma.assessorVerdict.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AssessorVerdictUpdateArgs>(args: SelectSubset<T, AssessorVerdictUpdateArgs<ExtArgs>>): Prisma__AssessorVerdictClient<$Result.GetResult<Prisma.$AssessorVerdictPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AssessorVerdicts.
     * @param {AssessorVerdictDeleteManyArgs} args - Arguments to filter AssessorVerdicts to delete.
     * @example
     * // Delete a few AssessorVerdicts
     * const { count } = await prisma.assessorVerdict.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AssessorVerdictDeleteManyArgs>(args?: SelectSubset<T, AssessorVerdictDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AssessorVerdicts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssessorVerdictUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AssessorVerdicts
     * const assessorVerdict = await prisma.assessorVerdict.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AssessorVerdictUpdateManyArgs>(args: SelectSubset<T, AssessorVerdictUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AssessorVerdict.
     * @param {AssessorVerdictUpsertArgs} args - Arguments to update or create a AssessorVerdict.
     * @example
     * // Update or create a AssessorVerdict
     * const assessorVerdict = await prisma.assessorVerdict.upsert({
     *   create: {
     *     // ... data to create a AssessorVerdict
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AssessorVerdict we want to update
     *   }
     * })
     */
    upsert<T extends AssessorVerdictUpsertArgs>(args: SelectSubset<T, AssessorVerdictUpsertArgs<ExtArgs>>): Prisma__AssessorVerdictClient<$Result.GetResult<Prisma.$AssessorVerdictPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AssessorVerdicts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssessorVerdictCountArgs} args - Arguments to filter AssessorVerdicts to count.
     * @example
     * // Count the number of AssessorVerdicts
     * const count = await prisma.assessorVerdict.count({
     *   where: {
     *     // ... the filter for the AssessorVerdicts we want to count
     *   }
     * })
    **/
    count<T extends AssessorVerdictCountArgs>(
      args?: Subset<T, AssessorVerdictCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AssessorVerdictCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AssessorVerdict.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssessorVerdictAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AssessorVerdictAggregateArgs>(args: Subset<T, AssessorVerdictAggregateArgs>): Prisma.PrismaPromise<GetAssessorVerdictAggregateType<T>>

    /**
     * Group by AssessorVerdict.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssessorVerdictGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AssessorVerdictGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AssessorVerdictGroupByArgs['orderBy'] }
        : { orderBy?: AssessorVerdictGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AssessorVerdictGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAssessorVerdictGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AssessorVerdict model
   */
  readonly fields: AssessorVerdictFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AssessorVerdict.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AssessorVerdictClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    session<T extends InterviewSessionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, InterviewSessionDefaultArgs<ExtArgs>>): Prisma__InterviewSessionClient<$Result.GetResult<Prisma.$InterviewSessionPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AssessorVerdict model
   */ 
  interface AssessorVerdictFieldRefs {
    readonly id: FieldRef<"AssessorVerdict", 'String'>
    readonly sessionId: FieldRef<"AssessorVerdict", 'String'>
    readonly role: FieldRef<"AssessorVerdict", 'String'>
    readonly recommendation: FieldRef<"AssessorVerdict", 'String'>
    readonly confidence: FieldRef<"AssessorVerdict", 'Float'>
    readonly narrative: FieldRef<"AssessorVerdict", 'String'>
    readonly dimensionScores: FieldRef<"AssessorVerdict", 'Json'>
    readonly deepSignalScores: FieldRef<"AssessorVerdict", 'Json'>
    readonly psychologicalScreening: FieldRef<"AssessorVerdict", 'Json'>
    readonly gateEvaluations: FieldRef<"AssessorVerdict", 'Json'>
    readonly keyInsights: FieldRef<"AssessorVerdict", 'Json'>
    readonly dissent: FieldRef<"AssessorVerdict", 'String'>
  }
    

  // Custom InputTypes
  /**
   * AssessorVerdict findUnique
   */
  export type AssessorVerdictFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssessorVerdict
     */
    select?: AssessorVerdictSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssessorVerdictInclude<ExtArgs> | null
    /**
     * Filter, which AssessorVerdict to fetch.
     */
    where: AssessorVerdictWhereUniqueInput
  }

  /**
   * AssessorVerdict findUniqueOrThrow
   */
  export type AssessorVerdictFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssessorVerdict
     */
    select?: AssessorVerdictSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssessorVerdictInclude<ExtArgs> | null
    /**
     * Filter, which AssessorVerdict to fetch.
     */
    where: AssessorVerdictWhereUniqueInput
  }

  /**
   * AssessorVerdict findFirst
   */
  export type AssessorVerdictFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssessorVerdict
     */
    select?: AssessorVerdictSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssessorVerdictInclude<ExtArgs> | null
    /**
     * Filter, which AssessorVerdict to fetch.
     */
    where?: AssessorVerdictWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AssessorVerdicts to fetch.
     */
    orderBy?: AssessorVerdictOrderByWithRelationInput | AssessorVerdictOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AssessorVerdicts.
     */
    cursor?: AssessorVerdictWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AssessorVerdicts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AssessorVerdicts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AssessorVerdicts.
     */
    distinct?: AssessorVerdictScalarFieldEnum | AssessorVerdictScalarFieldEnum[]
  }

  /**
   * AssessorVerdict findFirstOrThrow
   */
  export type AssessorVerdictFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssessorVerdict
     */
    select?: AssessorVerdictSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssessorVerdictInclude<ExtArgs> | null
    /**
     * Filter, which AssessorVerdict to fetch.
     */
    where?: AssessorVerdictWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AssessorVerdicts to fetch.
     */
    orderBy?: AssessorVerdictOrderByWithRelationInput | AssessorVerdictOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AssessorVerdicts.
     */
    cursor?: AssessorVerdictWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AssessorVerdicts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AssessorVerdicts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AssessorVerdicts.
     */
    distinct?: AssessorVerdictScalarFieldEnum | AssessorVerdictScalarFieldEnum[]
  }

  /**
   * AssessorVerdict findMany
   */
  export type AssessorVerdictFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssessorVerdict
     */
    select?: AssessorVerdictSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssessorVerdictInclude<ExtArgs> | null
    /**
     * Filter, which AssessorVerdicts to fetch.
     */
    where?: AssessorVerdictWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AssessorVerdicts to fetch.
     */
    orderBy?: AssessorVerdictOrderByWithRelationInput | AssessorVerdictOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AssessorVerdicts.
     */
    cursor?: AssessorVerdictWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AssessorVerdicts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AssessorVerdicts.
     */
    skip?: number
    distinct?: AssessorVerdictScalarFieldEnum | AssessorVerdictScalarFieldEnum[]
  }

  /**
   * AssessorVerdict create
   */
  export type AssessorVerdictCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssessorVerdict
     */
    select?: AssessorVerdictSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssessorVerdictInclude<ExtArgs> | null
    /**
     * The data needed to create a AssessorVerdict.
     */
    data: XOR<AssessorVerdictCreateInput, AssessorVerdictUncheckedCreateInput>
  }

  /**
   * AssessorVerdict createMany
   */
  export type AssessorVerdictCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AssessorVerdicts.
     */
    data: AssessorVerdictCreateManyInput | AssessorVerdictCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AssessorVerdict createManyAndReturn
   */
  export type AssessorVerdictCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssessorVerdict
     */
    select?: AssessorVerdictSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AssessorVerdicts.
     */
    data: AssessorVerdictCreateManyInput | AssessorVerdictCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssessorVerdictIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AssessorVerdict update
   */
  export type AssessorVerdictUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssessorVerdict
     */
    select?: AssessorVerdictSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssessorVerdictInclude<ExtArgs> | null
    /**
     * The data needed to update a AssessorVerdict.
     */
    data: XOR<AssessorVerdictUpdateInput, AssessorVerdictUncheckedUpdateInput>
    /**
     * Choose, which AssessorVerdict to update.
     */
    where: AssessorVerdictWhereUniqueInput
  }

  /**
   * AssessorVerdict updateMany
   */
  export type AssessorVerdictUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AssessorVerdicts.
     */
    data: XOR<AssessorVerdictUpdateManyMutationInput, AssessorVerdictUncheckedUpdateManyInput>
    /**
     * Filter which AssessorVerdicts to update
     */
    where?: AssessorVerdictWhereInput
  }

  /**
   * AssessorVerdict upsert
   */
  export type AssessorVerdictUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssessorVerdict
     */
    select?: AssessorVerdictSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssessorVerdictInclude<ExtArgs> | null
    /**
     * The filter to search for the AssessorVerdict to update in case it exists.
     */
    where: AssessorVerdictWhereUniqueInput
    /**
     * In case the AssessorVerdict found by the `where` argument doesn't exist, create a new AssessorVerdict with this data.
     */
    create: XOR<AssessorVerdictCreateInput, AssessorVerdictUncheckedCreateInput>
    /**
     * In case the AssessorVerdict was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AssessorVerdictUpdateInput, AssessorVerdictUncheckedUpdateInput>
  }

  /**
   * AssessorVerdict delete
   */
  export type AssessorVerdictDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssessorVerdict
     */
    select?: AssessorVerdictSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssessorVerdictInclude<ExtArgs> | null
    /**
     * Filter which AssessorVerdict to delete.
     */
    where: AssessorVerdictWhereUniqueInput
  }

  /**
   * AssessorVerdict deleteMany
   */
  export type AssessorVerdictDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AssessorVerdicts to delete
     */
    where?: AssessorVerdictWhereInput
  }

  /**
   * AssessorVerdict without action
   */
  export type AssessorVerdictDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssessorVerdict
     */
    select?: AssessorVerdictSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssessorVerdictInclude<ExtArgs> | null
  }


  /**
   * Model Report
   */

  export type AggregateReport = {
    _count: ReportCountAggregateOutputType | null
    _min: ReportMinAggregateOutputType | null
    _max: ReportMaxAggregateOutputType | null
  }

  export type ReportMinAggregateOutputType = {
    id: string | null
    sessionId: string | null
    candidateName: string | null
    roleName: string | null
    createdAt: Date | null
  }

  export type ReportMaxAggregateOutputType = {
    id: string | null
    sessionId: string | null
    candidateName: string | null
    roleName: string | null
    createdAt: Date | null
  }

  export type ReportCountAggregateOutputType = {
    id: number
    sessionId: number
    candidateName: number
    roleName: number
    reportData: number
    createdAt: number
    _all: number
  }


  export type ReportMinAggregateInputType = {
    id?: true
    sessionId?: true
    candidateName?: true
    roleName?: true
    createdAt?: true
  }

  export type ReportMaxAggregateInputType = {
    id?: true
    sessionId?: true
    candidateName?: true
    roleName?: true
    createdAt?: true
  }

  export type ReportCountAggregateInputType = {
    id?: true
    sessionId?: true
    candidateName?: true
    roleName?: true
    reportData?: true
    createdAt?: true
    _all?: true
  }

  export type ReportAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Report to aggregate.
     */
    where?: ReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reports to fetch.
     */
    orderBy?: ReportOrderByWithRelationInput | ReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Reports
    **/
    _count?: true | ReportCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReportMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReportMaxAggregateInputType
  }

  export type GetReportAggregateType<T extends ReportAggregateArgs> = {
        [P in keyof T & keyof AggregateReport]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReport[P]>
      : GetScalarType<T[P], AggregateReport[P]>
  }




  export type ReportGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReportWhereInput
    orderBy?: ReportOrderByWithAggregationInput | ReportOrderByWithAggregationInput[]
    by: ReportScalarFieldEnum[] | ReportScalarFieldEnum
    having?: ReportScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReportCountAggregateInputType | true
    _min?: ReportMinAggregateInputType
    _max?: ReportMaxAggregateInputType
  }

  export type ReportGroupByOutputType = {
    id: string
    sessionId: string
    candidateName: string
    roleName: string
    reportData: JsonValue
    createdAt: Date
    _count: ReportCountAggregateOutputType | null
    _min: ReportMinAggregateOutputType | null
    _max: ReportMaxAggregateOutputType | null
  }

  type GetReportGroupByPayload<T extends ReportGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReportGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReportGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReportGroupByOutputType[P]>
            : GetScalarType<T[P], ReportGroupByOutputType[P]>
        }
      >
    >


  export type ReportSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    candidateName?: boolean
    roleName?: boolean
    reportData?: boolean
    createdAt?: boolean
    session?: boolean | InterviewSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["report"]>

  export type ReportSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    candidateName?: boolean
    roleName?: boolean
    reportData?: boolean
    createdAt?: boolean
    session?: boolean | InterviewSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["report"]>

  export type ReportSelectScalar = {
    id?: boolean
    sessionId?: boolean
    candidateName?: boolean
    roleName?: boolean
    reportData?: boolean
    createdAt?: boolean
  }

  export type ReportInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | InterviewSessionDefaultArgs<ExtArgs>
  }
  export type ReportIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | InterviewSessionDefaultArgs<ExtArgs>
  }

  export type $ReportPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Report"
    objects: {
      session: Prisma.$InterviewSessionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionId: string
      candidateName: string
      roleName: string
      reportData: Prisma.JsonValue
      createdAt: Date
    }, ExtArgs["result"]["report"]>
    composites: {}
  }

  type ReportGetPayload<S extends boolean | null | undefined | ReportDefaultArgs> = $Result.GetResult<Prisma.$ReportPayload, S>

  type ReportCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ReportFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ReportCountAggregateInputType | true
    }

  export interface ReportDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Report'], meta: { name: 'Report' } }
    /**
     * Find zero or one Report that matches the filter.
     * @param {ReportFindUniqueArgs} args - Arguments to find a Report
     * @example
     * // Get one Report
     * const report = await prisma.report.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReportFindUniqueArgs>(args: SelectSubset<T, ReportFindUniqueArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Report that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ReportFindUniqueOrThrowArgs} args - Arguments to find a Report
     * @example
     * // Get one Report
     * const report = await prisma.report.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReportFindUniqueOrThrowArgs>(args: SelectSubset<T, ReportFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Report that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportFindFirstArgs} args - Arguments to find a Report
     * @example
     * // Get one Report
     * const report = await prisma.report.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReportFindFirstArgs>(args?: SelectSubset<T, ReportFindFirstArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Report that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportFindFirstOrThrowArgs} args - Arguments to find a Report
     * @example
     * // Get one Report
     * const report = await prisma.report.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReportFindFirstOrThrowArgs>(args?: SelectSubset<T, ReportFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Reports that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Reports
     * const reports = await prisma.report.findMany()
     * 
     * // Get first 10 Reports
     * const reports = await prisma.report.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const reportWithIdOnly = await prisma.report.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReportFindManyArgs>(args?: SelectSubset<T, ReportFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Report.
     * @param {ReportCreateArgs} args - Arguments to create a Report.
     * @example
     * // Create one Report
     * const Report = await prisma.report.create({
     *   data: {
     *     // ... data to create a Report
     *   }
     * })
     * 
     */
    create<T extends ReportCreateArgs>(args: SelectSubset<T, ReportCreateArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Reports.
     * @param {ReportCreateManyArgs} args - Arguments to create many Reports.
     * @example
     * // Create many Reports
     * const report = await prisma.report.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReportCreateManyArgs>(args?: SelectSubset<T, ReportCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Reports and returns the data saved in the database.
     * @param {ReportCreateManyAndReturnArgs} args - Arguments to create many Reports.
     * @example
     * // Create many Reports
     * const report = await prisma.report.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Reports and only return the `id`
     * const reportWithIdOnly = await prisma.report.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ReportCreateManyAndReturnArgs>(args?: SelectSubset<T, ReportCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Report.
     * @param {ReportDeleteArgs} args - Arguments to delete one Report.
     * @example
     * // Delete one Report
     * const Report = await prisma.report.delete({
     *   where: {
     *     // ... filter to delete one Report
     *   }
     * })
     * 
     */
    delete<T extends ReportDeleteArgs>(args: SelectSubset<T, ReportDeleteArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Report.
     * @param {ReportUpdateArgs} args - Arguments to update one Report.
     * @example
     * // Update one Report
     * const report = await prisma.report.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReportUpdateArgs>(args: SelectSubset<T, ReportUpdateArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Reports.
     * @param {ReportDeleteManyArgs} args - Arguments to filter Reports to delete.
     * @example
     * // Delete a few Reports
     * const { count } = await prisma.report.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReportDeleteManyArgs>(args?: SelectSubset<T, ReportDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Reports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Reports
     * const report = await prisma.report.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReportUpdateManyArgs>(args: SelectSubset<T, ReportUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Report.
     * @param {ReportUpsertArgs} args - Arguments to update or create a Report.
     * @example
     * // Update or create a Report
     * const report = await prisma.report.upsert({
     *   create: {
     *     // ... data to create a Report
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Report we want to update
     *   }
     * })
     */
    upsert<T extends ReportUpsertArgs>(args: SelectSubset<T, ReportUpsertArgs<ExtArgs>>): Prisma__ReportClient<$Result.GetResult<Prisma.$ReportPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Reports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportCountArgs} args - Arguments to filter Reports to count.
     * @example
     * // Count the number of Reports
     * const count = await prisma.report.count({
     *   where: {
     *     // ... the filter for the Reports we want to count
     *   }
     * })
    **/
    count<T extends ReportCountArgs>(
      args?: Subset<T, ReportCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReportCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Report.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ReportAggregateArgs>(args: Subset<T, ReportAggregateArgs>): Prisma.PrismaPromise<GetReportAggregateType<T>>

    /**
     * Group by Report.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReportGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ReportGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReportGroupByArgs['orderBy'] }
        : { orderBy?: ReportGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ReportGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReportGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Report model
   */
  readonly fields: ReportFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Report.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReportClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    session<T extends InterviewSessionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, InterviewSessionDefaultArgs<ExtArgs>>): Prisma__InterviewSessionClient<$Result.GetResult<Prisma.$InterviewSessionPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Report model
   */ 
  interface ReportFieldRefs {
    readonly id: FieldRef<"Report", 'String'>
    readonly sessionId: FieldRef<"Report", 'String'>
    readonly candidateName: FieldRef<"Report", 'String'>
    readonly roleName: FieldRef<"Report", 'String'>
    readonly reportData: FieldRef<"Report", 'Json'>
    readonly createdAt: FieldRef<"Report", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Report findUnique
   */
  export type ReportFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
    /**
     * Filter, which Report to fetch.
     */
    where: ReportWhereUniqueInput
  }

  /**
   * Report findUniqueOrThrow
   */
  export type ReportFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
    /**
     * Filter, which Report to fetch.
     */
    where: ReportWhereUniqueInput
  }

  /**
   * Report findFirst
   */
  export type ReportFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
    /**
     * Filter, which Report to fetch.
     */
    where?: ReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reports to fetch.
     */
    orderBy?: ReportOrderByWithRelationInput | ReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reports.
     */
    cursor?: ReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reports.
     */
    distinct?: ReportScalarFieldEnum | ReportScalarFieldEnum[]
  }

  /**
   * Report findFirstOrThrow
   */
  export type ReportFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
    /**
     * Filter, which Report to fetch.
     */
    where?: ReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reports to fetch.
     */
    orderBy?: ReportOrderByWithRelationInput | ReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Reports.
     */
    cursor?: ReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Reports.
     */
    distinct?: ReportScalarFieldEnum | ReportScalarFieldEnum[]
  }

  /**
   * Report findMany
   */
  export type ReportFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
    /**
     * Filter, which Reports to fetch.
     */
    where?: ReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Reports to fetch.
     */
    orderBy?: ReportOrderByWithRelationInput | ReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Reports.
     */
    cursor?: ReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Reports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Reports.
     */
    skip?: number
    distinct?: ReportScalarFieldEnum | ReportScalarFieldEnum[]
  }

  /**
   * Report create
   */
  export type ReportCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
    /**
     * The data needed to create a Report.
     */
    data: XOR<ReportCreateInput, ReportUncheckedCreateInput>
  }

  /**
   * Report createMany
   */
  export type ReportCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Reports.
     */
    data: ReportCreateManyInput | ReportCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Report createManyAndReturn
   */
  export type ReportCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Reports.
     */
    data: ReportCreateManyInput | ReportCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Report update
   */
  export type ReportUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
    /**
     * The data needed to update a Report.
     */
    data: XOR<ReportUpdateInput, ReportUncheckedUpdateInput>
    /**
     * Choose, which Report to update.
     */
    where: ReportWhereUniqueInput
  }

  /**
   * Report updateMany
   */
  export type ReportUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Reports.
     */
    data: XOR<ReportUpdateManyMutationInput, ReportUncheckedUpdateManyInput>
    /**
     * Filter which Reports to update
     */
    where?: ReportWhereInput
  }

  /**
   * Report upsert
   */
  export type ReportUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
    /**
     * The filter to search for the Report to update in case it exists.
     */
    where: ReportWhereUniqueInput
    /**
     * In case the Report found by the `where` argument doesn't exist, create a new Report with this data.
     */
    create: XOR<ReportCreateInput, ReportUncheckedCreateInput>
    /**
     * In case the Report was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReportUpdateInput, ReportUncheckedUpdateInput>
  }

  /**
   * Report delete
   */
  export type ReportDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
    /**
     * Filter which Report to delete.
     */
    where: ReportWhereUniqueInput
  }

  /**
   * Report deleteMany
   */
  export type ReportDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Reports to delete
     */
    where?: ReportWhereInput
  }

  /**
   * Report without action
   */
  export type ReportDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Report
     */
    select?: ReportSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ReportInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const OrganizationScalarFieldEnum: {
    id: 'id',
    name: 'name',
    settings: 'settings',
    createdAt: 'createdAt'
  };

  export type OrganizationScalarFieldEnum = (typeof OrganizationScalarFieldEnum)[keyof typeof OrganizationScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    name: 'name',
    role: 'role',
    organizationId: 'organizationId',
    createdAt: 'createdAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const InterviewSessionScalarFieldEnum: {
    id: 'id',
    organizationId: 'organizationId',
    setup: 'setup',
    status: 'status',
    startedAt: 'startedAt',
    endedAt: 'endedAt',
    voiceProvider: 'voiceProvider',
    createdAt: 'createdAt'
  };

  export type InterviewSessionScalarFieldEnum = (typeof InterviewSessionScalarFieldEnum)[keyof typeof InterviewSessionScalarFieldEnum]


  export const TranscriptEntryScalarFieldEnum: {
    id: 'id',
    sessionId: 'sessionId',
    speaker: 'speaker',
    text: 'text',
    timestamp: 'timestamp',
    audioTimestamp: 'audioTimestamp'
  };

  export type TranscriptEntryScalarFieldEnum = (typeof TranscriptEntryScalarFieldEnum)[keyof typeof TranscriptEntryScalarFieldEnum]


  export const ObservationScalarFieldEnum: {
    id: 'id',
    sessionId: 'sessionId',
    type: 'type',
    dimension: 'dimension',
    gate: 'gate',
    description: 'description',
    evidence: 'evidence',
    confidence: 'confidence',
    timestamp: 'timestamp'
  };

  export type ObservationScalarFieldEnum = (typeof ObservationScalarFieldEnum)[keyof typeof ObservationScalarFieldEnum]


  export const AssessorVerdictScalarFieldEnum: {
    id: 'id',
    sessionId: 'sessionId',
    role: 'role',
    recommendation: 'recommendation',
    confidence: 'confidence',
    narrative: 'narrative',
    dimensionScores: 'dimensionScores',
    deepSignalScores: 'deepSignalScores',
    psychologicalScreening: 'psychologicalScreening',
    gateEvaluations: 'gateEvaluations',
    keyInsights: 'keyInsights',
    dissent: 'dissent'
  };

  export type AssessorVerdictScalarFieldEnum = (typeof AssessorVerdictScalarFieldEnum)[keyof typeof AssessorVerdictScalarFieldEnum]


  export const ReportScalarFieldEnum: {
    id: 'id',
    sessionId: 'sessionId',
    candidateName: 'candidateName',
    roleName: 'roleName',
    reportData: 'reportData',
    createdAt: 'createdAt'
  };

  export type ReportScalarFieldEnum = (typeof ReportScalarFieldEnum)[keyof typeof ReportScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type OrganizationWhereInput = {
    AND?: OrganizationWhereInput | OrganizationWhereInput[]
    OR?: OrganizationWhereInput[]
    NOT?: OrganizationWhereInput | OrganizationWhereInput[]
    id?: StringFilter<"Organization"> | string
    name?: StringFilter<"Organization"> | string
    settings?: JsonFilter<"Organization">
    createdAt?: DateTimeFilter<"Organization"> | Date | string
    users?: UserListRelationFilter
    sessions?: InterviewSessionListRelationFilter
  }

  export type OrganizationOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    settings?: SortOrder
    createdAt?: SortOrder
    users?: UserOrderByRelationAggregateInput
    sessions?: InterviewSessionOrderByRelationAggregateInput
  }

  export type OrganizationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: OrganizationWhereInput | OrganizationWhereInput[]
    OR?: OrganizationWhereInput[]
    NOT?: OrganizationWhereInput | OrganizationWhereInput[]
    name?: StringFilter<"Organization"> | string
    settings?: JsonFilter<"Organization">
    createdAt?: DateTimeFilter<"Organization"> | Date | string
    users?: UserListRelationFilter
    sessions?: InterviewSessionListRelationFilter
  }, "id">

  export type OrganizationOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    settings?: SortOrder
    createdAt?: SortOrder
    _count?: OrganizationCountOrderByAggregateInput
    _max?: OrganizationMaxOrderByAggregateInput
    _min?: OrganizationMinOrderByAggregateInput
  }

  export type OrganizationScalarWhereWithAggregatesInput = {
    AND?: OrganizationScalarWhereWithAggregatesInput | OrganizationScalarWhereWithAggregatesInput[]
    OR?: OrganizationScalarWhereWithAggregatesInput[]
    NOT?: OrganizationScalarWhereWithAggregatesInput | OrganizationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Organization"> | string
    name?: StringWithAggregatesFilter<"Organization"> | string
    settings?: JsonWithAggregatesFilter<"Organization">
    createdAt?: DateTimeWithAggregatesFilter<"Organization"> | Date | string
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    organizationId?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    organization?: XOR<OrganizationNullableRelationFilter, OrganizationWhereInput> | null
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    role?: SortOrder
    organizationId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    organization?: OrganizationOrderByWithRelationInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    organizationId?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    organization?: XOR<OrganizationNullableRelationFilter, OrganizationWhereInput> | null
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    role?: SortOrder
    organizationId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    role?: StringWithAggregatesFilter<"User"> | string
    organizationId?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type InterviewSessionWhereInput = {
    AND?: InterviewSessionWhereInput | InterviewSessionWhereInput[]
    OR?: InterviewSessionWhereInput[]
    NOT?: InterviewSessionWhereInput | InterviewSessionWhereInput[]
    id?: StringFilter<"InterviewSession"> | string
    organizationId?: StringNullableFilter<"InterviewSession"> | string | null
    setup?: JsonFilter<"InterviewSession">
    status?: StringFilter<"InterviewSession"> | string
    startedAt?: DateTimeNullableFilter<"InterviewSession"> | Date | string | null
    endedAt?: DateTimeNullableFilter<"InterviewSession"> | Date | string | null
    voiceProvider?: StringFilter<"InterviewSession"> | string
    createdAt?: DateTimeFilter<"InterviewSession"> | Date | string
    organization?: XOR<OrganizationNullableRelationFilter, OrganizationWhereInput> | null
    transcripts?: TranscriptEntryListRelationFilter
    observations?: ObservationListRelationFilter
    verdicts?: AssessorVerdictListRelationFilter
    reports?: ReportListRelationFilter
  }

  export type InterviewSessionOrderByWithRelationInput = {
    id?: SortOrder
    organizationId?: SortOrderInput | SortOrder
    setup?: SortOrder
    status?: SortOrder
    startedAt?: SortOrderInput | SortOrder
    endedAt?: SortOrderInput | SortOrder
    voiceProvider?: SortOrder
    createdAt?: SortOrder
    organization?: OrganizationOrderByWithRelationInput
    transcripts?: TranscriptEntryOrderByRelationAggregateInput
    observations?: ObservationOrderByRelationAggregateInput
    verdicts?: AssessorVerdictOrderByRelationAggregateInput
    reports?: ReportOrderByRelationAggregateInput
  }

  export type InterviewSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: InterviewSessionWhereInput | InterviewSessionWhereInput[]
    OR?: InterviewSessionWhereInput[]
    NOT?: InterviewSessionWhereInput | InterviewSessionWhereInput[]
    organizationId?: StringNullableFilter<"InterviewSession"> | string | null
    setup?: JsonFilter<"InterviewSession">
    status?: StringFilter<"InterviewSession"> | string
    startedAt?: DateTimeNullableFilter<"InterviewSession"> | Date | string | null
    endedAt?: DateTimeNullableFilter<"InterviewSession"> | Date | string | null
    voiceProvider?: StringFilter<"InterviewSession"> | string
    createdAt?: DateTimeFilter<"InterviewSession"> | Date | string
    organization?: XOR<OrganizationNullableRelationFilter, OrganizationWhereInput> | null
    transcripts?: TranscriptEntryListRelationFilter
    observations?: ObservationListRelationFilter
    verdicts?: AssessorVerdictListRelationFilter
    reports?: ReportListRelationFilter
  }, "id">

  export type InterviewSessionOrderByWithAggregationInput = {
    id?: SortOrder
    organizationId?: SortOrderInput | SortOrder
    setup?: SortOrder
    status?: SortOrder
    startedAt?: SortOrderInput | SortOrder
    endedAt?: SortOrderInput | SortOrder
    voiceProvider?: SortOrder
    createdAt?: SortOrder
    _count?: InterviewSessionCountOrderByAggregateInput
    _max?: InterviewSessionMaxOrderByAggregateInput
    _min?: InterviewSessionMinOrderByAggregateInput
  }

  export type InterviewSessionScalarWhereWithAggregatesInput = {
    AND?: InterviewSessionScalarWhereWithAggregatesInput | InterviewSessionScalarWhereWithAggregatesInput[]
    OR?: InterviewSessionScalarWhereWithAggregatesInput[]
    NOT?: InterviewSessionScalarWhereWithAggregatesInput | InterviewSessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"InterviewSession"> | string
    organizationId?: StringNullableWithAggregatesFilter<"InterviewSession"> | string | null
    setup?: JsonWithAggregatesFilter<"InterviewSession">
    status?: StringWithAggregatesFilter<"InterviewSession"> | string
    startedAt?: DateTimeNullableWithAggregatesFilter<"InterviewSession"> | Date | string | null
    endedAt?: DateTimeNullableWithAggregatesFilter<"InterviewSession"> | Date | string | null
    voiceProvider?: StringWithAggregatesFilter<"InterviewSession"> | string
    createdAt?: DateTimeWithAggregatesFilter<"InterviewSession"> | Date | string
  }

  export type TranscriptEntryWhereInput = {
    AND?: TranscriptEntryWhereInput | TranscriptEntryWhereInput[]
    OR?: TranscriptEntryWhereInput[]
    NOT?: TranscriptEntryWhereInput | TranscriptEntryWhereInput[]
    id?: StringFilter<"TranscriptEntry"> | string
    sessionId?: StringFilter<"TranscriptEntry"> | string
    speaker?: StringFilter<"TranscriptEntry"> | string
    text?: StringFilter<"TranscriptEntry"> | string
    timestamp?: DateTimeFilter<"TranscriptEntry"> | Date | string
    audioTimestamp?: FloatNullableFilter<"TranscriptEntry"> | number | null
    session?: XOR<InterviewSessionRelationFilter, InterviewSessionWhereInput>
  }

  export type TranscriptEntryOrderByWithRelationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    speaker?: SortOrder
    text?: SortOrder
    timestamp?: SortOrder
    audioTimestamp?: SortOrderInput | SortOrder
    session?: InterviewSessionOrderByWithRelationInput
  }

  export type TranscriptEntryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TranscriptEntryWhereInput | TranscriptEntryWhereInput[]
    OR?: TranscriptEntryWhereInput[]
    NOT?: TranscriptEntryWhereInput | TranscriptEntryWhereInput[]
    sessionId?: StringFilter<"TranscriptEntry"> | string
    speaker?: StringFilter<"TranscriptEntry"> | string
    text?: StringFilter<"TranscriptEntry"> | string
    timestamp?: DateTimeFilter<"TranscriptEntry"> | Date | string
    audioTimestamp?: FloatNullableFilter<"TranscriptEntry"> | number | null
    session?: XOR<InterviewSessionRelationFilter, InterviewSessionWhereInput>
  }, "id">

  export type TranscriptEntryOrderByWithAggregationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    speaker?: SortOrder
    text?: SortOrder
    timestamp?: SortOrder
    audioTimestamp?: SortOrderInput | SortOrder
    _count?: TranscriptEntryCountOrderByAggregateInput
    _avg?: TranscriptEntryAvgOrderByAggregateInput
    _max?: TranscriptEntryMaxOrderByAggregateInput
    _min?: TranscriptEntryMinOrderByAggregateInput
    _sum?: TranscriptEntrySumOrderByAggregateInput
  }

  export type TranscriptEntryScalarWhereWithAggregatesInput = {
    AND?: TranscriptEntryScalarWhereWithAggregatesInput | TranscriptEntryScalarWhereWithAggregatesInput[]
    OR?: TranscriptEntryScalarWhereWithAggregatesInput[]
    NOT?: TranscriptEntryScalarWhereWithAggregatesInput | TranscriptEntryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TranscriptEntry"> | string
    sessionId?: StringWithAggregatesFilter<"TranscriptEntry"> | string
    speaker?: StringWithAggregatesFilter<"TranscriptEntry"> | string
    text?: StringWithAggregatesFilter<"TranscriptEntry"> | string
    timestamp?: DateTimeWithAggregatesFilter<"TranscriptEntry"> | Date | string
    audioTimestamp?: FloatNullableWithAggregatesFilter<"TranscriptEntry"> | number | null
  }

  export type ObservationWhereInput = {
    AND?: ObservationWhereInput | ObservationWhereInput[]
    OR?: ObservationWhereInput[]
    NOT?: ObservationWhereInput | ObservationWhereInput[]
    id?: StringFilter<"Observation"> | string
    sessionId?: StringFilter<"Observation"> | string
    type?: StringFilter<"Observation"> | string
    dimension?: StringNullableFilter<"Observation"> | string | null
    gate?: StringNullableFilter<"Observation"> | string | null
    description?: StringFilter<"Observation"> | string
    evidence?: StringFilter<"Observation"> | string
    confidence?: FloatFilter<"Observation"> | number
    timestamp?: DateTimeFilter<"Observation"> | Date | string
    session?: XOR<InterviewSessionRelationFilter, InterviewSessionWhereInput>
  }

  export type ObservationOrderByWithRelationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    type?: SortOrder
    dimension?: SortOrderInput | SortOrder
    gate?: SortOrderInput | SortOrder
    description?: SortOrder
    evidence?: SortOrder
    confidence?: SortOrder
    timestamp?: SortOrder
    session?: InterviewSessionOrderByWithRelationInput
  }

  export type ObservationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ObservationWhereInput | ObservationWhereInput[]
    OR?: ObservationWhereInput[]
    NOT?: ObservationWhereInput | ObservationWhereInput[]
    sessionId?: StringFilter<"Observation"> | string
    type?: StringFilter<"Observation"> | string
    dimension?: StringNullableFilter<"Observation"> | string | null
    gate?: StringNullableFilter<"Observation"> | string | null
    description?: StringFilter<"Observation"> | string
    evidence?: StringFilter<"Observation"> | string
    confidence?: FloatFilter<"Observation"> | number
    timestamp?: DateTimeFilter<"Observation"> | Date | string
    session?: XOR<InterviewSessionRelationFilter, InterviewSessionWhereInput>
  }, "id">

  export type ObservationOrderByWithAggregationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    type?: SortOrder
    dimension?: SortOrderInput | SortOrder
    gate?: SortOrderInput | SortOrder
    description?: SortOrder
    evidence?: SortOrder
    confidence?: SortOrder
    timestamp?: SortOrder
    _count?: ObservationCountOrderByAggregateInput
    _avg?: ObservationAvgOrderByAggregateInput
    _max?: ObservationMaxOrderByAggregateInput
    _min?: ObservationMinOrderByAggregateInput
    _sum?: ObservationSumOrderByAggregateInput
  }

  export type ObservationScalarWhereWithAggregatesInput = {
    AND?: ObservationScalarWhereWithAggregatesInput | ObservationScalarWhereWithAggregatesInput[]
    OR?: ObservationScalarWhereWithAggregatesInput[]
    NOT?: ObservationScalarWhereWithAggregatesInput | ObservationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Observation"> | string
    sessionId?: StringWithAggregatesFilter<"Observation"> | string
    type?: StringWithAggregatesFilter<"Observation"> | string
    dimension?: StringNullableWithAggregatesFilter<"Observation"> | string | null
    gate?: StringNullableWithAggregatesFilter<"Observation"> | string | null
    description?: StringWithAggregatesFilter<"Observation"> | string
    evidence?: StringWithAggregatesFilter<"Observation"> | string
    confidence?: FloatWithAggregatesFilter<"Observation"> | number
    timestamp?: DateTimeWithAggregatesFilter<"Observation"> | Date | string
  }

  export type AssessorVerdictWhereInput = {
    AND?: AssessorVerdictWhereInput | AssessorVerdictWhereInput[]
    OR?: AssessorVerdictWhereInput[]
    NOT?: AssessorVerdictWhereInput | AssessorVerdictWhereInput[]
    id?: StringFilter<"AssessorVerdict"> | string
    sessionId?: StringFilter<"AssessorVerdict"> | string
    role?: StringFilter<"AssessorVerdict"> | string
    recommendation?: StringFilter<"AssessorVerdict"> | string
    confidence?: FloatFilter<"AssessorVerdict"> | number
    narrative?: StringFilter<"AssessorVerdict"> | string
    dimensionScores?: JsonFilter<"AssessorVerdict">
    deepSignalScores?: JsonNullableFilter<"AssessorVerdict">
    psychologicalScreening?: JsonNullableFilter<"AssessorVerdict">
    gateEvaluations?: JsonFilter<"AssessorVerdict">
    keyInsights?: JsonFilter<"AssessorVerdict">
    dissent?: StringNullableFilter<"AssessorVerdict"> | string | null
    session?: XOR<InterviewSessionRelationFilter, InterviewSessionWhereInput>
  }

  export type AssessorVerdictOrderByWithRelationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    role?: SortOrder
    recommendation?: SortOrder
    confidence?: SortOrder
    narrative?: SortOrder
    dimensionScores?: SortOrder
    deepSignalScores?: SortOrderInput | SortOrder
    psychologicalScreening?: SortOrderInput | SortOrder
    gateEvaluations?: SortOrder
    keyInsights?: SortOrder
    dissent?: SortOrderInput | SortOrder
    session?: InterviewSessionOrderByWithRelationInput
  }

  export type AssessorVerdictWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AssessorVerdictWhereInput | AssessorVerdictWhereInput[]
    OR?: AssessorVerdictWhereInput[]
    NOT?: AssessorVerdictWhereInput | AssessorVerdictWhereInput[]
    sessionId?: StringFilter<"AssessorVerdict"> | string
    role?: StringFilter<"AssessorVerdict"> | string
    recommendation?: StringFilter<"AssessorVerdict"> | string
    confidence?: FloatFilter<"AssessorVerdict"> | number
    narrative?: StringFilter<"AssessorVerdict"> | string
    dimensionScores?: JsonFilter<"AssessorVerdict">
    deepSignalScores?: JsonNullableFilter<"AssessorVerdict">
    psychologicalScreening?: JsonNullableFilter<"AssessorVerdict">
    gateEvaluations?: JsonFilter<"AssessorVerdict">
    keyInsights?: JsonFilter<"AssessorVerdict">
    dissent?: StringNullableFilter<"AssessorVerdict"> | string | null
    session?: XOR<InterviewSessionRelationFilter, InterviewSessionWhereInput>
  }, "id">

  export type AssessorVerdictOrderByWithAggregationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    role?: SortOrder
    recommendation?: SortOrder
    confidence?: SortOrder
    narrative?: SortOrder
    dimensionScores?: SortOrder
    deepSignalScores?: SortOrderInput | SortOrder
    psychologicalScreening?: SortOrderInput | SortOrder
    gateEvaluations?: SortOrder
    keyInsights?: SortOrder
    dissent?: SortOrderInput | SortOrder
    _count?: AssessorVerdictCountOrderByAggregateInput
    _avg?: AssessorVerdictAvgOrderByAggregateInput
    _max?: AssessorVerdictMaxOrderByAggregateInput
    _min?: AssessorVerdictMinOrderByAggregateInput
    _sum?: AssessorVerdictSumOrderByAggregateInput
  }

  export type AssessorVerdictScalarWhereWithAggregatesInput = {
    AND?: AssessorVerdictScalarWhereWithAggregatesInput | AssessorVerdictScalarWhereWithAggregatesInput[]
    OR?: AssessorVerdictScalarWhereWithAggregatesInput[]
    NOT?: AssessorVerdictScalarWhereWithAggregatesInput | AssessorVerdictScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AssessorVerdict"> | string
    sessionId?: StringWithAggregatesFilter<"AssessorVerdict"> | string
    role?: StringWithAggregatesFilter<"AssessorVerdict"> | string
    recommendation?: StringWithAggregatesFilter<"AssessorVerdict"> | string
    confidence?: FloatWithAggregatesFilter<"AssessorVerdict"> | number
    narrative?: StringWithAggregatesFilter<"AssessorVerdict"> | string
    dimensionScores?: JsonWithAggregatesFilter<"AssessorVerdict">
    deepSignalScores?: JsonNullableWithAggregatesFilter<"AssessorVerdict">
    psychologicalScreening?: JsonNullableWithAggregatesFilter<"AssessorVerdict">
    gateEvaluations?: JsonWithAggregatesFilter<"AssessorVerdict">
    keyInsights?: JsonWithAggregatesFilter<"AssessorVerdict">
    dissent?: StringNullableWithAggregatesFilter<"AssessorVerdict"> | string | null
  }

  export type ReportWhereInput = {
    AND?: ReportWhereInput | ReportWhereInput[]
    OR?: ReportWhereInput[]
    NOT?: ReportWhereInput | ReportWhereInput[]
    id?: StringFilter<"Report"> | string
    sessionId?: StringFilter<"Report"> | string
    candidateName?: StringFilter<"Report"> | string
    roleName?: StringFilter<"Report"> | string
    reportData?: JsonFilter<"Report">
    createdAt?: DateTimeFilter<"Report"> | Date | string
    session?: XOR<InterviewSessionRelationFilter, InterviewSessionWhereInput>
  }

  export type ReportOrderByWithRelationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    candidateName?: SortOrder
    roleName?: SortOrder
    reportData?: SortOrder
    createdAt?: SortOrder
    session?: InterviewSessionOrderByWithRelationInput
  }

  export type ReportWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ReportWhereInput | ReportWhereInput[]
    OR?: ReportWhereInput[]
    NOT?: ReportWhereInput | ReportWhereInput[]
    sessionId?: StringFilter<"Report"> | string
    candidateName?: StringFilter<"Report"> | string
    roleName?: StringFilter<"Report"> | string
    reportData?: JsonFilter<"Report">
    createdAt?: DateTimeFilter<"Report"> | Date | string
    session?: XOR<InterviewSessionRelationFilter, InterviewSessionWhereInput>
  }, "id">

  export type ReportOrderByWithAggregationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    candidateName?: SortOrder
    roleName?: SortOrder
    reportData?: SortOrder
    createdAt?: SortOrder
    _count?: ReportCountOrderByAggregateInput
    _max?: ReportMaxOrderByAggregateInput
    _min?: ReportMinOrderByAggregateInput
  }

  export type ReportScalarWhereWithAggregatesInput = {
    AND?: ReportScalarWhereWithAggregatesInput | ReportScalarWhereWithAggregatesInput[]
    OR?: ReportScalarWhereWithAggregatesInput[]
    NOT?: ReportScalarWhereWithAggregatesInput | ReportScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Report"> | string
    sessionId?: StringWithAggregatesFilter<"Report"> | string
    candidateName?: StringWithAggregatesFilter<"Report"> | string
    roleName?: StringWithAggregatesFilter<"Report"> | string
    reportData?: JsonWithAggregatesFilter<"Report">
    createdAt?: DateTimeWithAggregatesFilter<"Report"> | Date | string
  }

  export type OrganizationCreateInput = {
    id?: string
    name: string
    settings?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    users?: UserCreateNestedManyWithoutOrganizationInput
    sessions?: InterviewSessionCreateNestedManyWithoutOrganizationInput
  }

  export type OrganizationUncheckedCreateInput = {
    id?: string
    name: string
    settings?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutOrganizationInput
    sessions?: InterviewSessionUncheckedCreateNestedManyWithoutOrganizationInput
  }

  export type OrganizationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    settings?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutOrganizationNestedInput
    sessions?: InterviewSessionUpdateManyWithoutOrganizationNestedInput
  }

  export type OrganizationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    settings?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutOrganizationNestedInput
    sessions?: InterviewSessionUncheckedUpdateManyWithoutOrganizationNestedInput
  }

  export type OrganizationCreateManyInput = {
    id?: string
    name: string
    settings?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type OrganizationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    settings?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrganizationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    settings?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    name: string
    role?: string
    createdAt?: Date | string
    organization?: OrganizationCreateNestedOneWithoutUsersInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    name: string
    role?: string
    organizationId?: string | null
    createdAt?: Date | string
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organization?: OrganizationUpdateOneWithoutUsersNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    name: string
    role?: string
    organizationId?: string | null
    createdAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InterviewSessionCreateInput = {
    id?: string
    setup: JsonNullValueInput | InputJsonValue
    status?: string
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    voiceProvider?: string
    createdAt?: Date | string
    organization?: OrganizationCreateNestedOneWithoutSessionsInput
    transcripts?: TranscriptEntryCreateNestedManyWithoutSessionInput
    observations?: ObservationCreateNestedManyWithoutSessionInput
    verdicts?: AssessorVerdictCreateNestedManyWithoutSessionInput
    reports?: ReportCreateNestedManyWithoutSessionInput
  }

  export type InterviewSessionUncheckedCreateInput = {
    id?: string
    organizationId?: string | null
    setup: JsonNullValueInput | InputJsonValue
    status?: string
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    voiceProvider?: string
    createdAt?: Date | string
    transcripts?: TranscriptEntryUncheckedCreateNestedManyWithoutSessionInput
    observations?: ObservationUncheckedCreateNestedManyWithoutSessionInput
    verdicts?: AssessorVerdictUncheckedCreateNestedManyWithoutSessionInput
    reports?: ReportUncheckedCreateNestedManyWithoutSessionInput
  }

  export type InterviewSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    setup?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voiceProvider?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organization?: OrganizationUpdateOneWithoutSessionsNestedInput
    transcripts?: TranscriptEntryUpdateManyWithoutSessionNestedInput
    observations?: ObservationUpdateManyWithoutSessionNestedInput
    verdicts?: AssessorVerdictUpdateManyWithoutSessionNestedInput
    reports?: ReportUpdateManyWithoutSessionNestedInput
  }

  export type InterviewSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    setup?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voiceProvider?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transcripts?: TranscriptEntryUncheckedUpdateManyWithoutSessionNestedInput
    observations?: ObservationUncheckedUpdateManyWithoutSessionNestedInput
    verdicts?: AssessorVerdictUncheckedUpdateManyWithoutSessionNestedInput
    reports?: ReportUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type InterviewSessionCreateManyInput = {
    id?: string
    organizationId?: string | null
    setup: JsonNullValueInput | InputJsonValue
    status?: string
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    voiceProvider?: string
    createdAt?: Date | string
  }

  export type InterviewSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    setup?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voiceProvider?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InterviewSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    setup?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voiceProvider?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TranscriptEntryCreateInput = {
    id?: string
    speaker: string
    text: string
    timestamp: Date | string
    audioTimestamp?: number | null
    session: InterviewSessionCreateNestedOneWithoutTranscriptsInput
  }

  export type TranscriptEntryUncheckedCreateInput = {
    id?: string
    sessionId: string
    speaker: string
    text: string
    timestamp: Date | string
    audioTimestamp?: number | null
  }

  export type TranscriptEntryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    speaker?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    audioTimestamp?: NullableFloatFieldUpdateOperationsInput | number | null
    session?: InterviewSessionUpdateOneRequiredWithoutTranscriptsNestedInput
  }

  export type TranscriptEntryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    speaker?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    audioTimestamp?: NullableFloatFieldUpdateOperationsInput | number | null
  }

  export type TranscriptEntryCreateManyInput = {
    id?: string
    sessionId: string
    speaker: string
    text: string
    timestamp: Date | string
    audioTimestamp?: number | null
  }

  export type TranscriptEntryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    speaker?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    audioTimestamp?: NullableFloatFieldUpdateOperationsInput | number | null
  }

  export type TranscriptEntryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    speaker?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    audioTimestamp?: NullableFloatFieldUpdateOperationsInput | number | null
  }

  export type ObservationCreateInput = {
    id?: string
    type: string
    dimension?: string | null
    gate?: string | null
    description: string
    evidence: string
    confidence: number
    timestamp: Date | string
    session: InterviewSessionCreateNestedOneWithoutObservationsInput
  }

  export type ObservationUncheckedCreateInput = {
    id?: string
    sessionId: string
    type: string
    dimension?: string | null
    gate?: string | null
    description: string
    evidence: string
    confidence: number
    timestamp: Date | string
  }

  export type ObservationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    dimension?: NullableStringFieldUpdateOperationsInput | string | null
    gate?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    evidence?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    session?: InterviewSessionUpdateOneRequiredWithoutObservationsNestedInput
  }

  export type ObservationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    dimension?: NullableStringFieldUpdateOperationsInput | string | null
    gate?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    evidence?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ObservationCreateManyInput = {
    id?: string
    sessionId: string
    type: string
    dimension?: string | null
    gate?: string | null
    description: string
    evidence: string
    confidence: number
    timestamp: Date | string
  }

  export type ObservationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    dimension?: NullableStringFieldUpdateOperationsInput | string | null
    gate?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    evidence?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ObservationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    dimension?: NullableStringFieldUpdateOperationsInput | string | null
    gate?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    evidence?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssessorVerdictCreateInput = {
    id?: string
    role: string
    recommendation: string
    confidence: number
    narrative: string
    dimensionScores: JsonNullValueInput | InputJsonValue
    deepSignalScores?: NullableJsonNullValueInput | InputJsonValue
    psychologicalScreening?: NullableJsonNullValueInput | InputJsonValue
    gateEvaluations: JsonNullValueInput | InputJsonValue
    keyInsights: JsonNullValueInput | InputJsonValue
    dissent?: string | null
    session: InterviewSessionCreateNestedOneWithoutVerdictsInput
  }

  export type AssessorVerdictUncheckedCreateInput = {
    id?: string
    sessionId: string
    role: string
    recommendation: string
    confidence: number
    narrative: string
    dimensionScores: JsonNullValueInput | InputJsonValue
    deepSignalScores?: NullableJsonNullValueInput | InputJsonValue
    psychologicalScreening?: NullableJsonNullValueInput | InputJsonValue
    gateEvaluations: JsonNullValueInput | InputJsonValue
    keyInsights: JsonNullValueInput | InputJsonValue
    dissent?: string | null
  }

  export type AssessorVerdictUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    recommendation?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    narrative?: StringFieldUpdateOperationsInput | string
    dimensionScores?: JsonNullValueInput | InputJsonValue
    deepSignalScores?: NullableJsonNullValueInput | InputJsonValue
    psychologicalScreening?: NullableJsonNullValueInput | InputJsonValue
    gateEvaluations?: JsonNullValueInput | InputJsonValue
    keyInsights?: JsonNullValueInput | InputJsonValue
    dissent?: NullableStringFieldUpdateOperationsInput | string | null
    session?: InterviewSessionUpdateOneRequiredWithoutVerdictsNestedInput
  }

  export type AssessorVerdictUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    recommendation?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    narrative?: StringFieldUpdateOperationsInput | string
    dimensionScores?: JsonNullValueInput | InputJsonValue
    deepSignalScores?: NullableJsonNullValueInput | InputJsonValue
    psychologicalScreening?: NullableJsonNullValueInput | InputJsonValue
    gateEvaluations?: JsonNullValueInput | InputJsonValue
    keyInsights?: JsonNullValueInput | InputJsonValue
    dissent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AssessorVerdictCreateManyInput = {
    id?: string
    sessionId: string
    role: string
    recommendation: string
    confidence: number
    narrative: string
    dimensionScores: JsonNullValueInput | InputJsonValue
    deepSignalScores?: NullableJsonNullValueInput | InputJsonValue
    psychologicalScreening?: NullableJsonNullValueInput | InputJsonValue
    gateEvaluations: JsonNullValueInput | InputJsonValue
    keyInsights: JsonNullValueInput | InputJsonValue
    dissent?: string | null
  }

  export type AssessorVerdictUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    recommendation?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    narrative?: StringFieldUpdateOperationsInput | string
    dimensionScores?: JsonNullValueInput | InputJsonValue
    deepSignalScores?: NullableJsonNullValueInput | InputJsonValue
    psychologicalScreening?: NullableJsonNullValueInput | InputJsonValue
    gateEvaluations?: JsonNullValueInput | InputJsonValue
    keyInsights?: JsonNullValueInput | InputJsonValue
    dissent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AssessorVerdictUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    recommendation?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    narrative?: StringFieldUpdateOperationsInput | string
    dimensionScores?: JsonNullValueInput | InputJsonValue
    deepSignalScores?: NullableJsonNullValueInput | InputJsonValue
    psychologicalScreening?: NullableJsonNullValueInput | InputJsonValue
    gateEvaluations?: JsonNullValueInput | InputJsonValue
    keyInsights?: JsonNullValueInput | InputJsonValue
    dissent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ReportCreateInput = {
    id?: string
    candidateName: string
    roleName: string
    reportData: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    session: InterviewSessionCreateNestedOneWithoutReportsInput
  }

  export type ReportUncheckedCreateInput = {
    id?: string
    sessionId: string
    candidateName: string
    roleName: string
    reportData: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type ReportUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    candidateName?: StringFieldUpdateOperationsInput | string
    roleName?: StringFieldUpdateOperationsInput | string
    reportData?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    session?: InterviewSessionUpdateOneRequiredWithoutReportsNestedInput
  }

  export type ReportUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    candidateName?: StringFieldUpdateOperationsInput | string
    roleName?: StringFieldUpdateOperationsInput | string
    reportData?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReportCreateManyInput = {
    id?: string
    sessionId: string
    candidateName: string
    roleName: string
    reportData: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type ReportUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    candidateName?: StringFieldUpdateOperationsInput | string
    roleName?: StringFieldUpdateOperationsInput | string
    reportData?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReportUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionId?: StringFieldUpdateOperationsInput | string
    candidateName?: StringFieldUpdateOperationsInput | string
    roleName?: StringFieldUpdateOperationsInput | string
    reportData?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }
  export type JsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type UserListRelationFilter = {
    every?: UserWhereInput
    some?: UserWhereInput
    none?: UserWhereInput
  }

  export type InterviewSessionListRelationFilter = {
    every?: InterviewSessionWhereInput
    some?: InterviewSessionWhereInput
    none?: InterviewSessionWhereInput
  }

  export type UserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type InterviewSessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type OrganizationCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    settings?: SortOrder
    createdAt?: SortOrder
  }

  export type OrganizationMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
  }

  export type OrganizationMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type OrganizationNullableRelationFilter = {
    is?: OrganizationWhereInput | null
    isNot?: OrganizationWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    role?: SortOrder
    organizationId?: SortOrder
    createdAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    role?: SortOrder
    organizationId?: SortOrder
    createdAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    role?: SortOrder
    organizationId?: SortOrder
    createdAt?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type TranscriptEntryListRelationFilter = {
    every?: TranscriptEntryWhereInput
    some?: TranscriptEntryWhereInput
    none?: TranscriptEntryWhereInput
  }

  export type ObservationListRelationFilter = {
    every?: ObservationWhereInput
    some?: ObservationWhereInput
    none?: ObservationWhereInput
  }

  export type AssessorVerdictListRelationFilter = {
    every?: AssessorVerdictWhereInput
    some?: AssessorVerdictWhereInput
    none?: AssessorVerdictWhereInput
  }

  export type ReportListRelationFilter = {
    every?: ReportWhereInput
    some?: ReportWhereInput
    none?: ReportWhereInput
  }

  export type TranscriptEntryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ObservationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AssessorVerdictOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ReportOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type InterviewSessionCountOrderByAggregateInput = {
    id?: SortOrder
    organizationId?: SortOrder
    setup?: SortOrder
    status?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
    voiceProvider?: SortOrder
    createdAt?: SortOrder
  }

  export type InterviewSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    organizationId?: SortOrder
    status?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
    voiceProvider?: SortOrder
    createdAt?: SortOrder
  }

  export type InterviewSessionMinOrderByAggregateInput = {
    id?: SortOrder
    organizationId?: SortOrder
    status?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
    voiceProvider?: SortOrder
    createdAt?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type InterviewSessionRelationFilter = {
    is?: InterviewSessionWhereInput
    isNot?: InterviewSessionWhereInput
  }

  export type TranscriptEntryCountOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    speaker?: SortOrder
    text?: SortOrder
    timestamp?: SortOrder
    audioTimestamp?: SortOrder
  }

  export type TranscriptEntryAvgOrderByAggregateInput = {
    audioTimestamp?: SortOrder
  }

  export type TranscriptEntryMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    speaker?: SortOrder
    text?: SortOrder
    timestamp?: SortOrder
    audioTimestamp?: SortOrder
  }

  export type TranscriptEntryMinOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    speaker?: SortOrder
    text?: SortOrder
    timestamp?: SortOrder
    audioTimestamp?: SortOrder
  }

  export type TranscriptEntrySumOrderByAggregateInput = {
    audioTimestamp?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type ObservationCountOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    type?: SortOrder
    dimension?: SortOrder
    gate?: SortOrder
    description?: SortOrder
    evidence?: SortOrder
    confidence?: SortOrder
    timestamp?: SortOrder
  }

  export type ObservationAvgOrderByAggregateInput = {
    confidence?: SortOrder
  }

  export type ObservationMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    type?: SortOrder
    dimension?: SortOrder
    gate?: SortOrder
    description?: SortOrder
    evidence?: SortOrder
    confidence?: SortOrder
    timestamp?: SortOrder
  }

  export type ObservationMinOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    type?: SortOrder
    dimension?: SortOrder
    gate?: SortOrder
    description?: SortOrder
    evidence?: SortOrder
    confidence?: SortOrder
    timestamp?: SortOrder
  }

  export type ObservationSumOrderByAggregateInput = {
    confidence?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }
  export type JsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type AssessorVerdictCountOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    role?: SortOrder
    recommendation?: SortOrder
    confidence?: SortOrder
    narrative?: SortOrder
    dimensionScores?: SortOrder
    deepSignalScores?: SortOrder
    psychologicalScreening?: SortOrder
    gateEvaluations?: SortOrder
    keyInsights?: SortOrder
    dissent?: SortOrder
  }

  export type AssessorVerdictAvgOrderByAggregateInput = {
    confidence?: SortOrder
  }

  export type AssessorVerdictMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    role?: SortOrder
    recommendation?: SortOrder
    confidence?: SortOrder
    narrative?: SortOrder
    dissent?: SortOrder
  }

  export type AssessorVerdictMinOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    role?: SortOrder
    recommendation?: SortOrder
    confidence?: SortOrder
    narrative?: SortOrder
    dissent?: SortOrder
  }

  export type AssessorVerdictSumOrderByAggregateInput = {
    confidence?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type ReportCountOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    candidateName?: SortOrder
    roleName?: SortOrder
    reportData?: SortOrder
    createdAt?: SortOrder
  }

  export type ReportMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    candidateName?: SortOrder
    roleName?: SortOrder
    createdAt?: SortOrder
  }

  export type ReportMinOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    candidateName?: SortOrder
    roleName?: SortOrder
    createdAt?: SortOrder
  }

  export type UserCreateNestedManyWithoutOrganizationInput = {
    create?: XOR<UserCreateWithoutOrganizationInput, UserUncheckedCreateWithoutOrganizationInput> | UserCreateWithoutOrganizationInput[] | UserUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: UserCreateOrConnectWithoutOrganizationInput | UserCreateOrConnectWithoutOrganizationInput[]
    createMany?: UserCreateManyOrganizationInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type InterviewSessionCreateNestedManyWithoutOrganizationInput = {
    create?: XOR<InterviewSessionCreateWithoutOrganizationInput, InterviewSessionUncheckedCreateWithoutOrganizationInput> | InterviewSessionCreateWithoutOrganizationInput[] | InterviewSessionUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: InterviewSessionCreateOrConnectWithoutOrganizationInput | InterviewSessionCreateOrConnectWithoutOrganizationInput[]
    createMany?: InterviewSessionCreateManyOrganizationInputEnvelope
    connect?: InterviewSessionWhereUniqueInput | InterviewSessionWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutOrganizationInput = {
    create?: XOR<UserCreateWithoutOrganizationInput, UserUncheckedCreateWithoutOrganizationInput> | UserCreateWithoutOrganizationInput[] | UserUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: UserCreateOrConnectWithoutOrganizationInput | UserCreateOrConnectWithoutOrganizationInput[]
    createMany?: UserCreateManyOrganizationInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type InterviewSessionUncheckedCreateNestedManyWithoutOrganizationInput = {
    create?: XOR<InterviewSessionCreateWithoutOrganizationInput, InterviewSessionUncheckedCreateWithoutOrganizationInput> | InterviewSessionCreateWithoutOrganizationInput[] | InterviewSessionUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: InterviewSessionCreateOrConnectWithoutOrganizationInput | InterviewSessionCreateOrConnectWithoutOrganizationInput[]
    createMany?: InterviewSessionCreateManyOrganizationInputEnvelope
    connect?: InterviewSessionWhereUniqueInput | InterviewSessionWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type UserUpdateManyWithoutOrganizationNestedInput = {
    create?: XOR<UserCreateWithoutOrganizationInput, UserUncheckedCreateWithoutOrganizationInput> | UserCreateWithoutOrganizationInput[] | UserUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: UserCreateOrConnectWithoutOrganizationInput | UserCreateOrConnectWithoutOrganizationInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutOrganizationInput | UserUpsertWithWhereUniqueWithoutOrganizationInput[]
    createMany?: UserCreateManyOrganizationInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutOrganizationInput | UserUpdateWithWhereUniqueWithoutOrganizationInput[]
    updateMany?: UserUpdateManyWithWhereWithoutOrganizationInput | UserUpdateManyWithWhereWithoutOrganizationInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type InterviewSessionUpdateManyWithoutOrganizationNestedInput = {
    create?: XOR<InterviewSessionCreateWithoutOrganizationInput, InterviewSessionUncheckedCreateWithoutOrganizationInput> | InterviewSessionCreateWithoutOrganizationInput[] | InterviewSessionUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: InterviewSessionCreateOrConnectWithoutOrganizationInput | InterviewSessionCreateOrConnectWithoutOrganizationInput[]
    upsert?: InterviewSessionUpsertWithWhereUniqueWithoutOrganizationInput | InterviewSessionUpsertWithWhereUniqueWithoutOrganizationInput[]
    createMany?: InterviewSessionCreateManyOrganizationInputEnvelope
    set?: InterviewSessionWhereUniqueInput | InterviewSessionWhereUniqueInput[]
    disconnect?: InterviewSessionWhereUniqueInput | InterviewSessionWhereUniqueInput[]
    delete?: InterviewSessionWhereUniqueInput | InterviewSessionWhereUniqueInput[]
    connect?: InterviewSessionWhereUniqueInput | InterviewSessionWhereUniqueInput[]
    update?: InterviewSessionUpdateWithWhereUniqueWithoutOrganizationInput | InterviewSessionUpdateWithWhereUniqueWithoutOrganizationInput[]
    updateMany?: InterviewSessionUpdateManyWithWhereWithoutOrganizationInput | InterviewSessionUpdateManyWithWhereWithoutOrganizationInput[]
    deleteMany?: InterviewSessionScalarWhereInput | InterviewSessionScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutOrganizationNestedInput = {
    create?: XOR<UserCreateWithoutOrganizationInput, UserUncheckedCreateWithoutOrganizationInput> | UserCreateWithoutOrganizationInput[] | UserUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: UserCreateOrConnectWithoutOrganizationInput | UserCreateOrConnectWithoutOrganizationInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutOrganizationInput | UserUpsertWithWhereUniqueWithoutOrganizationInput[]
    createMany?: UserCreateManyOrganizationInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutOrganizationInput | UserUpdateWithWhereUniqueWithoutOrganizationInput[]
    updateMany?: UserUpdateManyWithWhereWithoutOrganizationInput | UserUpdateManyWithWhereWithoutOrganizationInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type InterviewSessionUncheckedUpdateManyWithoutOrganizationNestedInput = {
    create?: XOR<InterviewSessionCreateWithoutOrganizationInput, InterviewSessionUncheckedCreateWithoutOrganizationInput> | InterviewSessionCreateWithoutOrganizationInput[] | InterviewSessionUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: InterviewSessionCreateOrConnectWithoutOrganizationInput | InterviewSessionCreateOrConnectWithoutOrganizationInput[]
    upsert?: InterviewSessionUpsertWithWhereUniqueWithoutOrganizationInput | InterviewSessionUpsertWithWhereUniqueWithoutOrganizationInput[]
    createMany?: InterviewSessionCreateManyOrganizationInputEnvelope
    set?: InterviewSessionWhereUniqueInput | InterviewSessionWhereUniqueInput[]
    disconnect?: InterviewSessionWhereUniqueInput | InterviewSessionWhereUniqueInput[]
    delete?: InterviewSessionWhereUniqueInput | InterviewSessionWhereUniqueInput[]
    connect?: InterviewSessionWhereUniqueInput | InterviewSessionWhereUniqueInput[]
    update?: InterviewSessionUpdateWithWhereUniqueWithoutOrganizationInput | InterviewSessionUpdateWithWhereUniqueWithoutOrganizationInput[]
    updateMany?: InterviewSessionUpdateManyWithWhereWithoutOrganizationInput | InterviewSessionUpdateManyWithWhereWithoutOrganizationInput[]
    deleteMany?: InterviewSessionScalarWhereInput | InterviewSessionScalarWhereInput[]
  }

  export type OrganizationCreateNestedOneWithoutUsersInput = {
    create?: XOR<OrganizationCreateWithoutUsersInput, OrganizationUncheckedCreateWithoutUsersInput>
    connectOrCreate?: OrganizationCreateOrConnectWithoutUsersInput
    connect?: OrganizationWhereUniqueInput
  }

  export type OrganizationUpdateOneWithoutUsersNestedInput = {
    create?: XOR<OrganizationCreateWithoutUsersInput, OrganizationUncheckedCreateWithoutUsersInput>
    connectOrCreate?: OrganizationCreateOrConnectWithoutUsersInput
    upsert?: OrganizationUpsertWithoutUsersInput
    disconnect?: OrganizationWhereInput | boolean
    delete?: OrganizationWhereInput | boolean
    connect?: OrganizationWhereUniqueInput
    update?: XOR<XOR<OrganizationUpdateToOneWithWhereWithoutUsersInput, OrganizationUpdateWithoutUsersInput>, OrganizationUncheckedUpdateWithoutUsersInput>
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type OrganizationCreateNestedOneWithoutSessionsInput = {
    create?: XOR<OrganizationCreateWithoutSessionsInput, OrganizationUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: OrganizationCreateOrConnectWithoutSessionsInput
    connect?: OrganizationWhereUniqueInput
  }

  export type TranscriptEntryCreateNestedManyWithoutSessionInput = {
    create?: XOR<TranscriptEntryCreateWithoutSessionInput, TranscriptEntryUncheckedCreateWithoutSessionInput> | TranscriptEntryCreateWithoutSessionInput[] | TranscriptEntryUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: TranscriptEntryCreateOrConnectWithoutSessionInput | TranscriptEntryCreateOrConnectWithoutSessionInput[]
    createMany?: TranscriptEntryCreateManySessionInputEnvelope
    connect?: TranscriptEntryWhereUniqueInput | TranscriptEntryWhereUniqueInput[]
  }

  export type ObservationCreateNestedManyWithoutSessionInput = {
    create?: XOR<ObservationCreateWithoutSessionInput, ObservationUncheckedCreateWithoutSessionInput> | ObservationCreateWithoutSessionInput[] | ObservationUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: ObservationCreateOrConnectWithoutSessionInput | ObservationCreateOrConnectWithoutSessionInput[]
    createMany?: ObservationCreateManySessionInputEnvelope
    connect?: ObservationWhereUniqueInput | ObservationWhereUniqueInput[]
  }

  export type AssessorVerdictCreateNestedManyWithoutSessionInput = {
    create?: XOR<AssessorVerdictCreateWithoutSessionInput, AssessorVerdictUncheckedCreateWithoutSessionInput> | AssessorVerdictCreateWithoutSessionInput[] | AssessorVerdictUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: AssessorVerdictCreateOrConnectWithoutSessionInput | AssessorVerdictCreateOrConnectWithoutSessionInput[]
    createMany?: AssessorVerdictCreateManySessionInputEnvelope
    connect?: AssessorVerdictWhereUniqueInput | AssessorVerdictWhereUniqueInput[]
  }

  export type ReportCreateNestedManyWithoutSessionInput = {
    create?: XOR<ReportCreateWithoutSessionInput, ReportUncheckedCreateWithoutSessionInput> | ReportCreateWithoutSessionInput[] | ReportUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: ReportCreateOrConnectWithoutSessionInput | ReportCreateOrConnectWithoutSessionInput[]
    createMany?: ReportCreateManySessionInputEnvelope
    connect?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
  }

  export type TranscriptEntryUncheckedCreateNestedManyWithoutSessionInput = {
    create?: XOR<TranscriptEntryCreateWithoutSessionInput, TranscriptEntryUncheckedCreateWithoutSessionInput> | TranscriptEntryCreateWithoutSessionInput[] | TranscriptEntryUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: TranscriptEntryCreateOrConnectWithoutSessionInput | TranscriptEntryCreateOrConnectWithoutSessionInput[]
    createMany?: TranscriptEntryCreateManySessionInputEnvelope
    connect?: TranscriptEntryWhereUniqueInput | TranscriptEntryWhereUniqueInput[]
  }

  export type ObservationUncheckedCreateNestedManyWithoutSessionInput = {
    create?: XOR<ObservationCreateWithoutSessionInput, ObservationUncheckedCreateWithoutSessionInput> | ObservationCreateWithoutSessionInput[] | ObservationUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: ObservationCreateOrConnectWithoutSessionInput | ObservationCreateOrConnectWithoutSessionInput[]
    createMany?: ObservationCreateManySessionInputEnvelope
    connect?: ObservationWhereUniqueInput | ObservationWhereUniqueInput[]
  }

  export type AssessorVerdictUncheckedCreateNestedManyWithoutSessionInput = {
    create?: XOR<AssessorVerdictCreateWithoutSessionInput, AssessorVerdictUncheckedCreateWithoutSessionInput> | AssessorVerdictCreateWithoutSessionInput[] | AssessorVerdictUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: AssessorVerdictCreateOrConnectWithoutSessionInput | AssessorVerdictCreateOrConnectWithoutSessionInput[]
    createMany?: AssessorVerdictCreateManySessionInputEnvelope
    connect?: AssessorVerdictWhereUniqueInput | AssessorVerdictWhereUniqueInput[]
  }

  export type ReportUncheckedCreateNestedManyWithoutSessionInput = {
    create?: XOR<ReportCreateWithoutSessionInput, ReportUncheckedCreateWithoutSessionInput> | ReportCreateWithoutSessionInput[] | ReportUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: ReportCreateOrConnectWithoutSessionInput | ReportCreateOrConnectWithoutSessionInput[]
    createMany?: ReportCreateManySessionInputEnvelope
    connect?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type OrganizationUpdateOneWithoutSessionsNestedInput = {
    create?: XOR<OrganizationCreateWithoutSessionsInput, OrganizationUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: OrganizationCreateOrConnectWithoutSessionsInput
    upsert?: OrganizationUpsertWithoutSessionsInput
    disconnect?: OrganizationWhereInput | boolean
    delete?: OrganizationWhereInput | boolean
    connect?: OrganizationWhereUniqueInput
    update?: XOR<XOR<OrganizationUpdateToOneWithWhereWithoutSessionsInput, OrganizationUpdateWithoutSessionsInput>, OrganizationUncheckedUpdateWithoutSessionsInput>
  }

  export type TranscriptEntryUpdateManyWithoutSessionNestedInput = {
    create?: XOR<TranscriptEntryCreateWithoutSessionInput, TranscriptEntryUncheckedCreateWithoutSessionInput> | TranscriptEntryCreateWithoutSessionInput[] | TranscriptEntryUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: TranscriptEntryCreateOrConnectWithoutSessionInput | TranscriptEntryCreateOrConnectWithoutSessionInput[]
    upsert?: TranscriptEntryUpsertWithWhereUniqueWithoutSessionInput | TranscriptEntryUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: TranscriptEntryCreateManySessionInputEnvelope
    set?: TranscriptEntryWhereUniqueInput | TranscriptEntryWhereUniqueInput[]
    disconnect?: TranscriptEntryWhereUniqueInput | TranscriptEntryWhereUniqueInput[]
    delete?: TranscriptEntryWhereUniqueInput | TranscriptEntryWhereUniqueInput[]
    connect?: TranscriptEntryWhereUniqueInput | TranscriptEntryWhereUniqueInput[]
    update?: TranscriptEntryUpdateWithWhereUniqueWithoutSessionInput | TranscriptEntryUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: TranscriptEntryUpdateManyWithWhereWithoutSessionInput | TranscriptEntryUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: TranscriptEntryScalarWhereInput | TranscriptEntryScalarWhereInput[]
  }

  export type ObservationUpdateManyWithoutSessionNestedInput = {
    create?: XOR<ObservationCreateWithoutSessionInput, ObservationUncheckedCreateWithoutSessionInput> | ObservationCreateWithoutSessionInput[] | ObservationUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: ObservationCreateOrConnectWithoutSessionInput | ObservationCreateOrConnectWithoutSessionInput[]
    upsert?: ObservationUpsertWithWhereUniqueWithoutSessionInput | ObservationUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: ObservationCreateManySessionInputEnvelope
    set?: ObservationWhereUniqueInput | ObservationWhereUniqueInput[]
    disconnect?: ObservationWhereUniqueInput | ObservationWhereUniqueInput[]
    delete?: ObservationWhereUniqueInput | ObservationWhereUniqueInput[]
    connect?: ObservationWhereUniqueInput | ObservationWhereUniqueInput[]
    update?: ObservationUpdateWithWhereUniqueWithoutSessionInput | ObservationUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: ObservationUpdateManyWithWhereWithoutSessionInput | ObservationUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: ObservationScalarWhereInput | ObservationScalarWhereInput[]
  }

  export type AssessorVerdictUpdateManyWithoutSessionNestedInput = {
    create?: XOR<AssessorVerdictCreateWithoutSessionInput, AssessorVerdictUncheckedCreateWithoutSessionInput> | AssessorVerdictCreateWithoutSessionInput[] | AssessorVerdictUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: AssessorVerdictCreateOrConnectWithoutSessionInput | AssessorVerdictCreateOrConnectWithoutSessionInput[]
    upsert?: AssessorVerdictUpsertWithWhereUniqueWithoutSessionInput | AssessorVerdictUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: AssessorVerdictCreateManySessionInputEnvelope
    set?: AssessorVerdictWhereUniqueInput | AssessorVerdictWhereUniqueInput[]
    disconnect?: AssessorVerdictWhereUniqueInput | AssessorVerdictWhereUniqueInput[]
    delete?: AssessorVerdictWhereUniqueInput | AssessorVerdictWhereUniqueInput[]
    connect?: AssessorVerdictWhereUniqueInput | AssessorVerdictWhereUniqueInput[]
    update?: AssessorVerdictUpdateWithWhereUniqueWithoutSessionInput | AssessorVerdictUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: AssessorVerdictUpdateManyWithWhereWithoutSessionInput | AssessorVerdictUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: AssessorVerdictScalarWhereInput | AssessorVerdictScalarWhereInput[]
  }

  export type ReportUpdateManyWithoutSessionNestedInput = {
    create?: XOR<ReportCreateWithoutSessionInput, ReportUncheckedCreateWithoutSessionInput> | ReportCreateWithoutSessionInput[] | ReportUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: ReportCreateOrConnectWithoutSessionInput | ReportCreateOrConnectWithoutSessionInput[]
    upsert?: ReportUpsertWithWhereUniqueWithoutSessionInput | ReportUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: ReportCreateManySessionInputEnvelope
    set?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
    disconnect?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
    delete?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
    connect?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
    update?: ReportUpdateWithWhereUniqueWithoutSessionInput | ReportUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: ReportUpdateManyWithWhereWithoutSessionInput | ReportUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: ReportScalarWhereInput | ReportScalarWhereInput[]
  }

  export type TranscriptEntryUncheckedUpdateManyWithoutSessionNestedInput = {
    create?: XOR<TranscriptEntryCreateWithoutSessionInput, TranscriptEntryUncheckedCreateWithoutSessionInput> | TranscriptEntryCreateWithoutSessionInput[] | TranscriptEntryUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: TranscriptEntryCreateOrConnectWithoutSessionInput | TranscriptEntryCreateOrConnectWithoutSessionInput[]
    upsert?: TranscriptEntryUpsertWithWhereUniqueWithoutSessionInput | TranscriptEntryUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: TranscriptEntryCreateManySessionInputEnvelope
    set?: TranscriptEntryWhereUniqueInput | TranscriptEntryWhereUniqueInput[]
    disconnect?: TranscriptEntryWhereUniqueInput | TranscriptEntryWhereUniqueInput[]
    delete?: TranscriptEntryWhereUniqueInput | TranscriptEntryWhereUniqueInput[]
    connect?: TranscriptEntryWhereUniqueInput | TranscriptEntryWhereUniqueInput[]
    update?: TranscriptEntryUpdateWithWhereUniqueWithoutSessionInput | TranscriptEntryUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: TranscriptEntryUpdateManyWithWhereWithoutSessionInput | TranscriptEntryUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: TranscriptEntryScalarWhereInput | TranscriptEntryScalarWhereInput[]
  }

  export type ObservationUncheckedUpdateManyWithoutSessionNestedInput = {
    create?: XOR<ObservationCreateWithoutSessionInput, ObservationUncheckedCreateWithoutSessionInput> | ObservationCreateWithoutSessionInput[] | ObservationUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: ObservationCreateOrConnectWithoutSessionInput | ObservationCreateOrConnectWithoutSessionInput[]
    upsert?: ObservationUpsertWithWhereUniqueWithoutSessionInput | ObservationUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: ObservationCreateManySessionInputEnvelope
    set?: ObservationWhereUniqueInput | ObservationWhereUniqueInput[]
    disconnect?: ObservationWhereUniqueInput | ObservationWhereUniqueInput[]
    delete?: ObservationWhereUniqueInput | ObservationWhereUniqueInput[]
    connect?: ObservationWhereUniqueInput | ObservationWhereUniqueInput[]
    update?: ObservationUpdateWithWhereUniqueWithoutSessionInput | ObservationUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: ObservationUpdateManyWithWhereWithoutSessionInput | ObservationUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: ObservationScalarWhereInput | ObservationScalarWhereInput[]
  }

  export type AssessorVerdictUncheckedUpdateManyWithoutSessionNestedInput = {
    create?: XOR<AssessorVerdictCreateWithoutSessionInput, AssessorVerdictUncheckedCreateWithoutSessionInput> | AssessorVerdictCreateWithoutSessionInput[] | AssessorVerdictUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: AssessorVerdictCreateOrConnectWithoutSessionInput | AssessorVerdictCreateOrConnectWithoutSessionInput[]
    upsert?: AssessorVerdictUpsertWithWhereUniqueWithoutSessionInput | AssessorVerdictUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: AssessorVerdictCreateManySessionInputEnvelope
    set?: AssessorVerdictWhereUniqueInput | AssessorVerdictWhereUniqueInput[]
    disconnect?: AssessorVerdictWhereUniqueInput | AssessorVerdictWhereUniqueInput[]
    delete?: AssessorVerdictWhereUniqueInput | AssessorVerdictWhereUniqueInput[]
    connect?: AssessorVerdictWhereUniqueInput | AssessorVerdictWhereUniqueInput[]
    update?: AssessorVerdictUpdateWithWhereUniqueWithoutSessionInput | AssessorVerdictUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: AssessorVerdictUpdateManyWithWhereWithoutSessionInput | AssessorVerdictUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: AssessorVerdictScalarWhereInput | AssessorVerdictScalarWhereInput[]
  }

  export type ReportUncheckedUpdateManyWithoutSessionNestedInput = {
    create?: XOR<ReportCreateWithoutSessionInput, ReportUncheckedCreateWithoutSessionInput> | ReportCreateWithoutSessionInput[] | ReportUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: ReportCreateOrConnectWithoutSessionInput | ReportCreateOrConnectWithoutSessionInput[]
    upsert?: ReportUpsertWithWhereUniqueWithoutSessionInput | ReportUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: ReportCreateManySessionInputEnvelope
    set?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
    disconnect?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
    delete?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
    connect?: ReportWhereUniqueInput | ReportWhereUniqueInput[]
    update?: ReportUpdateWithWhereUniqueWithoutSessionInput | ReportUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: ReportUpdateManyWithWhereWithoutSessionInput | ReportUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: ReportScalarWhereInput | ReportScalarWhereInput[]
  }

  export type InterviewSessionCreateNestedOneWithoutTranscriptsInput = {
    create?: XOR<InterviewSessionCreateWithoutTranscriptsInput, InterviewSessionUncheckedCreateWithoutTranscriptsInput>
    connectOrCreate?: InterviewSessionCreateOrConnectWithoutTranscriptsInput
    connect?: InterviewSessionWhereUniqueInput
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type InterviewSessionUpdateOneRequiredWithoutTranscriptsNestedInput = {
    create?: XOR<InterviewSessionCreateWithoutTranscriptsInput, InterviewSessionUncheckedCreateWithoutTranscriptsInput>
    connectOrCreate?: InterviewSessionCreateOrConnectWithoutTranscriptsInput
    upsert?: InterviewSessionUpsertWithoutTranscriptsInput
    connect?: InterviewSessionWhereUniqueInput
    update?: XOR<XOR<InterviewSessionUpdateToOneWithWhereWithoutTranscriptsInput, InterviewSessionUpdateWithoutTranscriptsInput>, InterviewSessionUncheckedUpdateWithoutTranscriptsInput>
  }

  export type InterviewSessionCreateNestedOneWithoutObservationsInput = {
    create?: XOR<InterviewSessionCreateWithoutObservationsInput, InterviewSessionUncheckedCreateWithoutObservationsInput>
    connectOrCreate?: InterviewSessionCreateOrConnectWithoutObservationsInput
    connect?: InterviewSessionWhereUniqueInput
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type InterviewSessionUpdateOneRequiredWithoutObservationsNestedInput = {
    create?: XOR<InterviewSessionCreateWithoutObservationsInput, InterviewSessionUncheckedCreateWithoutObservationsInput>
    connectOrCreate?: InterviewSessionCreateOrConnectWithoutObservationsInput
    upsert?: InterviewSessionUpsertWithoutObservationsInput
    connect?: InterviewSessionWhereUniqueInput
    update?: XOR<XOR<InterviewSessionUpdateToOneWithWhereWithoutObservationsInput, InterviewSessionUpdateWithoutObservationsInput>, InterviewSessionUncheckedUpdateWithoutObservationsInput>
  }

  export type InterviewSessionCreateNestedOneWithoutVerdictsInput = {
    create?: XOR<InterviewSessionCreateWithoutVerdictsInput, InterviewSessionUncheckedCreateWithoutVerdictsInput>
    connectOrCreate?: InterviewSessionCreateOrConnectWithoutVerdictsInput
    connect?: InterviewSessionWhereUniqueInput
  }

  export type InterviewSessionUpdateOneRequiredWithoutVerdictsNestedInput = {
    create?: XOR<InterviewSessionCreateWithoutVerdictsInput, InterviewSessionUncheckedCreateWithoutVerdictsInput>
    connectOrCreate?: InterviewSessionCreateOrConnectWithoutVerdictsInput
    upsert?: InterviewSessionUpsertWithoutVerdictsInput
    connect?: InterviewSessionWhereUniqueInput
    update?: XOR<XOR<InterviewSessionUpdateToOneWithWhereWithoutVerdictsInput, InterviewSessionUpdateWithoutVerdictsInput>, InterviewSessionUncheckedUpdateWithoutVerdictsInput>
  }

  export type InterviewSessionCreateNestedOneWithoutReportsInput = {
    create?: XOR<InterviewSessionCreateWithoutReportsInput, InterviewSessionUncheckedCreateWithoutReportsInput>
    connectOrCreate?: InterviewSessionCreateOrConnectWithoutReportsInput
    connect?: InterviewSessionWhereUniqueInput
  }

  export type InterviewSessionUpdateOneRequiredWithoutReportsNestedInput = {
    create?: XOR<InterviewSessionCreateWithoutReportsInput, InterviewSessionUncheckedCreateWithoutReportsInput>
    connectOrCreate?: InterviewSessionCreateOrConnectWithoutReportsInput
    upsert?: InterviewSessionUpsertWithoutReportsInput
    connect?: InterviewSessionWhereUniqueInput
    update?: XOR<XOR<InterviewSessionUpdateToOneWithWhereWithoutReportsInput, InterviewSessionUpdateWithoutReportsInput>, InterviewSessionUncheckedUpdateWithoutReportsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }
  export type NestedJsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type UserCreateWithoutOrganizationInput = {
    id?: string
    email: string
    name: string
    role?: string
    createdAt?: Date | string
  }

  export type UserUncheckedCreateWithoutOrganizationInput = {
    id?: string
    email: string
    name: string
    role?: string
    createdAt?: Date | string
  }

  export type UserCreateOrConnectWithoutOrganizationInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutOrganizationInput, UserUncheckedCreateWithoutOrganizationInput>
  }

  export type UserCreateManyOrganizationInputEnvelope = {
    data: UserCreateManyOrganizationInput | UserCreateManyOrganizationInput[]
    skipDuplicates?: boolean
  }

  export type InterviewSessionCreateWithoutOrganizationInput = {
    id?: string
    setup: JsonNullValueInput | InputJsonValue
    status?: string
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    voiceProvider?: string
    createdAt?: Date | string
    transcripts?: TranscriptEntryCreateNestedManyWithoutSessionInput
    observations?: ObservationCreateNestedManyWithoutSessionInput
    verdicts?: AssessorVerdictCreateNestedManyWithoutSessionInput
    reports?: ReportCreateNestedManyWithoutSessionInput
  }

  export type InterviewSessionUncheckedCreateWithoutOrganizationInput = {
    id?: string
    setup: JsonNullValueInput | InputJsonValue
    status?: string
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    voiceProvider?: string
    createdAt?: Date | string
    transcripts?: TranscriptEntryUncheckedCreateNestedManyWithoutSessionInput
    observations?: ObservationUncheckedCreateNestedManyWithoutSessionInput
    verdicts?: AssessorVerdictUncheckedCreateNestedManyWithoutSessionInput
    reports?: ReportUncheckedCreateNestedManyWithoutSessionInput
  }

  export type InterviewSessionCreateOrConnectWithoutOrganizationInput = {
    where: InterviewSessionWhereUniqueInput
    create: XOR<InterviewSessionCreateWithoutOrganizationInput, InterviewSessionUncheckedCreateWithoutOrganizationInput>
  }

  export type InterviewSessionCreateManyOrganizationInputEnvelope = {
    data: InterviewSessionCreateManyOrganizationInput | InterviewSessionCreateManyOrganizationInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithWhereUniqueWithoutOrganizationInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutOrganizationInput, UserUncheckedUpdateWithoutOrganizationInput>
    create: XOR<UserCreateWithoutOrganizationInput, UserUncheckedCreateWithoutOrganizationInput>
  }

  export type UserUpdateWithWhereUniqueWithoutOrganizationInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutOrganizationInput, UserUncheckedUpdateWithoutOrganizationInput>
  }

  export type UserUpdateManyWithWhereWithoutOrganizationInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutOrganizationInput>
  }

  export type UserScalarWhereInput = {
    AND?: UserScalarWhereInput | UserScalarWhereInput[]
    OR?: UserScalarWhereInput[]
    NOT?: UserScalarWhereInput | UserScalarWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    role?: StringFilter<"User"> | string
    organizationId?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
  }

  export type InterviewSessionUpsertWithWhereUniqueWithoutOrganizationInput = {
    where: InterviewSessionWhereUniqueInput
    update: XOR<InterviewSessionUpdateWithoutOrganizationInput, InterviewSessionUncheckedUpdateWithoutOrganizationInput>
    create: XOR<InterviewSessionCreateWithoutOrganizationInput, InterviewSessionUncheckedCreateWithoutOrganizationInput>
  }

  export type InterviewSessionUpdateWithWhereUniqueWithoutOrganizationInput = {
    where: InterviewSessionWhereUniqueInput
    data: XOR<InterviewSessionUpdateWithoutOrganizationInput, InterviewSessionUncheckedUpdateWithoutOrganizationInput>
  }

  export type InterviewSessionUpdateManyWithWhereWithoutOrganizationInput = {
    where: InterviewSessionScalarWhereInput
    data: XOR<InterviewSessionUpdateManyMutationInput, InterviewSessionUncheckedUpdateManyWithoutOrganizationInput>
  }

  export type InterviewSessionScalarWhereInput = {
    AND?: InterviewSessionScalarWhereInput | InterviewSessionScalarWhereInput[]
    OR?: InterviewSessionScalarWhereInput[]
    NOT?: InterviewSessionScalarWhereInput | InterviewSessionScalarWhereInput[]
    id?: StringFilter<"InterviewSession"> | string
    organizationId?: StringNullableFilter<"InterviewSession"> | string | null
    setup?: JsonFilter<"InterviewSession">
    status?: StringFilter<"InterviewSession"> | string
    startedAt?: DateTimeNullableFilter<"InterviewSession"> | Date | string | null
    endedAt?: DateTimeNullableFilter<"InterviewSession"> | Date | string | null
    voiceProvider?: StringFilter<"InterviewSession"> | string
    createdAt?: DateTimeFilter<"InterviewSession"> | Date | string
  }

  export type OrganizationCreateWithoutUsersInput = {
    id?: string
    name: string
    settings?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    sessions?: InterviewSessionCreateNestedManyWithoutOrganizationInput
  }

  export type OrganizationUncheckedCreateWithoutUsersInput = {
    id?: string
    name: string
    settings?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    sessions?: InterviewSessionUncheckedCreateNestedManyWithoutOrganizationInput
  }

  export type OrganizationCreateOrConnectWithoutUsersInput = {
    where: OrganizationWhereUniqueInput
    create: XOR<OrganizationCreateWithoutUsersInput, OrganizationUncheckedCreateWithoutUsersInput>
  }

  export type OrganizationUpsertWithoutUsersInput = {
    update: XOR<OrganizationUpdateWithoutUsersInput, OrganizationUncheckedUpdateWithoutUsersInput>
    create: XOR<OrganizationCreateWithoutUsersInput, OrganizationUncheckedCreateWithoutUsersInput>
    where?: OrganizationWhereInput
  }

  export type OrganizationUpdateToOneWithWhereWithoutUsersInput = {
    where?: OrganizationWhereInput
    data: XOR<OrganizationUpdateWithoutUsersInput, OrganizationUncheckedUpdateWithoutUsersInput>
  }

  export type OrganizationUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    settings?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: InterviewSessionUpdateManyWithoutOrganizationNestedInput
  }

  export type OrganizationUncheckedUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    settings?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: InterviewSessionUncheckedUpdateManyWithoutOrganizationNestedInput
  }

  export type OrganizationCreateWithoutSessionsInput = {
    id?: string
    name: string
    settings?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    users?: UserCreateNestedManyWithoutOrganizationInput
  }

  export type OrganizationUncheckedCreateWithoutSessionsInput = {
    id?: string
    name: string
    settings?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutOrganizationInput
  }

  export type OrganizationCreateOrConnectWithoutSessionsInput = {
    where: OrganizationWhereUniqueInput
    create: XOR<OrganizationCreateWithoutSessionsInput, OrganizationUncheckedCreateWithoutSessionsInput>
  }

  export type TranscriptEntryCreateWithoutSessionInput = {
    id?: string
    speaker: string
    text: string
    timestamp: Date | string
    audioTimestamp?: number | null
  }

  export type TranscriptEntryUncheckedCreateWithoutSessionInput = {
    id?: string
    speaker: string
    text: string
    timestamp: Date | string
    audioTimestamp?: number | null
  }

  export type TranscriptEntryCreateOrConnectWithoutSessionInput = {
    where: TranscriptEntryWhereUniqueInput
    create: XOR<TranscriptEntryCreateWithoutSessionInput, TranscriptEntryUncheckedCreateWithoutSessionInput>
  }

  export type TranscriptEntryCreateManySessionInputEnvelope = {
    data: TranscriptEntryCreateManySessionInput | TranscriptEntryCreateManySessionInput[]
    skipDuplicates?: boolean
  }

  export type ObservationCreateWithoutSessionInput = {
    id?: string
    type: string
    dimension?: string | null
    gate?: string | null
    description: string
    evidence: string
    confidence: number
    timestamp: Date | string
  }

  export type ObservationUncheckedCreateWithoutSessionInput = {
    id?: string
    type: string
    dimension?: string | null
    gate?: string | null
    description: string
    evidence: string
    confidence: number
    timestamp: Date | string
  }

  export type ObservationCreateOrConnectWithoutSessionInput = {
    where: ObservationWhereUniqueInput
    create: XOR<ObservationCreateWithoutSessionInput, ObservationUncheckedCreateWithoutSessionInput>
  }

  export type ObservationCreateManySessionInputEnvelope = {
    data: ObservationCreateManySessionInput | ObservationCreateManySessionInput[]
    skipDuplicates?: boolean
  }

  export type AssessorVerdictCreateWithoutSessionInput = {
    id?: string
    role: string
    recommendation: string
    confidence: number
    narrative: string
    dimensionScores: JsonNullValueInput | InputJsonValue
    deepSignalScores?: NullableJsonNullValueInput | InputJsonValue
    psychologicalScreening?: NullableJsonNullValueInput | InputJsonValue
    gateEvaluations: JsonNullValueInput | InputJsonValue
    keyInsights: JsonNullValueInput | InputJsonValue
    dissent?: string | null
  }

  export type AssessorVerdictUncheckedCreateWithoutSessionInput = {
    id?: string
    role: string
    recommendation: string
    confidence: number
    narrative: string
    dimensionScores: JsonNullValueInput | InputJsonValue
    deepSignalScores?: NullableJsonNullValueInput | InputJsonValue
    psychologicalScreening?: NullableJsonNullValueInput | InputJsonValue
    gateEvaluations: JsonNullValueInput | InputJsonValue
    keyInsights: JsonNullValueInput | InputJsonValue
    dissent?: string | null
  }

  export type AssessorVerdictCreateOrConnectWithoutSessionInput = {
    where: AssessorVerdictWhereUniqueInput
    create: XOR<AssessorVerdictCreateWithoutSessionInput, AssessorVerdictUncheckedCreateWithoutSessionInput>
  }

  export type AssessorVerdictCreateManySessionInputEnvelope = {
    data: AssessorVerdictCreateManySessionInput | AssessorVerdictCreateManySessionInput[]
    skipDuplicates?: boolean
  }

  export type ReportCreateWithoutSessionInput = {
    id?: string
    candidateName: string
    roleName: string
    reportData: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type ReportUncheckedCreateWithoutSessionInput = {
    id?: string
    candidateName: string
    roleName: string
    reportData: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type ReportCreateOrConnectWithoutSessionInput = {
    where: ReportWhereUniqueInput
    create: XOR<ReportCreateWithoutSessionInput, ReportUncheckedCreateWithoutSessionInput>
  }

  export type ReportCreateManySessionInputEnvelope = {
    data: ReportCreateManySessionInput | ReportCreateManySessionInput[]
    skipDuplicates?: boolean
  }

  export type OrganizationUpsertWithoutSessionsInput = {
    update: XOR<OrganizationUpdateWithoutSessionsInput, OrganizationUncheckedUpdateWithoutSessionsInput>
    create: XOR<OrganizationCreateWithoutSessionsInput, OrganizationUncheckedCreateWithoutSessionsInput>
    where?: OrganizationWhereInput
  }

  export type OrganizationUpdateToOneWithWhereWithoutSessionsInput = {
    where?: OrganizationWhereInput
    data: XOR<OrganizationUpdateWithoutSessionsInput, OrganizationUncheckedUpdateWithoutSessionsInput>
  }

  export type OrganizationUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    settings?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutOrganizationNestedInput
  }

  export type OrganizationUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    settings?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutOrganizationNestedInput
  }

  export type TranscriptEntryUpsertWithWhereUniqueWithoutSessionInput = {
    where: TranscriptEntryWhereUniqueInput
    update: XOR<TranscriptEntryUpdateWithoutSessionInput, TranscriptEntryUncheckedUpdateWithoutSessionInput>
    create: XOR<TranscriptEntryCreateWithoutSessionInput, TranscriptEntryUncheckedCreateWithoutSessionInput>
  }

  export type TranscriptEntryUpdateWithWhereUniqueWithoutSessionInput = {
    where: TranscriptEntryWhereUniqueInput
    data: XOR<TranscriptEntryUpdateWithoutSessionInput, TranscriptEntryUncheckedUpdateWithoutSessionInput>
  }

  export type TranscriptEntryUpdateManyWithWhereWithoutSessionInput = {
    where: TranscriptEntryScalarWhereInput
    data: XOR<TranscriptEntryUpdateManyMutationInput, TranscriptEntryUncheckedUpdateManyWithoutSessionInput>
  }

  export type TranscriptEntryScalarWhereInput = {
    AND?: TranscriptEntryScalarWhereInput | TranscriptEntryScalarWhereInput[]
    OR?: TranscriptEntryScalarWhereInput[]
    NOT?: TranscriptEntryScalarWhereInput | TranscriptEntryScalarWhereInput[]
    id?: StringFilter<"TranscriptEntry"> | string
    sessionId?: StringFilter<"TranscriptEntry"> | string
    speaker?: StringFilter<"TranscriptEntry"> | string
    text?: StringFilter<"TranscriptEntry"> | string
    timestamp?: DateTimeFilter<"TranscriptEntry"> | Date | string
    audioTimestamp?: FloatNullableFilter<"TranscriptEntry"> | number | null
  }

  export type ObservationUpsertWithWhereUniqueWithoutSessionInput = {
    where: ObservationWhereUniqueInput
    update: XOR<ObservationUpdateWithoutSessionInput, ObservationUncheckedUpdateWithoutSessionInput>
    create: XOR<ObservationCreateWithoutSessionInput, ObservationUncheckedCreateWithoutSessionInput>
  }

  export type ObservationUpdateWithWhereUniqueWithoutSessionInput = {
    where: ObservationWhereUniqueInput
    data: XOR<ObservationUpdateWithoutSessionInput, ObservationUncheckedUpdateWithoutSessionInput>
  }

  export type ObservationUpdateManyWithWhereWithoutSessionInput = {
    where: ObservationScalarWhereInput
    data: XOR<ObservationUpdateManyMutationInput, ObservationUncheckedUpdateManyWithoutSessionInput>
  }

  export type ObservationScalarWhereInput = {
    AND?: ObservationScalarWhereInput | ObservationScalarWhereInput[]
    OR?: ObservationScalarWhereInput[]
    NOT?: ObservationScalarWhereInput | ObservationScalarWhereInput[]
    id?: StringFilter<"Observation"> | string
    sessionId?: StringFilter<"Observation"> | string
    type?: StringFilter<"Observation"> | string
    dimension?: StringNullableFilter<"Observation"> | string | null
    gate?: StringNullableFilter<"Observation"> | string | null
    description?: StringFilter<"Observation"> | string
    evidence?: StringFilter<"Observation"> | string
    confidence?: FloatFilter<"Observation"> | number
    timestamp?: DateTimeFilter<"Observation"> | Date | string
  }

  export type AssessorVerdictUpsertWithWhereUniqueWithoutSessionInput = {
    where: AssessorVerdictWhereUniqueInput
    update: XOR<AssessorVerdictUpdateWithoutSessionInput, AssessorVerdictUncheckedUpdateWithoutSessionInput>
    create: XOR<AssessorVerdictCreateWithoutSessionInput, AssessorVerdictUncheckedCreateWithoutSessionInput>
  }

  export type AssessorVerdictUpdateWithWhereUniqueWithoutSessionInput = {
    where: AssessorVerdictWhereUniqueInput
    data: XOR<AssessorVerdictUpdateWithoutSessionInput, AssessorVerdictUncheckedUpdateWithoutSessionInput>
  }

  export type AssessorVerdictUpdateManyWithWhereWithoutSessionInput = {
    where: AssessorVerdictScalarWhereInput
    data: XOR<AssessorVerdictUpdateManyMutationInput, AssessorVerdictUncheckedUpdateManyWithoutSessionInput>
  }

  export type AssessorVerdictScalarWhereInput = {
    AND?: AssessorVerdictScalarWhereInput | AssessorVerdictScalarWhereInput[]
    OR?: AssessorVerdictScalarWhereInput[]
    NOT?: AssessorVerdictScalarWhereInput | AssessorVerdictScalarWhereInput[]
    id?: StringFilter<"AssessorVerdict"> | string
    sessionId?: StringFilter<"AssessorVerdict"> | string
    role?: StringFilter<"AssessorVerdict"> | string
    recommendation?: StringFilter<"AssessorVerdict"> | string
    confidence?: FloatFilter<"AssessorVerdict"> | number
    narrative?: StringFilter<"AssessorVerdict"> | string
    dimensionScores?: JsonFilter<"AssessorVerdict">
    deepSignalScores?: JsonNullableFilter<"AssessorVerdict">
    psychologicalScreening?: JsonNullableFilter<"AssessorVerdict">
    gateEvaluations?: JsonFilter<"AssessorVerdict">
    keyInsights?: JsonFilter<"AssessorVerdict">
    dissent?: StringNullableFilter<"AssessorVerdict"> | string | null
  }

  export type ReportUpsertWithWhereUniqueWithoutSessionInput = {
    where: ReportWhereUniqueInput
    update: XOR<ReportUpdateWithoutSessionInput, ReportUncheckedUpdateWithoutSessionInput>
    create: XOR<ReportCreateWithoutSessionInput, ReportUncheckedCreateWithoutSessionInput>
  }

  export type ReportUpdateWithWhereUniqueWithoutSessionInput = {
    where: ReportWhereUniqueInput
    data: XOR<ReportUpdateWithoutSessionInput, ReportUncheckedUpdateWithoutSessionInput>
  }

  export type ReportUpdateManyWithWhereWithoutSessionInput = {
    where: ReportScalarWhereInput
    data: XOR<ReportUpdateManyMutationInput, ReportUncheckedUpdateManyWithoutSessionInput>
  }

  export type ReportScalarWhereInput = {
    AND?: ReportScalarWhereInput | ReportScalarWhereInput[]
    OR?: ReportScalarWhereInput[]
    NOT?: ReportScalarWhereInput | ReportScalarWhereInput[]
    id?: StringFilter<"Report"> | string
    sessionId?: StringFilter<"Report"> | string
    candidateName?: StringFilter<"Report"> | string
    roleName?: StringFilter<"Report"> | string
    reportData?: JsonFilter<"Report">
    createdAt?: DateTimeFilter<"Report"> | Date | string
  }

  export type InterviewSessionCreateWithoutTranscriptsInput = {
    id?: string
    setup: JsonNullValueInput | InputJsonValue
    status?: string
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    voiceProvider?: string
    createdAt?: Date | string
    organization?: OrganizationCreateNestedOneWithoutSessionsInput
    observations?: ObservationCreateNestedManyWithoutSessionInput
    verdicts?: AssessorVerdictCreateNestedManyWithoutSessionInput
    reports?: ReportCreateNestedManyWithoutSessionInput
  }

  export type InterviewSessionUncheckedCreateWithoutTranscriptsInput = {
    id?: string
    organizationId?: string | null
    setup: JsonNullValueInput | InputJsonValue
    status?: string
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    voiceProvider?: string
    createdAt?: Date | string
    observations?: ObservationUncheckedCreateNestedManyWithoutSessionInput
    verdicts?: AssessorVerdictUncheckedCreateNestedManyWithoutSessionInput
    reports?: ReportUncheckedCreateNestedManyWithoutSessionInput
  }

  export type InterviewSessionCreateOrConnectWithoutTranscriptsInput = {
    where: InterviewSessionWhereUniqueInput
    create: XOR<InterviewSessionCreateWithoutTranscriptsInput, InterviewSessionUncheckedCreateWithoutTranscriptsInput>
  }

  export type InterviewSessionUpsertWithoutTranscriptsInput = {
    update: XOR<InterviewSessionUpdateWithoutTranscriptsInput, InterviewSessionUncheckedUpdateWithoutTranscriptsInput>
    create: XOR<InterviewSessionCreateWithoutTranscriptsInput, InterviewSessionUncheckedCreateWithoutTranscriptsInput>
    where?: InterviewSessionWhereInput
  }

  export type InterviewSessionUpdateToOneWithWhereWithoutTranscriptsInput = {
    where?: InterviewSessionWhereInput
    data: XOR<InterviewSessionUpdateWithoutTranscriptsInput, InterviewSessionUncheckedUpdateWithoutTranscriptsInput>
  }

  export type InterviewSessionUpdateWithoutTranscriptsInput = {
    id?: StringFieldUpdateOperationsInput | string
    setup?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voiceProvider?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organization?: OrganizationUpdateOneWithoutSessionsNestedInput
    observations?: ObservationUpdateManyWithoutSessionNestedInput
    verdicts?: AssessorVerdictUpdateManyWithoutSessionNestedInput
    reports?: ReportUpdateManyWithoutSessionNestedInput
  }

  export type InterviewSessionUncheckedUpdateWithoutTranscriptsInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    setup?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voiceProvider?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    observations?: ObservationUncheckedUpdateManyWithoutSessionNestedInput
    verdicts?: AssessorVerdictUncheckedUpdateManyWithoutSessionNestedInput
    reports?: ReportUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type InterviewSessionCreateWithoutObservationsInput = {
    id?: string
    setup: JsonNullValueInput | InputJsonValue
    status?: string
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    voiceProvider?: string
    createdAt?: Date | string
    organization?: OrganizationCreateNestedOneWithoutSessionsInput
    transcripts?: TranscriptEntryCreateNestedManyWithoutSessionInput
    verdicts?: AssessorVerdictCreateNestedManyWithoutSessionInput
    reports?: ReportCreateNestedManyWithoutSessionInput
  }

  export type InterviewSessionUncheckedCreateWithoutObservationsInput = {
    id?: string
    organizationId?: string | null
    setup: JsonNullValueInput | InputJsonValue
    status?: string
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    voiceProvider?: string
    createdAt?: Date | string
    transcripts?: TranscriptEntryUncheckedCreateNestedManyWithoutSessionInput
    verdicts?: AssessorVerdictUncheckedCreateNestedManyWithoutSessionInput
    reports?: ReportUncheckedCreateNestedManyWithoutSessionInput
  }

  export type InterviewSessionCreateOrConnectWithoutObservationsInput = {
    where: InterviewSessionWhereUniqueInput
    create: XOR<InterviewSessionCreateWithoutObservationsInput, InterviewSessionUncheckedCreateWithoutObservationsInput>
  }

  export type InterviewSessionUpsertWithoutObservationsInput = {
    update: XOR<InterviewSessionUpdateWithoutObservationsInput, InterviewSessionUncheckedUpdateWithoutObservationsInput>
    create: XOR<InterviewSessionCreateWithoutObservationsInput, InterviewSessionUncheckedCreateWithoutObservationsInput>
    where?: InterviewSessionWhereInput
  }

  export type InterviewSessionUpdateToOneWithWhereWithoutObservationsInput = {
    where?: InterviewSessionWhereInput
    data: XOR<InterviewSessionUpdateWithoutObservationsInput, InterviewSessionUncheckedUpdateWithoutObservationsInput>
  }

  export type InterviewSessionUpdateWithoutObservationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    setup?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voiceProvider?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organization?: OrganizationUpdateOneWithoutSessionsNestedInput
    transcripts?: TranscriptEntryUpdateManyWithoutSessionNestedInput
    verdicts?: AssessorVerdictUpdateManyWithoutSessionNestedInput
    reports?: ReportUpdateManyWithoutSessionNestedInput
  }

  export type InterviewSessionUncheckedUpdateWithoutObservationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    setup?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voiceProvider?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transcripts?: TranscriptEntryUncheckedUpdateManyWithoutSessionNestedInput
    verdicts?: AssessorVerdictUncheckedUpdateManyWithoutSessionNestedInput
    reports?: ReportUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type InterviewSessionCreateWithoutVerdictsInput = {
    id?: string
    setup: JsonNullValueInput | InputJsonValue
    status?: string
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    voiceProvider?: string
    createdAt?: Date | string
    organization?: OrganizationCreateNestedOneWithoutSessionsInput
    transcripts?: TranscriptEntryCreateNestedManyWithoutSessionInput
    observations?: ObservationCreateNestedManyWithoutSessionInput
    reports?: ReportCreateNestedManyWithoutSessionInput
  }

  export type InterviewSessionUncheckedCreateWithoutVerdictsInput = {
    id?: string
    organizationId?: string | null
    setup: JsonNullValueInput | InputJsonValue
    status?: string
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    voiceProvider?: string
    createdAt?: Date | string
    transcripts?: TranscriptEntryUncheckedCreateNestedManyWithoutSessionInput
    observations?: ObservationUncheckedCreateNestedManyWithoutSessionInput
    reports?: ReportUncheckedCreateNestedManyWithoutSessionInput
  }

  export type InterviewSessionCreateOrConnectWithoutVerdictsInput = {
    where: InterviewSessionWhereUniqueInput
    create: XOR<InterviewSessionCreateWithoutVerdictsInput, InterviewSessionUncheckedCreateWithoutVerdictsInput>
  }

  export type InterviewSessionUpsertWithoutVerdictsInput = {
    update: XOR<InterviewSessionUpdateWithoutVerdictsInput, InterviewSessionUncheckedUpdateWithoutVerdictsInput>
    create: XOR<InterviewSessionCreateWithoutVerdictsInput, InterviewSessionUncheckedCreateWithoutVerdictsInput>
    where?: InterviewSessionWhereInput
  }

  export type InterviewSessionUpdateToOneWithWhereWithoutVerdictsInput = {
    where?: InterviewSessionWhereInput
    data: XOR<InterviewSessionUpdateWithoutVerdictsInput, InterviewSessionUncheckedUpdateWithoutVerdictsInput>
  }

  export type InterviewSessionUpdateWithoutVerdictsInput = {
    id?: StringFieldUpdateOperationsInput | string
    setup?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voiceProvider?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organization?: OrganizationUpdateOneWithoutSessionsNestedInput
    transcripts?: TranscriptEntryUpdateManyWithoutSessionNestedInput
    observations?: ObservationUpdateManyWithoutSessionNestedInput
    reports?: ReportUpdateManyWithoutSessionNestedInput
  }

  export type InterviewSessionUncheckedUpdateWithoutVerdictsInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    setup?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voiceProvider?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transcripts?: TranscriptEntryUncheckedUpdateManyWithoutSessionNestedInput
    observations?: ObservationUncheckedUpdateManyWithoutSessionNestedInput
    reports?: ReportUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type InterviewSessionCreateWithoutReportsInput = {
    id?: string
    setup: JsonNullValueInput | InputJsonValue
    status?: string
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    voiceProvider?: string
    createdAt?: Date | string
    organization?: OrganizationCreateNestedOneWithoutSessionsInput
    transcripts?: TranscriptEntryCreateNestedManyWithoutSessionInput
    observations?: ObservationCreateNestedManyWithoutSessionInput
    verdicts?: AssessorVerdictCreateNestedManyWithoutSessionInput
  }

  export type InterviewSessionUncheckedCreateWithoutReportsInput = {
    id?: string
    organizationId?: string | null
    setup: JsonNullValueInput | InputJsonValue
    status?: string
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    voiceProvider?: string
    createdAt?: Date | string
    transcripts?: TranscriptEntryUncheckedCreateNestedManyWithoutSessionInput
    observations?: ObservationUncheckedCreateNestedManyWithoutSessionInput
    verdicts?: AssessorVerdictUncheckedCreateNestedManyWithoutSessionInput
  }

  export type InterviewSessionCreateOrConnectWithoutReportsInput = {
    where: InterviewSessionWhereUniqueInput
    create: XOR<InterviewSessionCreateWithoutReportsInput, InterviewSessionUncheckedCreateWithoutReportsInput>
  }

  export type InterviewSessionUpsertWithoutReportsInput = {
    update: XOR<InterviewSessionUpdateWithoutReportsInput, InterviewSessionUncheckedUpdateWithoutReportsInput>
    create: XOR<InterviewSessionCreateWithoutReportsInput, InterviewSessionUncheckedCreateWithoutReportsInput>
    where?: InterviewSessionWhereInput
  }

  export type InterviewSessionUpdateToOneWithWhereWithoutReportsInput = {
    where?: InterviewSessionWhereInput
    data: XOR<InterviewSessionUpdateWithoutReportsInput, InterviewSessionUncheckedUpdateWithoutReportsInput>
  }

  export type InterviewSessionUpdateWithoutReportsInput = {
    id?: StringFieldUpdateOperationsInput | string
    setup?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voiceProvider?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    organization?: OrganizationUpdateOneWithoutSessionsNestedInput
    transcripts?: TranscriptEntryUpdateManyWithoutSessionNestedInput
    observations?: ObservationUpdateManyWithoutSessionNestedInput
    verdicts?: AssessorVerdictUpdateManyWithoutSessionNestedInput
  }

  export type InterviewSessionUncheckedUpdateWithoutReportsInput = {
    id?: StringFieldUpdateOperationsInput | string
    organizationId?: NullableStringFieldUpdateOperationsInput | string | null
    setup?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voiceProvider?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transcripts?: TranscriptEntryUncheckedUpdateManyWithoutSessionNestedInput
    observations?: ObservationUncheckedUpdateManyWithoutSessionNestedInput
    verdicts?: AssessorVerdictUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type UserCreateManyOrganizationInput = {
    id?: string
    email: string
    name: string
    role?: string
    createdAt?: Date | string
  }

  export type InterviewSessionCreateManyOrganizationInput = {
    id?: string
    setup: JsonNullValueInput | InputJsonValue
    status?: string
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    voiceProvider?: string
    createdAt?: Date | string
  }

  export type UserUpdateWithoutOrganizationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateWithoutOrganizationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyWithoutOrganizationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InterviewSessionUpdateWithoutOrganizationInput = {
    id?: StringFieldUpdateOperationsInput | string
    setup?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voiceProvider?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transcripts?: TranscriptEntryUpdateManyWithoutSessionNestedInput
    observations?: ObservationUpdateManyWithoutSessionNestedInput
    verdicts?: AssessorVerdictUpdateManyWithoutSessionNestedInput
    reports?: ReportUpdateManyWithoutSessionNestedInput
  }

  export type InterviewSessionUncheckedUpdateWithoutOrganizationInput = {
    id?: StringFieldUpdateOperationsInput | string
    setup?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voiceProvider?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transcripts?: TranscriptEntryUncheckedUpdateManyWithoutSessionNestedInput
    observations?: ObservationUncheckedUpdateManyWithoutSessionNestedInput
    verdicts?: AssessorVerdictUncheckedUpdateManyWithoutSessionNestedInput
    reports?: ReportUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type InterviewSessionUncheckedUpdateManyWithoutOrganizationInput = {
    id?: StringFieldUpdateOperationsInput | string
    setup?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    voiceProvider?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TranscriptEntryCreateManySessionInput = {
    id?: string
    speaker: string
    text: string
    timestamp: Date | string
    audioTimestamp?: number | null
  }

  export type ObservationCreateManySessionInput = {
    id?: string
    type: string
    dimension?: string | null
    gate?: string | null
    description: string
    evidence: string
    confidence: number
    timestamp: Date | string
  }

  export type AssessorVerdictCreateManySessionInput = {
    id?: string
    role: string
    recommendation: string
    confidence: number
    narrative: string
    dimensionScores: JsonNullValueInput | InputJsonValue
    deepSignalScores?: NullableJsonNullValueInput | InputJsonValue
    psychologicalScreening?: NullableJsonNullValueInput | InputJsonValue
    gateEvaluations: JsonNullValueInput | InputJsonValue
    keyInsights: JsonNullValueInput | InputJsonValue
    dissent?: string | null
  }

  export type ReportCreateManySessionInput = {
    id?: string
    candidateName: string
    roleName: string
    reportData: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type TranscriptEntryUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    speaker?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    audioTimestamp?: NullableFloatFieldUpdateOperationsInput | number | null
  }

  export type TranscriptEntryUncheckedUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    speaker?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    audioTimestamp?: NullableFloatFieldUpdateOperationsInput | number | null
  }

  export type TranscriptEntryUncheckedUpdateManyWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    speaker?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    audioTimestamp?: NullableFloatFieldUpdateOperationsInput | number | null
  }

  export type ObservationUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    dimension?: NullableStringFieldUpdateOperationsInput | string | null
    gate?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    evidence?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ObservationUncheckedUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    dimension?: NullableStringFieldUpdateOperationsInput | string | null
    gate?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    evidence?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ObservationUncheckedUpdateManyWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    dimension?: NullableStringFieldUpdateOperationsInput | string | null
    gate?: NullableStringFieldUpdateOperationsInput | string | null
    description?: StringFieldUpdateOperationsInput | string
    evidence?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AssessorVerdictUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    recommendation?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    narrative?: StringFieldUpdateOperationsInput | string
    dimensionScores?: JsonNullValueInput | InputJsonValue
    deepSignalScores?: NullableJsonNullValueInput | InputJsonValue
    psychologicalScreening?: NullableJsonNullValueInput | InputJsonValue
    gateEvaluations?: JsonNullValueInput | InputJsonValue
    keyInsights?: JsonNullValueInput | InputJsonValue
    dissent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AssessorVerdictUncheckedUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    recommendation?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    narrative?: StringFieldUpdateOperationsInput | string
    dimensionScores?: JsonNullValueInput | InputJsonValue
    deepSignalScores?: NullableJsonNullValueInput | InputJsonValue
    psychologicalScreening?: NullableJsonNullValueInput | InputJsonValue
    gateEvaluations?: JsonNullValueInput | InputJsonValue
    keyInsights?: JsonNullValueInput | InputJsonValue
    dissent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AssessorVerdictUncheckedUpdateManyWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    recommendation?: StringFieldUpdateOperationsInput | string
    confidence?: FloatFieldUpdateOperationsInput | number
    narrative?: StringFieldUpdateOperationsInput | string
    dimensionScores?: JsonNullValueInput | InputJsonValue
    deepSignalScores?: NullableJsonNullValueInput | InputJsonValue
    psychologicalScreening?: NullableJsonNullValueInput | InputJsonValue
    gateEvaluations?: JsonNullValueInput | InputJsonValue
    keyInsights?: JsonNullValueInput | InputJsonValue
    dissent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ReportUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    candidateName?: StringFieldUpdateOperationsInput | string
    roleName?: StringFieldUpdateOperationsInput | string
    reportData?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReportUncheckedUpdateWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    candidateName?: StringFieldUpdateOperationsInput | string
    roleName?: StringFieldUpdateOperationsInput | string
    reportData?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReportUncheckedUpdateManyWithoutSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    candidateName?: StringFieldUpdateOperationsInput | string
    roleName?: StringFieldUpdateOperationsInput | string
    reportData?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use OrganizationCountOutputTypeDefaultArgs instead
     */
    export type OrganizationCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = OrganizationCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use InterviewSessionCountOutputTypeDefaultArgs instead
     */
    export type InterviewSessionCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = InterviewSessionCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use OrganizationDefaultArgs instead
     */
    export type OrganizationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = OrganizationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use InterviewSessionDefaultArgs instead
     */
    export type InterviewSessionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = InterviewSessionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TranscriptEntryDefaultArgs instead
     */
    export type TranscriptEntryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TranscriptEntryDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ObservationDefaultArgs instead
     */
    export type ObservationArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ObservationDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AssessorVerdictDefaultArgs instead
     */
    export type AssessorVerdictArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AssessorVerdictDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ReportDefaultArgs instead
     */
    export type ReportArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ReportDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}