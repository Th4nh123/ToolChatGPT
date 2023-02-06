
import axios from 'axios';
import $ from 'jquery'
import Swal from 'sweetalert2';

export const URL_HTTP = window.location.origin + '/'
const TOKENHEADER_VALUE = getCookie('Authorization')
export const URL_API_GET = 'http://localhost:800/ToolCloneChatGPT/rd/xml/a/';
export const URL_GET_API = 'http://localhost:800/ToolCloneChatGPT/api/rd/xml/a/'

// export const URL_API_GET = 'http://localhost:800/WebClone_v2/rd/xml/a/';
// export const URL_GET_API = 'http://localhost:800/WebClone_v2/api/rd/xml/a/'

export const URL_API_WEB = 'http://localhost:800/ToolCloneChatGPT';

// export const URL_API_WEB = 'http://localhost:800/WebClone_v2/';

const URL_API_EDIT = URL_API_GET

// export const KEY_API_SEARCH = 'AIzaSyDM6h0xL0RS58CwvkNgEYzBtLzPgZ6lOeo'
// export const KEY_API_SEARCH = 'AIzaSyDxfeIqMV-twZkZIAn9sE1pmSYD9xSmJvM'
export const KEY_API_SEARCH = 'AIzaSyAgFsQKOcyb9s3MOvEWPf0005zXFgjXqKc'

export const LINK_SEARCH = 'https://www.googleapis.com/customsearch/v1?'

// export const KEY_API_SEARCH = 'AIzaSyAtvWiWUms7XR_NkzhFXFkLa4BM-5jUTdE'
// export const LINK_SEARCH = 'https://www.googleapis.com/customsearch/v1/siterestrict?'

export const KEY_API_SEARCH_YOUTUBE = 'f202241f8amsh2ec5fe7dc999166p15413fjsn5cf4a7250dc4'
export const CX_SEARCH = '622357283d8f7426e';


export const KEY_API_TRANS = 'AIzaSyAtvWiWUms7XR_NkzhFXFkLa4BM-5jUTdE'
// export const KEY_API_TRANS = 'c0eb40b476msh231059c886fccc4p171a55jsn86d44ff993aa'

export const postVideo = async (key_search, ky_hieu, id_key, so_luong, check_key_api, timeOut, stt) => {
  let dataPost = [];
  const danhSachKey = [
    "000d778253msh1032f7b92350972p179ef1jsn580dfa8a6176", //hieu3
    "48e32b71d0mshb25d9f17e2ee8e4p13a850jsn9af0b3da46f0", //hieu2
    "7389971b0emsh075c0b06f78530fp144e3ejsn772dca10fcf5", //hieu1
    "5f4cdb1957mshc511167d3e8e1e4p1f1912jsn4a2718fe2b76", //TA3
    "811a2bba72msh6929fa69ef341c6p183549jsn5e181b4a1dd8",
    "91ceeecfdemsh84fc89f27d169c4p1eebacjsnb5ab5ce7f58e",//Nam
    "665c3090e2msh7dbd269ebf55be3p1bb3fcjsn54557412fc5d", //TA2
    "9e82e9fbd1msh008a230ff29fce4p1f1c03jsnd2c6ff99e6fa", //Tuan
    "1b2de6d033mshabb3bc979d40fb7p138a39jsn11e0d0a1049c", //Dang
    "7504e72607msh54d7dbf75058917p1e8c52jsn975f3e0f3ff6", //Hieu Huce
    "754d6fcd18msha243aa0cec081dcp16902ejsnc92beea6e9b6", //Nam
    "a3049839d7mshfce42c0f9119b67p17694bjsn2a5428987f1c", //Dat
    "a9a62742f5mshba0c73cd4da3741p1f7ef5jsn602698d6fee1", //L
    "aadccdc40bmsh3a9f5f87c567e88p159880jsnf8304fce34dc", //TA1
    "580c3d2ee1msh2b1f9c22a476e60p1b32dcjsn15c0598d3625", //TA4
    "a6a81a4b80mshc3b3b3d54401c53p126001jsne35a72a3db1d", //TA5
    "f202241f8amsh2ec5fe7dc999166p15413fjsn5cf4a7250dc4",
    "14c198d128mshed863037bee2bf9p19bbbbjsn1523d70dfc7d",
    "c0eb40b476msh231059c886fccc4p171a55jsn86d44ff993aa",
    "3fe7b45bb8msh6efbfa124cfc1d7p17c18djsnc4b0fb246e0e", //Trung Hieu
    "b5ef4e24e2msh2e14c806a348eccp1a5565jsn0114897fe006" //Nhan
  ];
  await search_youtube(danhSachKey[check_key_api], key_search, so_luong)
    .then(rs => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(rs);
        }, timeOut)
      })
    })
    .then(async rs => {
      if (rs.length > 0) { // do rs chắc chắn ra 1 mảng (có thể là rỗng)
        await rs.map(async item => {
          await dataPost.push({
            url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
            url_title: item.snippet?.title ? item.snippet.title : '',
            url_description: item.snippet?.description ? item.snippet.description : '',
            ky_hieu: ky_hieu,
            id_key: id_key,
            stt: stt
          })
        })

        await ajaxCallPost('save-video', dataPost).then(rs => console.log(rs))
          .catch(err => console.log(err))
      } else {
        if (check_key_api < danhSachKey.length) {
          check_key_api++;
          postVideo(key_search, ky_hieu, id_key, so_luong, check_key_api, timeOut, stt)
        }
      }
      console.log(check_key_api)
    }).catch(err => console.log(err))
}


const search_youtube = async (key_api, key_search, so_luong) => {
  let result = [];
  const options = {
    method: 'GET',
    url: 'https://youtube-v31.p.rapidapi.com/search',
    params: {
      q: key_search,
      part: 'snippet,id',
      maxResults: so_luong,
      order: 'viewCount'
    },
    headers: {
      'X-RapidAPI-Key': key_api,
      'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com'
    }
  };

  await axios.request(options).then(async function (response) {
    if (response.data) {
      result = [...response.data.items]
    } else {
      result = []
    }
  }).catch(function (error) {
    console.error(error);
  });
  return result;
}

// export async function getImageByGoogle(start, count, key_search, timeOut) {
//   // &imgSize=xxlarge&imgType=photo
//   let result = null;
//   await fetch(`${LINK_SEARCH}key=${KEY_API_SEARCH}&cx=${CX_SEARCH}&start=${start}&num=${count}&q=${key_search}&searchType=image`).then(response => response.json())
//     .then(rs => {
//       return new Promise((resolve) => {
//         setTimeout(() => {
//           resolve(rs);
//         }, timeOut - 500)
//       })
//     })
//     .then(rs => {
//       result = rs;
//     }).catch(err => console.log(err))
//   return result;
// }

// export async function ajaxCallGetUrl(start, count, key_search, timeOut) {
//   let result = null;
//   await fetch(`${LINK_SEARCH}key=${KEY_API_SEARCH}&cx=${CX_SEARCH}&start=${start}&num=${count}&q=${key_search}`).then(response => response.json())
//     .then(rs => {
//       return new Promise((resolve) => {
//         setTimeout(() => {
//           resolve(rs);
//         }, timeOut - 500)
//       })
//     })
//     .then(rs => {
//       result = rs;
//     }).catch(err => console.log(err))
//   return result;
// }


export const getHostname = (url) => {
  let host_name = new URL(url).hostname;
  let arr = host_name.split('.')
  let result = arr[0];
  for (let i = 0; i < arr.length; i++) {
    if (result.length < arr[i].length) {
      result = arr[i];
    }
  }
  return result;
  // if (host_name.includes('www.')) {
  //   return host_name.replace('www.', '');
  // } else {
  //   return host_name;
  // }
}

export const getHostname2 = (url) => {
  let arr = url.split('.')
  let result = arr[0];
  for (let i = 0; i < arr.length; i++) {
    if (result.length < arr[i].length) {
      result = arr[i];
    }
  }
  return result;
}

export async function sweetAlert2(title) {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  })
  let rs = await swalWithBootstrapButtons.fire({
    title: title,
    text: "Bạn có muốn nhập file vào chiến dịch này!",
    icon: 'infor',
    showCancelButton: true,
    confirmButtonText: 'Tiếp tục!',
    cancelButtonText: 'Hủy bỏ!',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      return true;
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      return false;
    }
  })
  return rs
}


$(function () { })
export function downloadFile(file) {
  const element = document.createElement('a')
  element.setAttribute('href', file)
  element.setAttribute('download', 'jdjdj')
  element.setAttribute('target', '_blank')
  // element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}
export function isNumber(n) {
  /**
   * Kiểm tra string chuyền vào có phải là số hay không
   *
   * @param n : string
   * @author XHieu
   */
  return /^-?\d+$/.test(n)
}
export function getRGBColor(ev) {
  /**
   * Lấy ra mã màu dạng rgb
   * @param ev : giá trị màu từ input type color
   * @author XHieu
   */
  const color = ev
  const r = parseInt(color.substr(1, 2), 16)
  const g = parseInt(color.substr(3, 2), 16)
  const b = parseInt(color.substr(5, 2), 16)
  return [r, g, b, 255]
}
export function rgbToHex(arr) {
  return (
    '#' +
    ((1 << 24) + (arr[0] << 16) + (arr[1] << 8) + arr[2]).toString(16).slice(1)
  )
}

export const alertConfirm = title => {
  // alertConfirm
  return window.confirm(title)
}

export const getCountString = (str, A = '') => {
  /**
   * lấy ra số ở cuối của string
   * input: hieu1234 -> output: 1234
   * @param str : string
   * @author XHieu
   */
  if (isNumber(str.slice(str.length - 1, str.length))) {
    A += str.slice(str.length - 1, str.length)
    return getCountString(str.slice(0, str.length - 1), A)
  }
  return A
}
export function debounce(func, delay) {
  /**
   * debounce trong js, lên gg xem tài liệu nhé
   * Mục đích hạn chế xử lý sự thay đổi của input
   * @param func : function
   * @param delay : thời gian chờ trước khi xử lý
   * @author XHieu
   */
  let timeout
  return function executedFunc(...args) {
    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      func(...args)
      timeout = null
    }, delay)
  }
}
export function throttle(callback, limit) {
  /**
   * tương tự debounce trong js, lên gg xem tài liệu nhé
   * Mục đích hạn chế số lượng sử lý thay đổi của input trong 1 khoảng time
   * @param callback : funcition
   * @param limit : số lần sử lý
   * @author XHieu
   */
  var waiting = false // Initially, we're not waiting
  return function () {
    // We return a throttled function
    if (!waiting) {
      // If we're not waiting
      callback.apply(this, arguments) // Execute users function
      waiting = true // Prevent future invocations
      setTimeout(function () {
        // After a period of time
        waiting = false // And allow future invocations
      }, limit)
    }
  }
}
export function create_UUID() {
  /**
   * Create UUID thôi
   *
   * @param no
   * @author XHieu
   */
  var temp_url = URL.createObjectURL(new Blob())
  var uuid = temp_url.toString()
  URL.revokeObjectURL(temp_url)
  return uuid.substr(uuid.lastIndexOf('/') + 1)
}
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

//copy to clipboard
export function copyToClipboard(id) {
  console.log(id)
  let copyText = document.getElementById(id)
  console.log(copyText)
  copyText.select()
  copyText.setSelectionRange(0, 99999)
  navigator.clipboard
    .writeText(copyText.value)
    .then(() => {
      alertSuccess('Đã coppy vào clipboard')
    })
    .catch(error => {
      alert(`Copy failed!`)
    })
}

/*Đăng xuất ra khỏi tk*/
export function logOut() {
  document.cookie = `Authorization=${TOKENHEADER_VALUE};max-age=` + 0
  localStorage.removeItem('user')
  sessionStorage.removeItem('token')
  localStorage.clear()
  sessionStorage.clear()
  window.location.href = 'login'
}

/*notify để custom alert */
//alert notify
//***************alter
export function alertSuccess(text, time = 1000) {
  $.notify(
    {
      icon: 'far fa-check-circle',
      message: text
    },
    {
      delay: time,
      offset: { x: 15, y: 15 },
      type: 'success',
      animate: {
        enter: 'animated fadeInDown',
        exit: 'animated fadeOutUp'
      },
      z_index: 1031000000000
    }
  )
}

export function alertInfo(text, time = 1000) {
  $.notify(
    {
      icon: 'fas fa-info-circle',
      message: text
    },
    {
      delay: time,
      offset: { x: 15, y: 15 },
      type: 'info',
      animate: {
        enter: 'animated fadeInDown',
        exit: 'animated fadeOutUp'
      },
      z_index: 1031000000000
    }
  )
}

export function alertWarning(text, time = 1000) {
  $.notify(
    {
      icon: 'fas fa-exclamation',
      message: text
    },
    {
      delay: time,
      offset: { x: 55, y: 15 },
      type: 'warning',
      animate: {
        enter: 'animated fadeInDown',
        exit: 'animated fadeOutUp'
      },
      z_index: 1031
    }
  )
}

export function alertDanger(text, time = 1000) {
  $.notify(
    {
      icon: 'fas fa-exclamation-triangle',
      message: text
    },
    {
      timer: 1000,
      delay: time,
      offset: { x: 15, y: 15 },
      type: 'danger',
      animate: {
        enter: 'animated fadeInDown',
        exit: 'animated fadeOutUp'
      },
      z_index: 1031000000000
    }
  )
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

/*put data*/
export async function ajaxCallPut(url, dataUser) {
  let rs = null
  if (url.includes('?')) url = url.concat('&token=' + TOKENHEADER_VALUE)
  else url = url.concat('?token=' + TOKENHEADER_VALUE)
  await $.ajax({
    type: 'PUT',
    data: JSON.stringify(dataUser),
    url: URL_API_EDIT + url,
    timeout: 30000,
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
