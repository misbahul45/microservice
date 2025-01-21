import * as jwt from "jsonwebtoken"
import crypto from 'crypto'
import prisma from "./prisma"
import { GENERATETOKEN_RESPONSE } from "../types/web.types"

const JWT_SECRET=process.env.JWT_SECRET as string

export default async function generateToken(userId:string) :Promise<GENERATETOKEN_RESPONSE> {
 const accessToken= jwt.sign({
        userId,
    }, JWT_SECRET, {  expiresIn:'10m' })

  const refreshToken=crypto.randomBytes(40).toString('hex');
  const expiresAt=new Date()
  expiresAt.setDate(expiresAt.getDate()+7);

  await prisma.refreshToken.create({
    data:{
        token:refreshToken,
        userId,
        expiresAt
    }
  })

  return { accessToken, refreshToken }
}