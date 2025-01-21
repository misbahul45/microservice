import { z } from "zod";
import { VALIDATE_IDENTITY } from "../validation/identity.validate";

export type REGISTER=z.infer<typeof VALIDATE_IDENTITY.REGISTER>