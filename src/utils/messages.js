const generateMes = (username, text) => {
  return {
    text,
    username,
    createdAt: new Date().getTime()
  }
}
const generateLocMes = (username, url) => {
  return {
    url,
    username,
    createdAt: new Date().getTime()
  }
}

module.exports = {
  generateLocMes,
  generateMes
}