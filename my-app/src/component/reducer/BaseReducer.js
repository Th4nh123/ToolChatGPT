const initialState = {
  data_key: [],
  data_url: [],
  data_black_list: [],
  data_spin_word: [],
  data_detail_post:{},
  current_id_key:null,
  data_cam: [],
  data_lang: [],
  current_id_cam: null,
  data_trang_thai_cam: null,
  check_key: [],
  data_url_all: [],
  key_google: '',
  data_key_google: [],
  data_key_youtube: [],
  data_ngon_ngu: [],
  data_key_have_video: [],
}
const BaseReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CHANGE_DATA_KEY': {
      return {
        ...state,
        data_key: action.data_key
      }
    }
    case 'CHANGE_DATA_URL': {
      return {
        ...state,
        data_url: action.data_url
      }
    }
    case 'CHANGE_DATA_BLACK_LIST': {
      return {
        ...state,
        data_black_list: action.data_black_list
      }
    }
    case 'CHANGE_DATA_SPIN_WORD': {
      return {
        ...state,
        data_spin_word: action.data_spin_word
      }
    }
    case 'CHANGE_DETAIL_POST': {
      return {
        ...state,
        data_detail_post: action.data_detail_post
      }
    }
    case 'CHANGE_CURRENT_ID_KEY': {
      return {
        ...state,
        current_id_key: action.current_id_key
      }
    }
    case 'CHANGE_DATA_CAM': {
      return {
        ...state,
        data_cam: action.data_cam
      }
    }

    case 'CHANGE_DATA_LANG': {
      return {
        ...state,
        data_lang: action.data_lang
      }
    }
    case 'CHANGE_CURRENT_ID_CAM': {
      return {
        ...state,
        current_id_cam: action.current_id_cam
      }
    }

    case 'CHANGE_TRANG_THAI_CAM': {
      return {
        ...state,
        data_trang_thai_cam: action.data_trang_thai_cam
      }
    }

    case 'CHANGE_CHECK_KEY': {
      return{
        ...state,
        check_key: action.check_key
      }
    }

    case 'CHANGE_DATA_URL_ALL': {
      return{
        ...state,
        data_url_all: action.data_url_all
      }
    }

    case 'CHANGE_KEY_GOOGLE': {
      return{
        ...state,
        key_google: action.key_google
      }
    }

    case 'CHANGE_NGON_NGU': {
      return {
        ...state,
        data_ngon_ngu: action.data_ngon_ngu
      }
    }

    case 'CHANGE_DATA_KEY_GOOGLE': {
      return{
        ...state,
        data_key_google: action.data_key_google
      }
    }

    case 'CHANGE_DATA_KEY_YOUTUBE': {
      return{
        ...state,
        data_key_youtube: action.data_key_youtube
      }
    }

    case 'CHANGE_DATA_KEY_HAVE_VIDEO': {
      return{
        ...state,
        data_key_have_video: action.data_key_have_video
      }
    }

    case 'CHANGE_DATA_KEY_HAVE_GOOGLE': {
      return{
        ...state,
        data_key_have_google: action.data_key_have_google
      }
    }
    
    default: {
      return state
    }
  }
}
export default BaseReducer
