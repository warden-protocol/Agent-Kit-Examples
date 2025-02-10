// package: disperser
// file: disperser/disperser.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as common_common_pb from "../common/common_pb";

export class AuthenticatedRequest extends jspb.Message { 

    hasDisperseRequest(): boolean;
    clearDisperseRequest(): void;
    getDisperseRequest(): DisperseBlobRequest | undefined;
    setDisperseRequest(value?: DisperseBlobRequest): AuthenticatedRequest;

    hasAuthenticationData(): boolean;
    clearAuthenticationData(): void;
    getAuthenticationData(): AuthenticationData | undefined;
    setAuthenticationData(value?: AuthenticationData): AuthenticatedRequest;

    getPayloadCase(): AuthenticatedRequest.PayloadCase;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): AuthenticatedRequest.AsObject;
    static toObject(includeInstance: boolean, msg: AuthenticatedRequest): AuthenticatedRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: AuthenticatedRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): AuthenticatedRequest;
    static deserializeBinaryFromReader(message: AuthenticatedRequest, reader: jspb.BinaryReader): AuthenticatedRequest;
}

export namespace AuthenticatedRequest {
    export type AsObject = {
        disperseRequest?: DisperseBlobRequest.AsObject,
        authenticationData?: AuthenticationData.AsObject,
    }

    export enum PayloadCase {
        PAYLOAD_NOT_SET = 0,
        DISPERSE_REQUEST = 1,
        AUTHENTICATION_DATA = 2,
    }

}

export class AuthenticatedReply extends jspb.Message { 

    hasBlobAuthHeader(): boolean;
    clearBlobAuthHeader(): void;
    getBlobAuthHeader(): BlobAuthHeader | undefined;
    setBlobAuthHeader(value?: BlobAuthHeader): AuthenticatedReply;

    hasDisperseReply(): boolean;
    clearDisperseReply(): void;
    getDisperseReply(): DisperseBlobReply | undefined;
    setDisperseReply(value?: DisperseBlobReply): AuthenticatedReply;

    getPayloadCase(): AuthenticatedReply.PayloadCase;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): AuthenticatedReply.AsObject;
    static toObject(includeInstance: boolean, msg: AuthenticatedReply): AuthenticatedReply.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: AuthenticatedReply, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): AuthenticatedReply;
    static deserializeBinaryFromReader(message: AuthenticatedReply, reader: jspb.BinaryReader): AuthenticatedReply;
}

export namespace AuthenticatedReply {
    export type AsObject = {
        blobAuthHeader?: BlobAuthHeader.AsObject,
        disperseReply?: DisperseBlobReply.AsObject,
    }

    export enum PayloadCase {
        PAYLOAD_NOT_SET = 0,
        BLOB_AUTH_HEADER = 1,
        DISPERSE_REPLY = 2,
    }

}

export class BlobAuthHeader extends jspb.Message { 
    getChallengeParameter(): number;
    setChallengeParameter(value: number): BlobAuthHeader;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): BlobAuthHeader.AsObject;
    static toObject(includeInstance: boolean, msg: BlobAuthHeader): BlobAuthHeader.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: BlobAuthHeader, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): BlobAuthHeader;
    static deserializeBinaryFromReader(message: BlobAuthHeader, reader: jspb.BinaryReader): BlobAuthHeader;
}

export namespace BlobAuthHeader {
    export type AsObject = {
        challengeParameter: number,
    }
}

export class AuthenticationData extends jspb.Message { 
    getAuthenticationData(): Uint8Array | string;
    getAuthenticationData_asU8(): Uint8Array;
    getAuthenticationData_asB64(): string;
    setAuthenticationData(value: Uint8Array | string): AuthenticationData;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): AuthenticationData.AsObject;
    static toObject(includeInstance: boolean, msg: AuthenticationData): AuthenticationData.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: AuthenticationData, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): AuthenticationData;
    static deserializeBinaryFromReader(message: AuthenticationData, reader: jspb.BinaryReader): AuthenticationData;
}

export namespace AuthenticationData {
    export type AsObject = {
        authenticationData: Uint8Array | string,
    }
}

export class DisperseBlobRequest extends jspb.Message { 
    getData(): Uint8Array | string;
    getData_asU8(): Uint8Array;
    getData_asB64(): string;
    setData(value: Uint8Array | string): DisperseBlobRequest;
    clearCustomQuorumNumbersList(): void;
    getCustomQuorumNumbersList(): Array<number>;
    setCustomQuorumNumbersList(value: Array<number>): DisperseBlobRequest;
    addCustomQuorumNumbers(value: number, index?: number): number;
    getAccountId(): string;
    setAccountId(value: string): DisperseBlobRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DisperseBlobRequest.AsObject;
    static toObject(includeInstance: boolean, msg: DisperseBlobRequest): DisperseBlobRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DisperseBlobRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DisperseBlobRequest;
    static deserializeBinaryFromReader(message: DisperseBlobRequest, reader: jspb.BinaryReader): DisperseBlobRequest;
}

export namespace DisperseBlobRequest {
    export type AsObject = {
        data: Uint8Array | string,
        customQuorumNumbersList: Array<number>,
        accountId: string,
    }
}

export class DisperseBlobReply extends jspb.Message { 
    getResult(): BlobStatus;
    setResult(value: BlobStatus): DisperseBlobReply;
    getRequestId(): Uint8Array | string;
    getRequestId_asU8(): Uint8Array;
    getRequestId_asB64(): string;
    setRequestId(value: Uint8Array | string): DisperseBlobReply;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DisperseBlobReply.AsObject;
    static toObject(includeInstance: boolean, msg: DisperseBlobReply): DisperseBlobReply.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DisperseBlobReply, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DisperseBlobReply;
    static deserializeBinaryFromReader(message: DisperseBlobReply, reader: jspb.BinaryReader): DisperseBlobReply;
}

export namespace DisperseBlobReply {
    export type AsObject = {
        result: BlobStatus,
        requestId: Uint8Array | string,
    }
}

export class BlobStatusRequest extends jspb.Message { 
    getRequestId(): Uint8Array | string;
    getRequestId_asU8(): Uint8Array;
    getRequestId_asB64(): string;
    setRequestId(value: Uint8Array | string): BlobStatusRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): BlobStatusRequest.AsObject;
    static toObject(includeInstance: boolean, msg: BlobStatusRequest): BlobStatusRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: BlobStatusRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): BlobStatusRequest;
    static deserializeBinaryFromReader(message: BlobStatusRequest, reader: jspb.BinaryReader): BlobStatusRequest;
}

export namespace BlobStatusRequest {
    export type AsObject = {
        requestId: Uint8Array | string,
    }
}

export class BlobStatusReply extends jspb.Message { 
    getStatus(): BlobStatus;
    setStatus(value: BlobStatus): BlobStatusReply;

    hasInfo(): boolean;
    clearInfo(): void;
    getInfo(): BlobInfo | undefined;
    setInfo(value?: BlobInfo): BlobStatusReply;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): BlobStatusReply.AsObject;
    static toObject(includeInstance: boolean, msg: BlobStatusReply): BlobStatusReply.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: BlobStatusReply, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): BlobStatusReply;
    static deserializeBinaryFromReader(message: BlobStatusReply, reader: jspb.BinaryReader): BlobStatusReply;
}

export namespace BlobStatusReply {
    export type AsObject = {
        status: BlobStatus,
        info?: BlobInfo.AsObject,
    }
}

export class RetrieveBlobRequest extends jspb.Message { 
    getBatchHeaderHash(): Uint8Array | string;
    getBatchHeaderHash_asU8(): Uint8Array;
    getBatchHeaderHash_asB64(): string;
    setBatchHeaderHash(value: Uint8Array | string): RetrieveBlobRequest;
    getBlobIndex(): number;
    setBlobIndex(value: number): RetrieveBlobRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): RetrieveBlobRequest.AsObject;
    static toObject(includeInstance: boolean, msg: RetrieveBlobRequest): RetrieveBlobRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: RetrieveBlobRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): RetrieveBlobRequest;
    static deserializeBinaryFromReader(message: RetrieveBlobRequest, reader: jspb.BinaryReader): RetrieveBlobRequest;
}

export namespace RetrieveBlobRequest {
    export type AsObject = {
        batchHeaderHash: Uint8Array | string,
        blobIndex: number,
    }
}

export class RetrieveBlobReply extends jspb.Message { 
    getData(): Uint8Array | string;
    getData_asU8(): Uint8Array;
    getData_asB64(): string;
    setData(value: Uint8Array | string): RetrieveBlobReply;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): RetrieveBlobReply.AsObject;
    static toObject(includeInstance: boolean, msg: RetrieveBlobReply): RetrieveBlobReply.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: RetrieveBlobReply, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): RetrieveBlobReply;
    static deserializeBinaryFromReader(message: RetrieveBlobReply, reader: jspb.BinaryReader): RetrieveBlobReply;
}

export namespace RetrieveBlobReply {
    export type AsObject = {
        data: Uint8Array | string,
    }
}

export class BlobInfo extends jspb.Message { 

    hasBlobHeader(): boolean;
    clearBlobHeader(): void;
    getBlobHeader(): BlobHeader | undefined;
    setBlobHeader(value?: BlobHeader): BlobInfo;

    hasBlobVerificationProof(): boolean;
    clearBlobVerificationProof(): void;
    getBlobVerificationProof(): BlobVerificationProof | undefined;
    setBlobVerificationProof(value?: BlobVerificationProof): BlobInfo;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): BlobInfo.AsObject;
    static toObject(includeInstance: boolean, msg: BlobInfo): BlobInfo.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: BlobInfo, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): BlobInfo;
    static deserializeBinaryFromReader(message: BlobInfo, reader: jspb.BinaryReader): BlobInfo;
}

export namespace BlobInfo {
    export type AsObject = {
        blobHeader?: BlobHeader.AsObject,
        blobVerificationProof?: BlobVerificationProof.AsObject,
    }
}

export class BlobHeader extends jspb.Message { 

    hasCommitment(): boolean;
    clearCommitment(): void;
    getCommitment(): common_common_pb.G1Commitment | undefined;
    setCommitment(value?: common_common_pb.G1Commitment): BlobHeader;
    getDataLength(): number;
    setDataLength(value: number): BlobHeader;
    clearBlobQuorumParamsList(): void;
    getBlobQuorumParamsList(): Array<BlobQuorumParam>;
    setBlobQuorumParamsList(value: Array<BlobQuorumParam>): BlobHeader;
    addBlobQuorumParams(value?: BlobQuorumParam, index?: number): BlobQuorumParam;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): BlobHeader.AsObject;
    static toObject(includeInstance: boolean, msg: BlobHeader): BlobHeader.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: BlobHeader, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): BlobHeader;
    static deserializeBinaryFromReader(message: BlobHeader, reader: jspb.BinaryReader): BlobHeader;
}

export namespace BlobHeader {
    export type AsObject = {
        commitment?: common_common_pb.G1Commitment.AsObject,
        dataLength: number,
        blobQuorumParamsList: Array<BlobQuorumParam.AsObject>,
    }
}

export class BlobQuorumParam extends jspb.Message { 
    getQuorumNumber(): number;
    setQuorumNumber(value: number): BlobQuorumParam;
    getAdversaryThresholdPercentage(): number;
    setAdversaryThresholdPercentage(value: number): BlobQuorumParam;
    getConfirmationThresholdPercentage(): number;
    setConfirmationThresholdPercentage(value: number): BlobQuorumParam;
    getChunkLength(): number;
    setChunkLength(value: number): BlobQuorumParam;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): BlobQuorumParam.AsObject;
    static toObject(includeInstance: boolean, msg: BlobQuorumParam): BlobQuorumParam.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: BlobQuorumParam, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): BlobQuorumParam;
    static deserializeBinaryFromReader(message: BlobQuorumParam, reader: jspb.BinaryReader): BlobQuorumParam;
}

export namespace BlobQuorumParam {
    export type AsObject = {
        quorumNumber: number,
        adversaryThresholdPercentage: number,
        confirmationThresholdPercentage: number,
        chunkLength: number,
    }
}

export class BlobVerificationProof extends jspb.Message { 
    getBatchId(): number;
    setBatchId(value: number): BlobVerificationProof;
    getBlobIndex(): number;
    setBlobIndex(value: number): BlobVerificationProof;

    hasBatchMetadata(): boolean;
    clearBatchMetadata(): void;
    getBatchMetadata(): BatchMetadata | undefined;
    setBatchMetadata(value?: BatchMetadata): BlobVerificationProof;
    getInclusionProof(): Uint8Array | string;
    getInclusionProof_asU8(): Uint8Array;
    getInclusionProof_asB64(): string;
    setInclusionProof(value: Uint8Array | string): BlobVerificationProof;
    getQuorumIndexes(): Uint8Array | string;
    getQuorumIndexes_asU8(): Uint8Array;
    getQuorumIndexes_asB64(): string;
    setQuorumIndexes(value: Uint8Array | string): BlobVerificationProof;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): BlobVerificationProof.AsObject;
    static toObject(includeInstance: boolean, msg: BlobVerificationProof): BlobVerificationProof.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: BlobVerificationProof, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): BlobVerificationProof;
    static deserializeBinaryFromReader(message: BlobVerificationProof, reader: jspb.BinaryReader): BlobVerificationProof;
}

export namespace BlobVerificationProof {
    export type AsObject = {
        batchId: number,
        blobIndex: number,
        batchMetadata?: BatchMetadata.AsObject,
        inclusionProof: Uint8Array | string,
        quorumIndexes: Uint8Array | string,
    }
}

export class BatchMetadata extends jspb.Message { 

    hasBatchHeader(): boolean;
    clearBatchHeader(): void;
    getBatchHeader(): BatchHeader | undefined;
    setBatchHeader(value?: BatchHeader): BatchMetadata;
    getSignatoryRecordHash(): Uint8Array | string;
    getSignatoryRecordHash_asU8(): Uint8Array;
    getSignatoryRecordHash_asB64(): string;
    setSignatoryRecordHash(value: Uint8Array | string): BatchMetadata;
    getFee(): Uint8Array | string;
    getFee_asU8(): Uint8Array;
    getFee_asB64(): string;
    setFee(value: Uint8Array | string): BatchMetadata;
    getConfirmationBlockNumber(): number;
    setConfirmationBlockNumber(value: number): BatchMetadata;
    getBatchHeaderHash(): Uint8Array | string;
    getBatchHeaderHash_asU8(): Uint8Array;
    getBatchHeaderHash_asB64(): string;
    setBatchHeaderHash(value: Uint8Array | string): BatchMetadata;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): BatchMetadata.AsObject;
    static toObject(includeInstance: boolean, msg: BatchMetadata): BatchMetadata.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: BatchMetadata, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): BatchMetadata;
    static deserializeBinaryFromReader(message: BatchMetadata, reader: jspb.BinaryReader): BatchMetadata;
}

export namespace BatchMetadata {
    export type AsObject = {
        batchHeader?: BatchHeader.AsObject,
        signatoryRecordHash: Uint8Array | string,
        fee: Uint8Array | string,
        confirmationBlockNumber: number,
        batchHeaderHash: Uint8Array | string,
    }
}

export class BatchHeader extends jspb.Message { 
    getBatchRoot(): Uint8Array | string;
    getBatchRoot_asU8(): Uint8Array;
    getBatchRoot_asB64(): string;
    setBatchRoot(value: Uint8Array | string): BatchHeader;
    getQuorumNumbers(): Uint8Array | string;
    getQuorumNumbers_asU8(): Uint8Array;
    getQuorumNumbers_asB64(): string;
    setQuorumNumbers(value: Uint8Array | string): BatchHeader;
    getQuorumSignedPercentages(): Uint8Array | string;
    getQuorumSignedPercentages_asU8(): Uint8Array;
    getQuorumSignedPercentages_asB64(): string;
    setQuorumSignedPercentages(value: Uint8Array | string): BatchHeader;
    getReferenceBlockNumber(): number;
    setReferenceBlockNumber(value: number): BatchHeader;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): BatchHeader.AsObject;
    static toObject(includeInstance: boolean, msg: BatchHeader): BatchHeader.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: BatchHeader, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): BatchHeader;
    static deserializeBinaryFromReader(message: BatchHeader, reader: jspb.BinaryReader): BatchHeader;
}

export namespace BatchHeader {
    export type AsObject = {
        batchRoot: Uint8Array | string,
        quorumNumbers: Uint8Array | string,
        quorumSignedPercentages: Uint8Array | string,
        referenceBlockNumber: number,
    }
}

export enum BlobStatus {
    UNKNOWN = 0,
    PROCESSING = 1,
    CONFIRMED = 2,
    FAILED = 3,
    FINALIZED = 4,
    INSUFFICIENT_SIGNATURES = 5,
    DISPERSING = 6,
}
