import { useRouter } from "next/router"
import { api } from "../api"

export const getSession = () => {
    const router = useRouter()
    const userData = api.auth.getSession.useQuery(undefined, {
        refetchOnWindowFocus: false, 
        retry: 1,
    })

    if(userData.error) {
        router.replace('/login')
    }

    return userData
}

export const checkAuth = () => {
    const router = useRouter()
    const userData = api.auth.getSession.useQuery(undefined, {
        refetchOnWindowFocus: false, 
        retry: 1,
    })

    if(userData.data?.user) {
        router.push('/admin')
    }
}