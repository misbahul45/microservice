import { ZodError, ZodSchema } from "zod";
import Logger from "../utils/logger";

export class ZOD_VALIDATION{
    static validate<T>(schema:ZodSchema<T>, data:unknown):T{
        try {
            return schema.parse(data)
        } catch (error) {
            Logger.error("Validation Error", error)
            if(error instanceof ZodError){
                throw new Error("Validation Error")
            }
            throw error
        }
    }
}