import { type NextApiRequest } from 'next'
import nookies from 'nookies'
import { decryptCookie } from '~/utils/security/encrypt'

export const getServerSession = async (req: NextApiRequest) => {
  // get cookies using nookies
  const cookies = nookies.get({ req })
  const headersCookieUntreated = req.headers['x-api-key'] as string

  const headersCookie =
    headersCookieUntreated === 'undefined' || headersCookieUntreated === 'null'
      ? undefined
      : headersCookieUntreated
  const encryptedCookie = cookies['CELLY_COOKIES']
  if (!encryptedCookie && !headersCookie) {
    return null
  }
  const finalCookie = encryptedCookie ?? headersCookie
  // decrypt cookie
  const decryptedCookie = decryptCookie(finalCookie!)
  // check format of cookie
  if (!decryptedCookie?.id || !decryptedCookie.name) {
    return null
  }
  const session = {
    user: decryptedCookie,
  } as MySession
  return session
}

export type MySession = {
  user: {
    id: number
    name: string
  }
}
