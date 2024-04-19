
export const cookie_prod = {
    httpOnly: true,
    secure: true,
    sameSite: 'none' as boolean | 'lax' | 'strict' | 'none' | undefined
}

export const cookie_dev = {
    httpOnly: true,
    secure: true,
    sameSite: 'lax' as boolean | 'lax' | 'strict' | 'none' | undefined
}