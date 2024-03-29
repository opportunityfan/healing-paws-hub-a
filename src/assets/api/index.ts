import router from "@/router";
import store from "@/store"
import axios from "@/assets/axios";

export class Image {
    src: string
    width: number
    height: number
    constructor(src: string, width: number, height: number) {
        this.src = src
        this.width = width
        this.height = height
    }
}

export class Post {
    id: number
    title: string
    backgroundImage: Image
    description: string
    constructor(id: number, title: string, description: string , backgroundImage: Image) {
        this.id = id
        this.title = title
        this.description = description
        this.backgroundImage = backgroundImage
    }
}

export const changeTheme = (theme : string) => {
    window.document.documentElement.setAttribute("data-theme", theme);
}

export const goto = async (path : string) => {
    await router.push(path);
}

export const signIn = (data:any) => {

    // store.state.sidebar_unlock = true
    // axios.post('/sysUser/login',data,{
    //      headers:{
    //          'Content-Type' : 'application/json'
    //      }
    //  }).then((res)=>{
    //      if(res.data.code==200){
    //          store.state.online = true
    //         goto('/main').then()
    //      }
    //  }).catch(err=>{
    //      console.log("network Error！")
    // })
    store.state.online = true
    goto('/main').then()
}
export const signUp = (data : any)=>{
    store.state.email_for_registry = data.email
    axios.post('/email/register',data,{
        headers:{
            'Content-Type' : 'application/json'
        }
    }).then((res)=>{
        console.log(res)
    })

    goto('/check-email').then();
}
export const signOut = () => {
    store.state.online = false
    goto('/login').then()
}

export const getRecommendedAffairs = () =>{
    console.log("s")
}
