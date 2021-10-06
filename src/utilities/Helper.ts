export const getInt = (num:number|string|undefined) => {
  if (typeof num === 'string') {
    return parseInt(num, 10)
  } else if (typeof num === 'undefined') {
    return 0
  } else {
    return num
  }
}

export const getFloat = (num:number|string|undefined) => {
  if (typeof num === 'string') {
    return parseFloat(num)
  } else if (typeof num === 'undefined') {
    return 0
  } else {
    return num
  }
}
