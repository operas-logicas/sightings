import jwt from 'jsonwebtoken'
import http from './HttpService'
import store from '../store'

const _decodeToken = function(): string | jwt.JwtPayload | null {
  const token = getToken()
  if (!token) return null

  return jwt.decode(token)
}

const getToken = function(): string | null {
  return localStorage.getItem('token')
}

const getUser = function(): string | jwt.JwtPayload | null {
  return _decodeToken()
}

const isLoggedIn = function(): boolean {
  return localStorage.getItem('token') !== null
}

const login = async function(user: {
  handle: string;
  password: string;
}): Promise<void> {
  const token = (await http().post('/auth', user)).data.token
  localStorage.setItem('token', token)
  store.dispatch('authenticate')
}

const logout = async function(): Promise<void> {
  localStorage.clear()
  store.dispatch('authenticate')
}

export default {
  getToken,
  getUser,
  isLoggedIn,
  login,
  logout  
}
