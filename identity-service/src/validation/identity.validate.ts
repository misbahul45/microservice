import { z } from "zod";

export class VALIDATE_IDENTITY{
    static readonly REGISTER=z.object({
        email:z.string().email({ message:'Invalid Email' }),
        username:z.string().min(3, { message:"Username must be at least 3 characters" }),
        password:z.string().min(8)
    })
}