// KV6002/frontend/public/Authentication/cookieHandling.jsx

export function getCookies(variable) {
    const cookies = document.cookie;
    if (!cookies) return null;

    const cookieArray = cookies.split('; ');
    for (let i of cookieArray) {
        const [key, value] = i.split('=');
        if (key === variable) {
            return value;
        }
    }
    return null;
}

export function existingLoginCheck() {
    const userLoggedIn = getCookies('username');
    return userLoggedIn !== null;
}

export function loginCookieSet(username, userRole) {
    const expirationDays = 7;
    const date = new Date();
    date.setTime(date.getTime() + expirationDays * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}; path=/`;

    // Set username cookie
    document.cookie = `username=${username}; ${expires}`;
    // Set userRole cookie
    document.cookie = `userRole=${userRole}; ${expires}`;
}

export function logoutUser() {
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
