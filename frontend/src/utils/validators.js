export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export function validatePassword(password) {
  return password && password.length >= 6
}

export function validateRequired(value) {
  return value !== undefined && value !== null && String(value).trim().length > 0
}
