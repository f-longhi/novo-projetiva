const LOCAL_STORAGE_PREFIX = 'ProjetivaHP2'

function getOption(option, defaultValue = null) {
  const value = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}/${option}`)
  if (value === null)
    return defaultValue
  return JSON.parse(value)
}

function setOption(option, value) {
  localStorage.setItem(`${LOCAL_STORAGE_PREFIX}/${option}`, JSON.stringify(value))
}

export default {
  getOption,
  setOption
}