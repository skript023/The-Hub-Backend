import { CookieOptions } from "express"

export const cookie_prod: CookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'strict' as boolean | 'lax' | 'strict' | 'none' | undefined,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    domain: '.rena.my.id'
}

export const cookie_dev: CookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'lax' as boolean | 'lax' | 'strict' | 'none' | undefined,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
}