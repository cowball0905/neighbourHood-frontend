import { isTokenExpired } from "../utils/token";
import {Storage} from "../utils/storage"

export default defineNuxtRouteMiddleware((event,from) => {
    const raw = Storage.get("auth")
    const token = raw ? JSON.parse(raw)?.userInfo?.token : null

    if (event.path === "/") {
        if (token && !isTokenExpired(token)) {
            return navigateTo('/home')
        }
        return
    }

    if (!token || isTokenExpired(token)) {
        return navigateTo('/')
    }
})