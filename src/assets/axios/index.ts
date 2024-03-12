import axios from 'axios'

const API = axios.create({
    baseURL: 'http://150.158.110.63:8080',
    timeout: 20000
})

export default API
