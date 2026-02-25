import { isTokenExpired } from "../utils/token";
import {Storage} from "../utils/storage"

export default defineNuxtRouteMiddleware((event) => {
    if(event.path === "/"){
        return
    }
    const raw = Storage.get("auth")
    const token = raw ? JSON.parse(raw)?.userInfo?.token : null

    if (!token || isTokenExpired(token)) {
        return navigateTo('/')
    }
})