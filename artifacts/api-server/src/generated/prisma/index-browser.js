
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.OrganizationScalarFieldEnum = {
  id: 'id',
  name: 'name',
  settings: 'settings',
  createdAt: 'createdAt'
};

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  name: 'name',
  role: 'role',
  status: 'status',
  passwordHash: 'passwordHash',
  googleId: 'googleId',
  organizationId: 'organizationId',
  lastActiveAt: 'lastActiveAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.InvitationScalarFieldEnum = {
  id: 'id',
  email: 'email',
  role: 'role',
  token: 'token',
  invitedById: 'invitedById',
  organizationId: 'organizationId',
  expiresAt: 'expiresAt',
  acceptedAt: 'acceptedAt',
  createdAt: 'createdAt'
};

exports.Prisma.ActivityLogScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  actorId: 'actorId',
  action: 'action',
  details: 'details',
  createdAt: 'createdAt'
};

exports.Prisma.CandidateScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  name: 'name',
  email: 'email',
  phone: 'phone',
  linkedinUrl: 'linkedinUrl',
  githubUrl: 'githubUrl',
  portfolioUrl: 'portfolioUrl',
  source: 'source',
  sourceDetail: 'sourceDetail',
  currentRole: 'currentRole',
  currentCompany: 'currentCompany',
  yearsExperience: 'yearsExperience',
  salaryExpectation: 'salaryExpectation',
  noticePeriod: 'noticePeriod',
  pipelineStage: 'pipelineStage',
  rejectionReason: 'rejectionReason',
  tags: 'tags',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CandidateDocumentScalarFieldEnum = {
  id: 'id',
  candidateId: 'candidateId',
  type: 'type',
  filename: 'filename',
  mimeType: 'mimeType',
  content: 'content',
  rawData: 'rawData',
  createdAt: 'createdAt'
};

exports.Prisma.CandidateIntelligenceScalarFieldEnum = {
  id: 'id',
  candidateId: 'candidateId',
  type: 'type',
  data: 'data',
  sourceText: 'sourceText',
  createdAt: 'createdAt'
};

exports.Prisma.CandidateNoteScalarFieldEnum = {
  id: 'id',
  candidateId: 'candidateId',
  userId: 'userId',
  userName: 'userName',
  content: 'content',
  type: 'type',
  createdAt: 'createdAt'
};

exports.Prisma.CandidateReferenceScalarFieldEnum = {
  id: 'id',
  candidateId: 'candidateId',
  refereeName: 'refereeName',
  refereeEmail: 'refereeEmail',
  refereePhone: 'refereePhone',
  refereeRelation: 'refereeRelation',
  refereeCompany: 'refereeCompany',
  status: 'status',
  token: 'token',
  responses: 'responses',
  aiAnalysis: 'aiAnalysis',
  completedAt: 'completedAt',
  createdAt: 'createdAt'
};

exports.Prisma.InterviewSessionScalarFieldEnum = {
  id: 'id',
  organizationId: 'organizationId',
  candidateId: 'candidateId',
  setup: 'setup',
  status: 'status',
  startedAt: 'startedAt',
  endedAt: 'endedAt',
  voiceProvider: 'voiceProvider',
  videoEnabled: 'videoEnabled',
  audioData: 'audioData',
  createdAt: 'createdAt'
};

exports.Prisma.TranscriptEntryScalarFieldEnum = {
  id: 'id',
  sessionId: 'sessionId',
  speaker: 'speaker',
  text: 'text',
  timestamp: 'timestamp',
  audioTimestamp: 'audioTimestamp'
};

exports.Prisma.ObservationScalarFieldEnum = {
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

exports.Prisma.AssessorVerdictScalarFieldEnum = {
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

exports.Prisma.ReportScalarFieldEnum = {
  id: 'id',
  sessionId: 'sessionId',
  candidateName: 'candidateName',
  roleName: 'roleName',
  reportData: 'reportData',
  coachingReport: 'coachingReport',
  createdAt: 'createdAt'
};

exports.Prisma.InterviewInviteScalarFieldEnum = {
  id: 'id',
  token: 'token',
  candidateId: 'candidateId',
  candidateName: 'candidateName',
  candidateEmail: 'candidateEmail',
  roleName: 'roleName',
  roleLevel: 'roleLevel',
  jobDescription: 'jobDescription',
  activeGates: 'activeGates',
  interviewMode: 'interviewMode',
  status: 'status',
  sessionId: 'sessionId',
  organizationId: 'organizationId',
  expiresAt: 'expiresAt',
  createdAt: 'createdAt'
};

exports.Prisma.CalibrationSessionScalarFieldEnum = {
  id: 'id',
  reportId: 'reportId',
  title: 'title',
  status: 'status',
  organizationId: 'organizationId',
  createdAt: 'createdAt'
};

exports.Prisma.CalibrationNoteScalarFieldEnum = {
  id: 'id',
  calibrationSessionId: 'calibrationSessionId',
  userId: 'userId',
  userName: 'userName',
  content: 'content',
  sectionRef: 'sectionRef',
  createdAt: 'createdAt'
};

exports.Prisma.ReportFeedbackScalarFieldEnum = {
  id: 'id',
  reportId: 'reportId',
  userId: 'userId',
  overallAccuracy: 'overallAccuracy',
  hireOutcome: 'hireOutcome',
  performanceNote: 'performanceNote',
  dimensionFeedback: 'dimensionFeedback',
  gateFeedback: 'gateFeedback',
  comments: 'comments',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SystemPromptVersionScalarFieldEnum = {
  id: 'id',
  role: 'role',
  version: 'version',
  prompt: 'prompt',
  isActive: 'isActive',
  performance: 'performance',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  Organization: 'Organization',
  User: 'User',
  Invitation: 'Invitation',
  ActivityLog: 'ActivityLog',
  Candidate: 'Candidate',
  CandidateDocument: 'CandidateDocument',
  CandidateIntelligence: 'CandidateIntelligence',
  CandidateNote: 'CandidateNote',
  CandidateReference: 'CandidateReference',
  InterviewSession: 'InterviewSession',
  TranscriptEntry: 'TranscriptEntry',
  Observation: 'Observation',
  AssessorVerdict: 'AssessorVerdict',
  Report: 'Report',
  InterviewInvite: 'InterviewInvite',
  CalibrationSession: 'CalibrationSession',
  CalibrationNote: 'CalibrationNote',
  ReportFeedback: 'ReportFeedback',
  SystemPromptVersion: 'SystemPromptVersion'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
