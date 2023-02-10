
import axios from 'axios';
import $ from 'jquery'
import Swal from 'sweetalert2';

export const URL_HTTP = window.location.origin + '/'
const TOKENHEADER_VALUE = getCookie('Authorization')
export const URL_API_GET = 'http://localhost:800/ToolCloneChatGPT/rd/xml/a/';
export const URL_GET_API = 'http://localhost:800/ToolCloneChatGPT/api/rd/xml/a/'

export const URL_API_WEB = 'http://localhost:800/ToolCloneChatGPT';

// export const URL_API_WEB = 'http://localhost:800/WebClone_v2/';

const URL_API_EDIT = URL_API_GET

export function nonAccentVietnamese(str) {
  /**
   * Chuyển ký tự tiếng việt sang tiếng Anh
   *
   * @param str: string
   * @author XHieu
   */
  str = str.toLowerCase()
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
  str = str.replace(/đ/g, 'd')
  // Some system encode vietnamese combining accent as individual utf-8 characters
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '') // Huyền sắc hỏi ngã nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, '') // Â, Ê, Ă, Ơ, Ư
  return str
}

// get cookie
export function getCookie(name) {
  try {
    let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    if (match) {
      return match[2]
    } else {
      return ''
    }
  } catch (e) {
    return ''
  }
}

/*get data*/
export async function ajaxCallGet(url) {
  let rs = null
  if (url.includes('?')) url = url.concat('&token=' + TOKENHEADER_VALUE)
  else url = url.concat('?token=' + TOKENHEADER_VALUE)
  await $.ajax({
    type: 'GET',
    dataType: 'json',
    url: URL_API_GET + url,
    timeout: 300000,
    success: function (result) {
      rs = result
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(errorThrown)
    }
  })
  return rs
}

/*upload file, image....*/
export async function ajaxCallUploadFile(url, file) {
  let data
  if (url.includes('?')) url = url.concat('&token=' + TOKENHEADER_VALUE)
  else url = url.concat('?token=' + TOKENHEADER_VALUE)
  await $.ajax({
    type: 'POST',
    url: 'https://spec.edu.vn/qlbh/api/v1/private-edit/' + url,
    data: file,
    cache: false,
    contentType: false,
    enctype: 'multipart/form-data',
    processData: false,
    success: function (result) {
      data = result.data
    },
    error: function (err) {
      console.log(err)
    }
  })
  return data
}

/*post data*/
export async function ajaxCallPost(url, dataUser) {
  let rs = null
  await $.ajax({
    type: 'POST',
    data: JSON.stringify(dataUser),
    url: URL_API_EDIT + url,
    timeout: 300000,
    contentType: 'application/json',
    success: function (result) {
      rs = result
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(errorThrown)
    }
  })
  return rs
}

/*set key-val để lưu vào local storage*/
export function setItemLocalStorage(key, val) {
  localStorage.setItem(key, JSON.stringify(val))
} /*get key-val để lưu vào local storage*/
export function getItemLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key))
}

/*set key-val để lưu vào local storage*/
export function setItemSessionStorage(key, val) {
  sessionStorage.setItem(key, JSON.stringify(val))
} /*get key-val để lưu vào local storage*/
export function getItemSessionStorage(key) {
  return JSON.parse(sessionStorage.getItem(key))
}

//format input type number
export function formatNumber(nStr, decSeperate, groupSeperate) {
  try {
    nStr += ''
    let x = nStr.split(decSeperate)
    let x1 = x[0]
    let x2 = x.length > 1 ? '.' + x[1] : ''
    var rgx = /(\d+)(\d{3})/
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + groupSeperate + '$2')
    }
    return x1 + x2
  } catch (e) {
    console.log(e)
    return nStr
  }
}

// trả ngày của tháng và năm
export function daysInMonth(year, month) {
  return new Date(year, month, 0).getDate()
}

//format input type number
export function formatFees(nStr, decSeperate, groupSeperate) {
  try {
    nStr += ''
    let arr = nStr.split(decSeperate)
    if (arr.length > 0) {
      // nếu phần chuỗi sau dính dấu "," nó sẽ cắt bỏ đi rồi mới gán
      arr = arr.toString().replaceAll(',', '')
      nStr = arr
    }
    nStr += ''
    let x = nStr.split(decSeperate)
    let x1 = x[0]
    let x2 = x.length > 1 ? ',' + x[1] : ''
    var rgx = /(\d+)(\d{3})/
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + groupSeperate + '$2')
    }
    return x1 + x2
  } catch (e) {
    console.log(e)
    return nStr
  }
}
