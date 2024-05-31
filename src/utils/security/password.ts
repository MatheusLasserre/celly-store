import * as bcrypt from 'bcrypt'


export async function hashPassword(pass:string) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(pass, salt);
    return hash;
  }

export async function validatePassWord(password:string, storedPass:string) {
    // const hashedPassword = await hashPassword(password);
    const passwordMatch = await bcrypt.compare(password, storedPass);

    return passwordMatch;
}
