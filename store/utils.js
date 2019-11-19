import Cookies from 'js-cookie'
// import cookieparser from 'cookieparser'

const persist = (key, data) => {
  if (typeof (data) === 'string' || typeof (data) === 'number') {
    Cookies.set(key, data)
  } else if (typeof data === 'object') {
    Cookies.set(key, JSON.stringify(data))
  } else {
    Cookies.set(key, JSON.stringify(data))
  }
}

const desist = (key) => {
  Cookies.remove(key)
}

export {
  desist,
  persist
}
