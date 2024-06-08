import { Request } from 'express';

export interface DecodedToken {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

export interface FileDeleteRequest extends Request {
  body: {
    fileCategory: string;
    fileId: string;
  };
  userData?: {
    userId: string;
  };
}

export interface DecodedRequest extends Request {
  userData?: {
    userId: string;
    email: string;
  };
}

  export interface FileUploadRequest extends DecodedRequest {
    fileInfo?: {
      filename: string;
      location: string;
      type: string;
    };
    fileCategory?: string;
    
  }
  