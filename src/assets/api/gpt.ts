import axios from "axios";
const API = axios.create({
    baseURL: 'http://150.158.110.63:5000',
    timeout: 20000
})

export const startGptTalk = async () => {
    let conversation_id = ''
    await API.post('/create_conversation').then(res=>{
        console.log('开始Gpt对话',res.data)
        conversation_id = res.data.data.conversation_id
        console.log(conversation_id)
    })
    return conversation_id
}

export const sendToGpt = async (conversation_id : string,msg : string) => {
    const jsonData = {conversation_id : conversation_id,msg : msg}
    let answer = ''
    await API.post('/blocking_conversation',jsonData).then(res=>{
        console.log('发送信息',res.data)
        conversation_id = res.data.data.conversation_id
        answer = res.data.data
        console.log(answer)
    })
    return answer
}