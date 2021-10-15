export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `DateTime` scalar represents an ISO-8601 compliant date time type. */
  DateTime: any;
  UUID: any;
  /** The `Long` scalar type represents non-fractional signed whole 64-bit numeric values. Long can represent values between -(2^63) and 2^63 - 1. */
  Long: any;
};

export type Query = {
  __typename?: 'Query';
  /** Returns a list of pastes and markdown docs beloning to the active user */
  myDocs?: Maybe<MyDocsConnection>;
  /** Returns a doc(paste or markdown) by slug */
  doc?: Maybe<VirtualFile>;
  file?: Maybe<PhysicalFile>;
  /** Paged list of the active users uploaded media, newest first. */
  myFiles?: Maybe<MyFilesConnection>;
  /** Returns a list of this users permanently deleted files(no recovery, 30 days passed) */
  deletedFiles?: Maybe<Array<Maybe<DeletedFile>>>;
  /** Returns a paged list of this users files awaiting removal(30 days after deleted) */
  filesPendingRemoval?: Maybe<AllFilesResult>;
  /** Returns a paged list of physical and virtual files */
  allFiles?: Maybe<AllFilesResult>;
  /** Returns a list of User Features enabled on the current users account */
  userFeatures?: Maybe<Array<Maybe<UserFeature>>>;
  /** Returns a result outlining the total storage space used by physical files uploaded by this user(including files marked for deletion but not yet deleted) */
  storageUsage?: Maybe<UserStorageUsageResult>;
  /** Returns paged list of signup codes */
  signupCodes?: Maybe<SignupCodesConnection>;
  /** Returns the API key for the current user */
  myApiKey?: Maybe<Scalars['String']>;
};


export type QueryMyDocsArgs = {
  first?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  last?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
};


export type QueryDocArgs = {
  slug?: Maybe<Scalars['String']>;
};


export type QueryFileArgs = {
  slug?: Maybe<Scalars['String']>;
};


export type QueryMyFilesArgs = {
  first?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  last?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
};


export type QueryFilesPendingRemovalArgs = {
  page?: Scalars['Int'];
  perPage?: Scalars['Int'];
};


export type QueryAllFilesArgs = {
  page?: Scalars['Int'];
  perPage?: Scalars['Int'];
};


export type QuerySignupCodesArgs = {
  first?: Maybe<Scalars['Int']>;
  after?: Maybe<Scalars['String']>;
  last?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Create a signup code for new users to use */
  createSignupCode?: Maybe<SignupCode>;
  /** Removes an existing signup code */
  removeSignupCode: Scalars['Boolean'];
  /** Creates a code paste */
  createPaste?: Maybe<VirtualFile>;
  /** Create a markdown document */
  createMarkdown?: Maybe<VirtualFile>;
  /** Marks a document(paste or MD) for removal */
  removeDoc: Scalars['Boolean'];
  /** Permenantly deletes a file that is currently marked for removal */
  forceFileDelete: Scalars['Boolean'];
  /** If a file belonging to the current user has been marked for deletion(IE deleted within the last30 days), this endpoint will undo it. */
  undoFileDelete: Scalars['Boolean'];
  /** Marks a physical file for removal */
  removeFile: Scalars['Boolean'];
};


export type MutationCreateSignupCodeArgs = {
  input?: Maybe<CreateSignupCodeInput>;
};


export type MutationRemoveSignupCodeArgs = {
  code?: Maybe<Scalars['String']>;
};


export type MutationCreatePasteArgs = {
  input?: Maybe<CreatePasteInput>;
};


export type MutationCreateMarkdownArgs = {
  input?: Maybe<CreateMarkdownInput>;
};


export type MutationRemoveDocArgs = {
  slug?: Maybe<Scalars['String']>;
};


export type MutationForceFileDeleteArgs = {
  input?: Maybe<UndoFileDeleteInput>;
};


export type MutationUndoFileDeleteArgs = {
  input?: Maybe<UndoFileDeleteInput>;
};


export type MutationRemoveFileArgs = {
  slug?: Maybe<Scalars['String']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  notifyCompletedTUSUpload?: Maybe<UploadCompleteEventResult>;
};

export enum ApplyPolicy {
  BeforeResolver = 'BEFORE_RESOLVER',
  AfterResolver = 'AFTER_RESOLVER'
}

/** A connection to a list of items. */
export type MyDocsConnection = {
  __typename?: 'MyDocsConnection';
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** A list of edges. */
  edges?: Maybe<Array<MyDocsEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<Maybe<VirtualFile>>>;
};

/** A connection to a list of items. */
export type MyFilesConnection = {
  __typename?: 'MyFilesConnection';
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** A list of edges. */
  edges?: Maybe<Array<MyFilesEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<Maybe<PhysicalFile>>>;
};

/** A connection to a list of items. */
export type SignupCodesConnection = {
  __typename?: 'SignupCodesConnection';
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** A list of edges. */
  edges?: Maybe<Array<SignupCodesEdge>>;
  /** A flattened list of the nodes. */
  nodes?: Maybe<Array<Maybe<SignupCode>>>;
};

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** Indicates whether more edges exist following the set defined by the clients arguments. */
  hasNextPage: Scalars['Boolean'];
  /** Indicates whether more edges exist prior the set defined by the clients arguments. */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']>;
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']>;
};

/** Represents a virtually stored file(code pastes, markdown docs, etc) */
export type VirtualFile = {
  __typename?: 'VirtualFile';
  /** Slug identifier for this file */
  slug?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  /** Title of this file */
  name?: Maybe<Scalars['String']>;
  /** The content(text) of this document */
  content?: Maybe<Scalars['String']>;
  /** If this is a code paste, the language that it was created with. */
  language?: Maybe<Scalars['String']>;
  /** The user responsible for uploading this file */
  uploader?: Maybe<AppUser>;
  /** The type of virtual file(code paste or markdown doc) */
  fileKind: VirtualFileKind;
  /** If this document is a fork, this is the parent documen it was forked from. */
  parentFile?: Maybe<VirtualFile>;
  /** Date and time this file was uploaded */
  created: Scalars['DateTime'];
  /** Whether this file is marked as deleted */
  markedForDeletion: Scalars['Boolean'];
  /** The date and time this file was marked as deleted */
  deletedAt: Scalars['DateTime'];
  deletedBy?: Maybe<AppUser>;
  deletedFor?: Maybe<Scalars['String']>;
  /** Frontend preview URL for this file */
  previewUrl?: Maybe<Scalars['String']>;
};

/** An edge in a connection. */
export type MyDocsEdge = {
  __typename?: 'MyDocsEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node?: Maybe<VirtualFile>;
};

/** Represents a physical stored file on S3(audio, video, images, etc) */
export type PhysicalFile = {
  __typename?: 'PhysicalFile';
  /** Slug identifier for this file */
  slug?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  /** S3 store ID for this file */
  fileId: Scalars['UUID'];
  /** The name of the original uploaded file */
  fileName?: Maybe<Scalars['String']>;
  /** The mimetype of the original uploaded file */
  mimeType?: Maybe<Scalars['String']>;
  /** The size in bytes of the original uploaded file */
  fileLength: Scalars['Long'];
  /** S3 file URL */
  fileUrl?: Maybe<Scalars['String']>;
  /** The user responsible for uploading this file */
  uploader?: Maybe<AppUser>;
  /** Frontend preview URL for this file */
  previewUrl?: Maybe<Scalars['String']>;
  /** The kind of media this file represents */
  fileKind: FileKind;
  /** Date and time this file was uploaded */
  created: Scalars['DateTime'];
  /** Whether this file is marked as deleted */
  markedForDeletion: Scalars['Boolean'];
  /** The date and time this file was marked as deleted */
  deletedAt: Scalars['DateTime'];
  deletedBy?: Maybe<AppUser>;
  deletedFor?: Maybe<Scalars['String']>;
  uploadComplete: Scalars['Boolean'];
};

/** An edge in a connection. */
export type MyFilesEdge = {
  __typename?: 'MyFilesEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node?: Maybe<PhysicalFile>;
};

export type SignupCode = {
  __typename?: 'SignupCode';
  code?: Maybe<Scalars['String']>;
  isAdmin: Scalars['Boolean'];
  creatorUser?: Maybe<AppUser>;
  creatorId?: Maybe<Scalars['String']>;
  user?: Maybe<AppUser>;
  used: Scalars['Boolean'];
  usedAt: Scalars['DateTime'];
  created: Scalars['DateTime'];
};

/** An edge in a connection. */
export type SignupCodesEdge = {
  __typename?: 'SignupCodesEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The item at the end of the edge. */
  node?: Maybe<SignupCode>;
};

export type CreateSignupCodeInput = {
  isAdmin: Scalars['Boolean'];
};

export type AppUser = {
  __typename?: 'AppUser';
  id?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  isAdmin: Scalars['Boolean'];
  isOwner: Scalars['Boolean'];
  maxStorageSize: Scalars['Float'];
  maxUploadSize: Scalars['Float'];
  apiKey?: Maybe<Scalars['String']>;
  /** Additional features provided to this user account */
  features?: Maybe<Array<Maybe<AppliedUserFeature>>>;
  created: Scalars['DateTime'];
  updated: Scalars['DateTime'];
};

export type UserStorageUsageResult = {
  __typename?: 'UserStorageUsageResult';
  /** The total amount of storage space currently in use by this user(in gigabytes) */
  gigabytes: Scalars['Float'];
  /** The total amount of storage space currently in use by this user(in megabytes) */
  megabytes: Scalars['Float'];
  /** The total amount of storage space currently in use by this user(in kilobytes) */
  kilobytes: Scalars['Float'];
  /** The amount of storage space in total available to this user(in gigabytes) */
  userMaxSizeInGb: Scalars['Float'];
  /** The amount of storage space in total available to this user(in mgeabytes) */
  userMaxSizeInMb: Scalars['Float'];
  /** The maximum size of file that can be uploaded by this user(in megabytes) */
  userMaxUploadSizeInMb: Scalars['Float'];
  /** The maximum size of file that can be uploaded by this user(in bytes) */
  userMaxUploadSizeInB: Scalars['Float'];
  userMaxUploadSizeString?: Maybe<Scalars['String']>;
  userMaxSizeString?: Maybe<Scalars['String']>;
};

/** A feature that can be applied to a user account */
export type UserFeature = {
  __typename?: 'UserFeature';
  featureName?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
};

export type AllFilesResult = {
  __typename?: 'AllFilesResult';
  files?: Maybe<Array<Maybe<FileResult>>>;
  numPages: Scalars['Int'];
  hasNextPage: Scalars['Boolean'];
  curPage: Scalars['Int'];
};

export type DeletedFile = {
  __typename?: 'DeletedFile';
  id: Scalars['UUID'];
  fileId: Scalars['UUID'];
  fileSlug?: Maybe<Scalars['String']>;
  fileName?: Maybe<Scalars['String']>;
  uploader?: Maybe<AppUser>;
  deleter?: Maybe<AppUser>;
  deletedReason?: Maybe<Scalars['String']>;
  deletedAt: Scalars['DateTime'];
  deleteMarkedAt: Scalars['DateTime'];
  fileType: DeletedFileType;
};

export enum VirtualFileKind {
  CodePaste = 'CODE_PASTE',
  Markdown = 'MARKDOWN'
}

export type AuthDirective = {
  __typename?: 'AuthDirective';
  requireAdmin: Scalars['Boolean'];
};

export type CreatePasteInput = {
  /** Optional document name */
  name?: Maybe<Scalars['String']>;
  /** Paste content */
  text: Scalars['String'];
  /** Code language for highlighting */
  language: Scalars['String'];
  /** The slug of the parent paste if this is a fork. */
  parentSlug?: Maybe<Scalars['String']>;
  /** A custom slug, if enabled on this account(between 5 and 75 characters in length). */
  customSlug?: Maybe<Scalars['String']>;
};

export type CreateMarkdownInput = {
  /** Optional document name */
  name?: Maybe<Scalars['String']>;
  /** Markdown content */
  text: Scalars['String'];
  /** The slug of the parent document if this is a fork. */
  parentSlug?: Maybe<Scalars['String']>;
  /** A custom slug, if enabled on this account(between 5 and 75 characters in length). */
  customSlug?: Maybe<Scalars['String']>;
};

export type UndoFileDeleteInput = {
  /** The slug for the file */
  slug?: Maybe<Scalars['String']>;
  /** The type of file('PHYSICAL' or 'VIRTUAL') */
  type: UndoFileDeleteType;
};

export type UploadCompleteEventResult = {
  __typename?: 'UploadCompleteEventResult';
  uploadId?: Maybe<Scalars['String']>;
  file?: Maybe<PhysicalFile>;
};

export enum FileKind {
  Video = 'VIDEO',
  Audio = 'AUDIO',
  Text = 'TEXT',
  Image = 'IMAGE',
  Paste = 'PASTE',
  Markdown = 'MARKDOWN',
  File = 'FILE'
}

export enum UndoFileDeleteType {
  Physical = 'PHYSICAL',
  Virtual = 'VIRTUAL'
}

export enum DeletedFileType {
  Physical = 'PHYSICAL',
  Virtual = 'VIRTUAL'
}

export type FileResult = {
  __typename?: 'FileResult';
  id?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  fileType: AllFilesResultType;
  name?: Maybe<Scalars['String']>;
  s3Url?: Maybe<Scalars['String']>;
  previewUrl?: Maybe<Scalars['String']>;
  virtual?: Maybe<VirtualFile>;
  physical?: Maybe<PhysicalFile>;
  physicalKind: FileKind;
  virtualKind: VirtualFileKind;
  created: Scalars['DateTime'];
};

export type AppliedUserFeature = {
  __typename?: 'AppliedUserFeature';
  id: Scalars['UUID'];
  feature?: Maybe<UserFeature>;
};

export enum AllFilesResultType {
  Physical = 'PHYSICAL',
  Virtual = 'VIRTUAL'
}
