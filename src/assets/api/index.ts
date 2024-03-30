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

export class affair{
    id: string
    description: string
    role: string
    affairNodes: Array<string>

    constructor(id: string, description: string, role: string, affairNodes: Array<string>) {
        this.id = id
        this.description = description
        this.role = role
        this.affairNodes = affairNodes
    }
}

export class affairNode{
    id: string
    content: string
    contentImg: string
    contentVideo: string
    constructor(id: string, content: string, contentImg: string, contentVideo: string) {
        this.id = id
        this.content = content
        this.contentImg = contentImg
        this.contentVideo = contentVideo
    }
}

export const changeTheme = (theme : string) => {
    window.document.documentElement.setAttribute("data-theme", theme);
}

export const goto = async (path : string) => {
    await router.push(path);
}
export const goBack = async () =>{
    await router.back()

}

export const signIn = (data:any) => {

    // store.state.sidebar_unlock = true
    axios.post('/sysUser/login',data,{
         headers:{
             'Content-Type' : 'application/json'
         }
     }).then((res)=>{
         if(res.data.code==200){
             store.state.online = true
            goto('/main').then()
         }
     }).catch(err=>{
         console.log("network Error！")
    })
    // goto('/main').then()
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

export const goAffairSearchView = () =>{
    goto('/affairSearch').then()
}
export const goAffair = ()=>{
    goto('/affair')
}
export const goInstrumentSearchView = () =>{
    goto('/instrumentSearch').then()
}

export const autoComplete = ()=>{
    console.log("自动补全")
}
export class tag{
    name: string;
    constructor(name:string) {
        this.name = name
    }
}
