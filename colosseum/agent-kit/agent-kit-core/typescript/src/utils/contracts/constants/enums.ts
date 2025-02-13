export enum KeyType {
  // The key type is missing.
  KEY_TYPE_UNSPECIFIED = 0,

  // The key is an ECDSA secp256k1 key.
  KEY_TYPE_ECDSA_SECP256K1 = 1,

  // The key is an EdDSA Ed25519 key.
  KEY_TYPE_EDDSA_ED25519 = 2,
}

export enum ActionStatus {
	Unspecified,
	Pending,
	Completed,
	Revoked,
	Timeout,
}

export enum KeyRequestStatus {
  /** KEY_REQUEST_STATUS_UNSPECIFIED - The request is missing the status field. */
  KEY_REQUEST_STATUS_UNSPECIFIED = 0,
  /**
   * KEY_REQUEST_STATUS_PENDING - The request is waiting to be fulfilled. This is the initial state of a
   * request.
   */
  KEY_REQUEST_STATUS_PENDING = 1,
  /** KEY_REQUEST_STATUS_FULFILLED - The request was fulfilled. This is a final state for a request. */
  KEY_REQUEST_STATUS_FULFILLED = 2,
  /** KEY_REQUEST_STATUS_REJECTED - The request was rejected. This is a final state for a request. */
  KEY_REQUEST_STATUS_REJECTED = 3,
  UNRECOGNIZED = -1
}

export enum SignRequestStatus {
  /** SIGN_REQUEST_STATUS_UNSPECIFIED - The request is missing the status field. */
  SIGN_REQUEST_STATUS_UNSPECIFIED = 0,
  /**
   * SIGN_REQUEST_STATUS_PENDING - The request is waiting to be fulfilled. This is the initial state of a
   * request.
   */
  SIGN_REQUEST_STATUS_PENDING = 1,
  /** SIGN_REQUEST_STATUS_FULFILLED - The request was fulfilled. This is a final state for a request. */
  SIGN_REQUEST_STATUS_FULFILLED = 2,
  /** SIGN_REQUEST_STATUS_REJECTED - The request was rejected. This is a final state for a request. */
  SIGN_REQUEST_STATUS_REJECTED = 3,
  UNRECOGNIZED = -1
}
