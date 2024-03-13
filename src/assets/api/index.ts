import router from "@/router";
import store from "@/store"
import axios from "@/assets/axios";

export const changeTheme = (theme : string) => {
    window.document.documentElement.setAttribute("data-theme", theme);
}

export const goto = async (path : string) => {
    await router.push(path);
}

export const signIn = (data:any) => {

    store.state.sidebar_unlock = true
    // axios.post('/sysUser/login',data,{
    //     headers:{
    //         'Content-Type' : 'application/json'
    //     }
    // }).then((res)=>{
    //     if(res.data.code==200){
    //         store.state.sidebar_unlock = true
    //         goto('/main').then()
    //     }
    // })
    goto('/main').then()
}
export const signUp = (email : string, password : string, nickName : string)=>{
    axios.post('/email/register',{
        email : email,
        password : password,
    },{
        headers:{
            'Content-Type' : 'application/json'
        }
    }).then((res)=>{
        console.log(res)
    })

    goto('/check-email').then();
}
export const signOut = () => {
    store.state.sidebar_unlock = false
    goto('/login').then()
}
