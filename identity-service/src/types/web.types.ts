export interface WEBRESPONSE{
    status:boolean,
    message:string,
    data?:any,
}

export interface GENERATETOKEN_RESPONSE{
    accessToken:string,
    refreshToken:string
}

export interface ErrorConfig extends Error {
    status: number;
    message: string;
    stack?: string;
  }