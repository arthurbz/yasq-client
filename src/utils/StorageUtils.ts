export function getUserId() {
    return localStorage.getItem("userId")
}

export function setUserId(userId: string) {
    return localStorage.setItem("userId", userId)
}

export function removeUserId() {
    return localStorage.removeItem("userId")
}
