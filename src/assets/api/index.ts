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
    isfavor : boolean
    constructor(id: string, title: string, description: string , backgroundImage: Image, isfavor : boolean) {
        this.id = id
        this.title = title
        this.description = description
        this.backgroundImage = backgroundImage
        this.isfavor = isfavor
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
    positionX: number
    positionY: number
    constructor(id: string, name: string, content: string, contentImg: string, contentVideo: string,positionX:number,positionY:number) {
        this.id = id
        this.name = name
        this.content = content
        this.contentImg = contentImg
        this.contentVideo = contentVideo
        this.positionX = positionX
        this.positionY = positionY
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
    image: Image
    constructor(id : string, name : string, introduction: string, usage: string, price : number, departmentId: string, type: string) {
        this.id = id
        this.name = name
        this.introduction = introduction
        this.usage = usage
        this.price = price
        this.departmentId = departmentId
        this.type = type
        this.image = new Image('', 1, 1)
    }
}
export const isFavor = async (id : string, objType : string) => {
    let ans = false
    await axios.get('/favorite/favored',{
        headers:{
            token:store.state.token
        },
        params:{
            objectType : objType,
            objectId : id
        }
    }).then(res=>{
        console.log('返回是否收藏',res.data)
        if(res.data.code==200){
            if(res.data.data==true) {
                ans = true
            }
            else {
                ans = false
            }
        }
    }).catch(e=>{
        console.log('返回收藏报错：',e)
    })
    return ans
}
export const markFavor = async (id : string, type : string) => {
    const jsonData = {objectType : type, objectId : id}
    axios.post('/favorite',jsonData,{
        headers:{
            token: store.state.token
        }
    }).then(res=>{
        console.log('检查标记收藏',res.data)
        if(res.data.code==200){
            showMessage('成功完成学习！',"success")
        }
    }).catch(e=>{
        console.log('标记收藏报错：',e)
    })
}
export const unMarkFavor = async (id : string) => {
    axios.delete('/favorite',{
        headers:{
            token:store.state.token
        },
        params:{
            id : id
        }
    }).then(res=>{
        console.log('检查取消收藏',res.data)
        if(res.data.code == 200){
            showMessage('取消学习成功！','info')
        }
    })
}
export const changeTheme = (theme : string) => {
    window.document.documentElement.setAttribute("data-theme", theme);
}

export const goto = async (path : string) => {
    store.state.beforeBack().then((res) => {
        if (res) {
            store.state.beforeBack = async () => {
                return true
            }
            router.push(path);
        }
    })
}

export const goBack = async () =>{
    store.state.beforeBack().then((res) => {
        if (res) {
            store.state.beforeBack = async () => {
                return true
            }
            router.back();
        }
    })
}

export type beforeBackFunction = () => Promise<boolean>

export const onBeforeBack = (f : beforeBackFunction) => {
    store.state.beforeBack = f
}

export const testaxios = ()=>{
    axios.post('testPreAuthorize/hello', {},{
        headers:{
            'token' : store.state.token
        }
    }).then((res)=>{
        console.log(res)
    }).catch(()=>{
        showMessage('网络错误','error')
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
             store.state.role = res.data.data.permission
             getUserInfo().then(res => {
                 store.state.online = true
             })
             if(store.state.role === 'admin'){
                 store.state.isAdmin = true;
                 goto('/manageMain').then()
             }else{
                 goto('/main').then()
                 console.log('检查是否为新',res.data.msg)
                 console.log('检查substring',res.data.msg.substring(0,3))
                 if(res.data.msg.substring(0,3) === 'NEW'){
                     goRoleSelect()
                 }
             }
         } else {
             showMessage(`${res.data.data}`, 'error')
         }
     }).catch(() => {
         showMessage('网络错误','error')
    })
}
export const signUp = (data : any)=>{
    store.state.email_for_registry = data.email
    axios.post('/email/register',data,{
        headers:{
            'Content-Type' : 'application/json'
        }
    }).then((res)=>{

        if(res.data.code==200){
            console.log(res.data)
        }else{
            showMessage(`${res.data.msg}`,'error')
        }
    }).catch(()=>{
        showMessage('网络错误','error')
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
        if(res.data.code==200) {
            userInfo = res.data.data
            store.state.nick_name = userInfo.username
            store.state.avatar_url = userInfo.avatar
            store.state.email = userInfo.account
        }else{
            showMessage(`${res.data.msg}`,'error')
        }
    }).catch(()=>{
        showMessage('网络错误','error')
    })
    return userInfo
}
export const signOut = () => {
    store.state.online = false
    store.state.isAdmin = false
    goto('/login').then()
    axios.post('/sysUser/logout',{},{
        headers:{
            'token' : store.state.token
        }
    }).then((res)=>{
        console.log(res.data)

    }).catch(()=>{
        showMessage('网络错误','error')
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
        }else{
            showMessage(`${res.data.msg}`,'error')
        }
    }).catch(()=>{
        showMessage('网络错误','error')
    })
    return obj
}

export const getInstrument = async (id : string) : Promise<instrument | undefined> => {
    let obj : instrument | undefined = undefined
    await axios.get('/item/' + id, {
        headers:{
            'token' : store.state.token
        }
    }).then((res) => {
        console.log(res)
        if (res.data.code === 200) {
            obj = res.data.data
            if (obj)  {
                if (!res.data.data.picSize) {
                    res.data.data.picSize = [1, 1]
                }
                obj.image = new Image(res.data.data.pic, res.data.data.picSize[0], res.data.data.picSize[1])
            }
        }else{
            showMessage(`${res.data.msg}`,'error')
        }
    }).catch(()=>{
        showMessage('网络错误','error')
    })
    return obj
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
        if (res.data.code === 200) {

            showMessage('修改成功!','success')
        }else{
            showMessage(`${res.data.msg}`,'error')
        }
    }).catch(()=>{
        showMessage('网络错误','error')
    })
}

export const setInstrument = async (instrument : instrument, image? : File) => {
    console.log(instrument)
    const formData = new FormData()
    formData.append('item', new Blob([JSON.stringify(instrument)],{type: "application/json"}))
    if(image) formData.append('pic', image)
    await axios.put('/item', formData, {
        headers: {
            token: store.state.token
        }
    }).then((res) => {
        console.log(res)
        if (res.data.code === 200) {
            showMessage('保存成功！','success')
        }
    }).catch(()=>{
        showMessage('网络错误','error')
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
    console.log('跳转的事务id',affairId)
    if(affairId){
        gotoWithProp('affairPage',affairId).then()
    }else{
        showMessage('未找到此条目！','info')
    }
}

export const goAffairNode = async (nodeId: string) =>{
    await router.push({name: 'affairNodePage',params: {nodeId : nodeId}});
}
export const goAffairNodeManage = async (nodeId : string) => {
    await goto('/affair-node-edit/' + nodeId)
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

        console.log(res.data)
        if(res.data.code==200) {
            const affairs = res.data.data
            if (affairs)
                affairs.forEach((e: any) => {
                    const tempTag = new tag(e.id, e.name)
                    names.push(tempTag)
                })
        }
    }).catch(()=>{
        showMessage('网络错误','error')
    })
    console.log(names)
    return names
}
export const autoCompleteWXJ = async (searchUrl : string,word : string) :Promise<tag[]> =>{
    const names = Array<tag>()
    await axios.get(searchUrl,{
        params:{
            pageNum : 1,
            pageSize : 10,
            name : word
        },
        headers:{
            'token' : store.state.token
        }
    }).then((res)=>{


        if(res.data.code==200) {
            const items = res.data.data
            if (searchUrl === '/item/search') {
                if (items)
                    items.forEach((e: any) => {
                        const tempTag = new tag(e.id, e.name)
                        names.push(tempTag)
                    })
            } else if (searchUrl === '/department/search') {
                if (items)
                    items.forEach((e: any) => {
                        const tempTag = new tag(e.id, e.departmentName)
                        names.push(tempTag)
                    })
            }
        }

    }).catch(()=>{
        showMessage('网络错误','error')
    })

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
    const affairNodesAndEdges = {nodes : Array<affairNode>(),edges:Array<any>()}
    await axios.get('/affair/subs',{
        params:{
            affairId: affairId
        },
        headers:{
            'token':store.state.token
        }
    }).then((res) =>{
        console.log('检查获取到的affairNode的position',res.data)
        if(res.data.code==200) {
            res.data.data.nodes.forEach((node: any) => {
                affairNodesAndEdges.nodes.push(new affairNode(node.id, node.name, node.content, node.contentImg, node.contentVideo, node.positionX,node.positionY))
            })
            if(res.data.data.edges) {
                res.data.data.edges.forEach((edge: any) => {
                    affairNodesAndEdges.edges.push(edge)
                })
            }
        }else{
            showMessage(`${res.data.msg}`,"error")
        }
    }).catch(()=>{
        showMessage('网络错误','error')
    })
    return affairNodesAndEdges
}

export class DepartmentBrief {
    id : string;
    departmentName: string;
    pic: string;
    position: {
        x : number;
        y : number;
        z : number;
    }
    constructor(id: string, departmentName : string, pic : string, x : number, y : number, z : number) {
        this.id = id
        this.departmentName = departmentName
        this.pic = pic
        this.position = {
            x : x,
            y : y,
            z : z
        }
    }
}

export const getDepartmentBrief = async () => {
    let ret : DepartmentBrief[] = []
    await axios.post('/department/getAll',{},{
        headers:{
            'token':store.state.token
        }
    }).then((res) => {
        console.log(res)
        if(res.data.code==200) {
            ret = res.data.data
        } else{
            showMessage(`${res.data.msg}`,"error")
        }
    }).catch(()=>{
        showMessage('网络错误','error')
    })
    return ret
}

export const openTalkBar = () => {
    if(store.state.isTesting){
        showMessage('不可以在考试中拜访小帕瓦哦~','warning')
    }else{
        store.state.talkBarAppend = true
    }

}

export const closeTalkBar = () => {
    store.state.talkBarAppend = false
}

export class TalkHistory {
    content: string;
    selfSend: boolean;
    constructor(content : string, selfSend : boolean) {
        this.content = content
        this.selfSend = selfSend

    }
}

export class Message {
    id : number;
    content: string;
    type: 'error'|'info'|'success'|'warning';
    duration: number;
    constructor(id: number, content: string, type: 'error'|'info'|'success'|'warning', duration: number) {
        this.id = id
        this.content = content
        this.type = type
        this.duration = duration
    }
}

let messageId = 0

export const showMessage = (content: string, type: 'error'|'info'|'success'|'warning', duration = 2000) => {
    store.state.messageList.push(new Message(messageId++, content, type, duration))
}
