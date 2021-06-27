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
  const payload = _decodeToken()
  if (!payload) return false

  const exp = (payload as jwt.JwtPayload).exp
  if (!exp || Date.now() > exp * 1000) return false

  return true
}

const login = async function(user: {
  handle: string;
  password: string;
}): Promise<void> {
  const token = (await http().post('/auth', user)).data.token
  localStorage.setItem('token', token)
  store.dispatch('authenticate')
}

const logout = function(): void {
  localStorage.clear()
}

export default {
  getToken,
  getUser,
  isLoggedIn,
  login,
  logout  
}
