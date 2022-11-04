const APIURL = import.meta.env.VITE_API_PATH;
export async function masterFetch(type, endpoint, body){
    let ans;
    if(type.toLowerCase() == "get"){
        ans = (await fetch(APIURL + endpoint)).json();
    } else if(type.toLowerCase() == "post") {
        ans = (await fetch(APIURL + endpoint,
            {
                method:'POST',
                headers:{
                    'content-type':'application/json',
                    'accepts':'application/json'
                },
                body:JSON.stringify(body)
            })).json();
    }
    return ans;
}