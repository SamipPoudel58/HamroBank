export interface VerificationPayload {
  chequeImg: string;
  accountNo: string;
}

export type ForgeryStatus = 'real' | 'forged';

export interface VerificationResult {
  status: ForgeryStatus;
  confidence: number;
  originalSignImg: string;
}
