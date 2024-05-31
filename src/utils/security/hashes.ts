import crypto from 'crypto'

export const hashSha256Hex = (data:string) => {
    return crypto.createHash('sha256').update(data, 'ascii').digest('hex')
}



