import { destroyCookie, setCookie } from 'nookies'

export const setUserCookies = (cookie: string) => {
  setCookie(null, 'CELLY_COOKIES', cookie, {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: '/',
  })
}

export const deleteUserCookies = () => {
  destroyCookie({}, 'CELLY_COOKIES', {
    path: '/',
  })
}
