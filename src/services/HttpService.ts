import axios, { AxiosInstance } from 'axios'
import Auth from './AuthService'
import store from '../store'

export default function http(): AxiosInstance {
  return axios.create({
    baseURL: store.state.apiUrl,
    headers: { Authorization: Auth.getToken() }
  })
}
