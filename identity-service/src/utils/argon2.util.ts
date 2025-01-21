import * as argon2 from 'argon2'

export const hashPassword=async(password:string)=>{
    return await argon2.hash(password)
}

export const comparePassword=async(passwordL:string, hashedPassword:string)=>{
    try {
        const isMatch=await argon2.verify(hashedPassword,passwordL)

        if(!isMatch)throw new Error('Invalid Password')
    
        return isMatch
    } catch (error) {
        throw error;
    }
}