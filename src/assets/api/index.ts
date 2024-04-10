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
    id: string
    title: string
    backgroundImage: Image
    description: string
    constructor(id: string, title: string, description: string , backgroundImage: Image) {
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

export class instrument {
    id: string
    name: string
    introduction: string
    usage: string
    price: number
    departmentId: string
    type: string
    constructor(id : string, name : string, introduction: string, usage: string, price : number, departmentId: string, type: string) {
        this.id = id
        this.name = name
        this.introduction = introduction
        this.usage = usage
        this.price = price
        this.departmentId = departmentId
        this.type = type
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
    axios.post('/sysUser/login',data,{
         headers:{
             'Content-Type' : 'application/json'
         }
     }).then((res)=>{
         if(res.data.code==200){

             store.state.token = res.data.data.token
             getUserInfo().then(res => {
                 store.state.online = true
             })
             goto('/main').then()
             if(res.data.msg.substring(0,3) === 'NEW'){
                 goto('/RoleSelectView').then()
             }
         }
     }).catch(err=>{
         console.log("network Error！")
    })
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
export const getUserInfo = async () => {
    let userInfo: any
    await axios.get('/sysUser',{
        headers:{
            'token' : store.state.token
        }
    }).then((res)=>{
        userInfo = res.data.data
        store.state.nick_name = userInfo.username
        store.state.avatar_url = userInfo.avatar
        store.state.email = userInfo.account
    })
    return userInfo
}
export const signOut = () => {
    store.state.online = false
    goto('/login').then()
    axios.post('/sysUser/logout',{},{
        headers:{
            'token' : store.state.token
        }
    }).then((res)=>{
        console.log(res.data)
    })
}

export const getAffairNode = async (id : string) : Promise<affairNode | undefined> => {
    let obj : affairNode | undefined = undefined
    await axios.get('/affairnode', {
        params: {
            id: id
        },
        headers:{
            'token' : store.state.token
        }
    }).then((res) => {
        if (res.data.code === 200) {
            obj = res.data.data
        }
    })
    return obj
}

export const getInstrument = async (id : string) : Promise<instrument | undefined> => {
    return undefined
}

export const setAffairNode = async (node : affairNode) => {
    const formData = new FormData()
    formData.append('id', node.id)
    formData.append('name', node.name)
    formData.append('content', node.content)
    await axios.put('/affairnode', formData, {
        headers: {
            token: store.state.token
        }
    }).then((res) => {
        console.log(res)
        if (res.data.code === 200) {
            console.log('update affair node success')
        }
    })
}


//跳转到界面可以不单独写成函数
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

export const gotoArchiveSearchResultsWithNames = async (name : string, diseaseNames : string) => {
    await router.push({name: name, params: {diseaseNames : diseaseNames}})
}

export const gotoArchiveDetailPageWithId = async (name : string, archiveId : string) => {
    await router.push({name: name, params: {archiveId : archiveId}})
}

export const goAffair = (affairId : string)=>{
    console.log(affairId)
    gotoWithProp('affairPage',affairId).then()
}

export const goAffairNode = async (nodeId: string) =>{
    console.log(nodeId,'nodeid')
    await router.push({name: 'affairNodePage',params: {nodeId : nodeId}});

}
export const goItem = async (itemId: string) => {
    console.log(itemId)
    await router.push({name:'instrumentPage',params:{itemId : itemId}})
}
export const goInstrumentSearchView = () =>{
    goto('/instrumentSearch').then()
}
export const goRoleSelect = () => {
    goto('/roleSelect').then()
}


export const autoComplete = async (searchUrl : string,word : string) :Promise<tag[]> => {
    const names = Array<tag>()
    await axios.get(searchUrl,{
        params:{
            input : word
        },
        headers:{
            'token' : store.state.token
        }
    }).then((res)=>{
        const affairs = res.data.data
        console.log(affairs)
        if(affairs)
        affairs.forEach((e:any) => {
            const tempTag = new tag(e.id,e.name)
            names.push(tempTag)
        })
    })
    console.log(names)
    return names
}
export const autoCompleteItem = async (word : string) :Promise<tag[]> =>{
    const names = Array<tag>()
    await axios.get('/item/search',{
        params:{
            pageNum : 1,
            pageSize : 10,
            name : word
        },
        headers:{
            'token' : store.state.token
        }
    }).then((res)=>{
        const affairs = res.data
        console.log(res.data)

        if(affairs)
            affairs.forEach((e:any) => {
                const tempTag = new tag(e.id,e.name)
                names.push(tempTag)
            })
        console.log(affairs)
    })
    console.log(names)
    return names
}
export class tag{
    id: string;
    name: string;
    constructor(id : string,name : string) {
        this.id = id
        this.name = name
    }
}
export const getAffairNodes = async (affairId : string)=>{
    const affairNodes = Array<affairNode>()
    await axios.get('/affair/subs',{
        params:{
            affairId: affairId
        },
        headers:{
            'token':store.state.token
        }
    }).then((res) =>{
        console.log(res.data)
        res.data.data.forEach((node: any) => {
            affairNodes.push(new affairNode(node.id,node.name,node.content,node.contentImg,node.contentVideo))
        })
    })
    return affairNodes
}
