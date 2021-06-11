export function isLoggedIn(): boolean {
  return localStorage.getItem('isLoggedIn') === 'true'
}

export function logIn(): void {
  localStorage.setItem('isLoggedIn', 'true')
}

export function logOut(): void {
  localStorage.setItem('isLoggedIn', 'false')
}
