/* Cookie Related Functions */

//Cookie Check, retrieve stored variable.
export function getCookies(variable)
{
    const cookies = document.cookie;

    if (!cookies){return null;}//Returns null if no cookies exist.

    //split retrieved cookie into individual cookies.
    
    const cookieArray = cookies.split('; ');

    for (let i of cookieArray){
        const [key, value] = i.split('=');
        
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
    try{
        const loggedInUser = getCookies('username');

        if (loggedInUser === null)
            {
                navigate('/Login');
            }
        }    
    
    catch(error){console.log("Error retrieving cookie variable: ", error);}
}

//Function for checking if a user is already logged in when clicking login page.
export function existingLoginCheck()
{
    try{
        const userLoggedIn = getCookies('username'); // The cookie name should match your app's configuration.

        if (userLoggedIn) {
            
            return true;
            // If the cookie does not exist, redirect to the login page
            /*
            alert('Already logged in');
            navigate("/events");
            */
        }

        else{return false;}
    }
    catch (error){console.log("Error checking for existing login: ", error);}
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

// Function to check login status and restrict access
function checkLoginStatus() {    
    try{
        const userLoggedIn = getCookie('user_logged_in'); // The cookie name should match your app's configuration.

        if (!userLoggedIn) {
            // If the cookie does not exist, redirect to the login page
            alert('You must be logged in to access this page.');
            window.location.href = 'KV6002-Team-Project/KV6002/frontend/public/Authentication/Login; // Replace with your login page URL'
        }
    }

    catch (error){console.log("Error checking current login status: ", error);}
}