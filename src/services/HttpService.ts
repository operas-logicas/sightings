import axios, { AxiosInstance } from 'axios'
// import Auth from './auth'
import store from '../store'

export default function http(): AxiosInstance {
  return axios.create({
    baseURL: store.state.apiUrl
    // TODO set Authorization header to JWT
    // headers: { Authorization: Auth.getToken() }
  })
}
