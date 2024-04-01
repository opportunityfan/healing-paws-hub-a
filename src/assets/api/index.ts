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
    name: string
    content: string
    contentImg: string
    contentVideo: string
    constructor(id: string, name: string, content: string, contentImg: string, contentVideo: string) {
        this.id = id
        this.name = name
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
export const testaxios = ()=>{
    axios.post('testPreAuthorize/hello', {},{
        headers:{
            'token' : store.state.token
        }
    }).then((res)=>{
        console.log(res)
    })
}
export const signIn = (data:any) => {

    // store.state.sidebar_unlock = true
    axios.post('/sysUser/login',data,{
         headers:{
             'Content-Type' : 'application/json'
         }
     }).then((res)=>{
         if(res.data.code==200){

             store.state.token = res.data.data.token
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
export const goEdit = () => {
    goto('/edit').then()
}
export const getRecommendedAffairs = () =>{
    console.log("s")
}

export const goAffairSearchView = () =>{
    goto('/affairSearch').then()
}
export const gotoWithProp = async (name : string,prop : string) => {
    await router.push({name: name,params: {affairId : prop}});
}
export const goAffair = (affairId : string)=>{
    console.log(affairId)
    gotoWithProp('affairPage',affairId).then()
}
export const goAffairNode = async (nodeId: string) =>{
    console.log(nodeId,'nodeid')
    await router.push({name: 'affairNodePage',params: {nodeId : nodeId}});

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
