//Cookie Check

export function getCookies(variable)
{
    const cookies = document.cookie.split('; ');

    for (let i of cookies){
        const [key, value] = cookie.split('=');
        
        if (key === variable)
        {
            return value;
        }
    }
    return null;
}


//Checks if there's a user currently logged in, use for clicking on staff dashboard.
export function loginCheck()
{
    const loggedInUser = getCookie('username');

    if (loggedInUser === null)
        {
            navigate('/Login');
        }
}

//Initialises user related cookies for login management
export function loginCookieSet (userhash)
{   
    try{
        const expirationDays = 7; //No. days before cookie data expires.
        const date = new Date();
        date.setTime(date.getTime() + expirationDays * 24 * 60 * 60 * 1000) //Converts days to milliseconds.

        //set cookie

        document.cookie = 'username =${username}; expires=${date.toUTCString()}; path=/';
    }

    catch(error){console.log("Cookie setting failed: ", error );}
}
