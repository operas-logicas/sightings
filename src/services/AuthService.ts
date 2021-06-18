// TODO authentication using JWT

class AuthService {
  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true'
  }
  
  logIn(): void {
    localStorage.setItem('isLoggedIn', 'true')
  }
  
  logOut(): void {
    localStorage.setItem('isLoggedIn', 'false')
  }
}

export default new AuthService()
