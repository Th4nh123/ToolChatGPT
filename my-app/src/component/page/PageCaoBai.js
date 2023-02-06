import React, { useEffect, useState } from 'react'
import $ from 'jquery'
import { useSelector, useDispatch } from 'react-redux'
import Select from 'react-select'

import {
  ajaxCallGet,
  ajaxCallGetUrl,
  ajaxCallPost,
  getHostname,
  getHostname2,
  URL_API_WEB
} from '../libs/base'
import {
  changeCurrentIdCam,
  changeCurrentIdKey,
  changeDataKey,
  changeDataLang,
  changeDataUrl,
  changeDetailPost,
  changeTrangThaiCam
} from '../reducer_action/BaseReducerAction'
import './../../css/style.css'
import useStateRef from 'react-usestateref'
import { Const_Libs } from '../libs/Const_Libs'
import ModalPostContent from '../modal/ModalPostContent'


export function SelectChienDich() {
  const dispatch = useDispatch()


  const dataKey = useSelector(state => state.base.data_key);
  const [selectedOption, setSelectedOption] = useState({});
  const dataCam = useSelector(state => state.base.data_cam);
  const dataLang = useSelector(state => state.base.data_lang);
  const data_current_id_cam = useSelector(state => state.base.current_id_cam)

  const handleGetKeyByIdCam = (id) => {
    ajaxCallGet(`get-key-by-id-cam/` + id).then(rs => {
      dispatch(changeDataKey([...rs]));
    })
  }


  const handleChangeOption = () => {
    //Check logic nếu đồng ý thì cho thay đổi 
    //update trạng thái của chiến dịch đó bằng 1
    return setSelectedOption;
    //nêu không đồng ý thì không làm gì cả, hiện ra thông báo
  }



  useEffect(() => {
    if (selectedOption.id) {
      dispatch(changeCurrentIdCam(selectedOption.id))
      const { id, value, label } = selectedOption;

      let data_lang = { value: selectedOption.language, label: selectedOption.language }
      dispatch(changeDataLang([data_lang]))
      // setItemLocalStorage('id_cam', [id]);
      handleGetKeyByIdCam(id)

    }

  }, [selectedOption])

  return (
    <Select className='col-8 o-campaigns'
      defaultValue={dataCam.filter((item) => item.id === data_current_id_cam)}
      value={dataCam.filter((item) => item.id === data_current_id_cam)}
      onChange={handleChangeOption()}
      options={dataCam} />
  )

}

export function SelectLanguage() {

  const dataCam = useSelector(state => state.base.data_cam);
  const dataLang = useSelector(state => state.base.data_lang)
  const data_current_id_cam = useSelector(state => state.base.current_id_cam);

  const [selectedOption, setSelectedOption] = useState({});

  const options = [
    { value: 'Vietnamese', label: 'Vietnamese' },
    { value: 'English', label: 'English' },
  ];

  const handleChangeOption = () => {
    //Check logic nếu đồng ý thì cho thay đổi 
    return setSelectedOption;
    //nêu không đồng ý thì không làm gì cả, hiện ra thông báo
  }


  useEffect(() => {

  }, [selectedOption])

  return (
    <Select className={`col-8 o-languages`}
      value={dataLang}
      onChange={handleChangeOption()}
      options={options} />
  )
}



export default function PageCaoBai() {
  const dispatch = useDispatch()

  const dataKey = useSelector(state => state.base.data_key)
  const dataUrl = useSelector(state => state.base.data_url)
  const [data_url_ref, set_data_url_ref, get_data_url_ref] = useStateRef('')
  const data_current_id_cam = useSelector(state => state.base.current_id_cam)


  const [
    current_url_ref,
    set_current_url_ref,
    get_current_url_ref
  ] = useStateRef()
  const [
    current_key_ref,
    set_current_key_ref,
    get_current_key_ref
  ] = useStateRef(null)
  const [current_id_key, set_current_id_key, get_current_id_key] = useStateRef(
    null
  )
  const [
    action_url_cao_bai_ref,
    set_action_url_cao_bai_ref,
    get_action_url_cao_bai_ref
  ] = useStateRef([])
  const [value_stop_ref, set_value_stop_ref, get_value_stop_ref] = useStateRef(
    'start'
  )

  const [checkedKey, setCheckedKey] = useState([])

  const handleGetKeyByIdCam = (id) => {
    ajaxCallGet(`get-key-by-id-cam/` + id).then(rs => {
      $('.box-note-default').addClass('d-flex');
      $('.box-note-default').removeClass('d-none');
      $('.box-note-all').addClass('d-none');
      $('.box-note-all').removeClass('d-flex');
      dispatch(changeDataKey([...rs]));
    })
  }


  const handleGetKeyNoneUrl = async () => {

    if (data_current_id_cam) {
      await ajaxCallGet(`get-key-none-url/${data_current_id_cam}`)
        .then(rs => {
          if (rs.length === 0) {
            Const_Libs.TOAST.success("Chiến dịch này đã có URL hết rồi")
          } else {
            $('.box-note-default').addClass('d-none');
            $('.box-note-default').removeClass('d-flex');
            $('.box-note-all').addClass('d-flex');
            $('.box-note-all').removeClass('d-none');
            dispatch(changeDataKey([...rs]))
          }
        })
    } else {
      Const_Libs.TOAST.error("Vui lòng chọn chiến dịch trước khi thao tác,")
    }
  }

  const handleUpdateCam = (id) => {
    ajaxCallGet(`update-cam/${id}`).then(async rs => {
      await dispatch(changeTrangThaiCam(true));
      Const_Libs.TOAST.success("Chiến dịch này đang được chạy")

    })
  }

  const handleResetCam = (id) => {
    ajaxCallGet(`reset-cam/${id}`).then(async rs => {
      await dispatch(changeTrangThaiCam(false));
      Const_Libs.TOAST.success("Chiến dịch này đã được dừng lại, vui lòng đợi chạy nốt URL này")
    })
  }

  /**
   * Lấy ra chi tiết bài post
   *
   * @param id_key
   * @author XHieu
   */
  const getDetailPost = async id_post => {
    await ajaxCallGet('get-detail-post/' + id_post).then(rs => {
      dispatch(changeDetailPost({ ...rs[0] }))
    })
  }
  /**
   * Lấy ra danh sách Url theo key
   *
   * @param id_key
   * @author XHieu
   */
  const handleGetUrlByKey = async id_key => {
    let key = dataKey.filter(item => item.id == id_key)
    set_current_key_ref(key[0])
    set_current_id_key(id_key)
    dispatch(changeCurrentIdKey(id_key))
    return await ajaxCallGet('get-url-by-id-key/' + id_key).then(rs => {
      for (let i = 0; i < rs.length; i++) {
        rs[i].state = 'create'
      }
      dispatch(changeDataUrl([...rs]))
      return rs
    })
  }

  /** Tự động cào bài mỗi khi reload lại trang hoặc thay đổi chiến dịch
  *
  *
  * @param No
  * @author THieu
  */

  /**
   * Lấy ra danh sách key
   *
   * @param No
   * @author XHieu
   */
  const handleGetKey = () => {
    ajaxCallGet('get-key').then(rs => {
      dispatch(changeDataKey([...rs]))
    })
  }
  /** Xử lý cào bài
   *
   *
   * @param No
   * @author XHieu
   */



  const handleTiepTucCao = async (index) => {
    console.log("Tiep tuc cao o vi tri " + index);
    set_value_stop_ref('pendding')
    for (let x = index; x < dataKey.length; x++) {
      console.log('dang cao lai vi tri ' + x)
      if (dataKey[x].check) continue
      await setTimeout(() => { }, 1000)
      let data = await handleGetUrlByKey(dataKey[x].id)
      console.log(data)
      dispatch(changeDataUrl([...data]))
      $('.label-key')
        .eq(x)
        .addClass('pendding')
      $('.input-key')
        .eq(x)
        .prop('checked', true)
      let sl_bai_da_cao = 0
      for (let i = 0; i < data.length; i++) {
        if (get_value_stop_ref.current === 'stop') {
          $('.label-key')
            .eq(x)
            .removeClass('pendding')
          handleGetKeyByIdCam(data_current_id_cam)
          return 0;
        }
        if (data[i].check) continue
        let body = {
          id: data[i].id,
          url: data[i].url,
          id_key: data[i].id_key,
          check: data[i].check
        }
        $('.sspinner')
          .eq(i)
          .removeClass('d-none')

        await setTimeout(() => { }, 1000)
        set_current_url_ref(data[i].url)
        await ajaxCallPost('tool-clone', body)
          .then(rs => {
            if (rs.code == 200) {
              data[i].check = true
              data[i].post_name = rs.post_name
              sl_bai_da_cao += 1
            }
          })
          .catch(err => {
            console.log(err)
          })
        $('.sspinner')
          .eq(i)
          .addClass('d-none')
        set_data_url_ref(data)
      }
      $('.input-key')
        .eq(x)
        .prop('checked', false)
      $('.label-key')
        .eq(x)
        .removeClass('pendding')
      if (sl_bai_da_cao >= 0) {
        await ajaxCallGet('update-key/' + dataKey[x].id)
        dataKey[x].check = true
      }
    }
    dispatch(changeDataKey([...dataKey]))

  }
  

  const handleCaoBai = async () => {
    let status = 1;
    if (data_current_id_cam) {
      handleUpdateCam(data_current_id_cam);
      set_value_stop_ref('pendding')
      for (let x = 0; x < dataKey.length; x++) {
        console.log(`bat dau cao dataKey ${x}`)
        if (dataKey[x].check) continue
        await setTimeout(() => { }, 1000)
        let data = await handleGetUrlByKey(dataKey[x].id)
        $('.icon-status').removeClass('d-none')
        console.log(data)
        dispatch(changeDataUrl([...data]))
        $('.label-key')
          .eq(x)
          .addClass('pendding')
        $('.input-key')
          .eq(x)
          .prop('checked', true)
        let sl_bai_da_cao = 0
        for (let i = 0; i < data.length; i++) {
          if (get_value_stop_ref.current === 'stop') {
            $('.label-key')
              .eq(x)
              .removeClass('pendding')
            handleGetKeyByIdCam(data_current_id_cam)
            return 0;
          }
          if (data[i].check) continue
          let body = {
            id: data[i].id,
            url: data[i].url,
            id_key: data[i].id_key,
            check: data[i].check
          }
          $('.sspinner')
            .eq(i)
            .removeClass('d-none')

          await setTimeout(() => { }, 1000)
          set_current_url_ref(data[i].url)
          await ajaxCallPost('tool-clone', body)
            .then(rs => {
              if (rs.code == 200) {
                data[i].check = true
                data[i].post_name = rs.post_name
                sl_bai_da_cao += 1
              }
            })
            .catch(err => {
              console.log(err)
            })
          $('.sspinner')
            .eq(i)
            .addClass('d-none')
          set_data_url_ref(data)
        }
        $('.input-key')
          .eq(x)
          .prop('checked', false)
          $('.icon-status').addClass('d-none')
        $('.label-key')
          .eq(x)
          .removeClass('pendding')
        console.log(`remove pedding dataKey ${x}, tiep tuc`)
        if (sl_bai_da_cao >= 0) {
          console.log(`hoan thanh dataKey ${x}`)
          await ajaxCallGet('update-key/' + dataKey[x].id)
          dataKey[x].check = true
        }
        console.log(`xong dataKey ${x}`)
        if (status === 1) continue;
      }
      dispatch(changeDataKey([...dataKey]))
      // dispatch(changeTrangThaiCam(false));
      status = 0;
      handleResetCam(data_current_id_cam)

      Const_Libs.TOAST.success(
        'Các key đã được cào hết. Không có key trống, vui lòng thêm key trước.'
      )
      //
    } else {
      Const_Libs.TOAST.error('Vui lòng chọn chiến dịch trước khi thực hiện thao tác này!')
    }
  }
  /**
   * Dừng cào bài
   *
   * @param No
   * @author XHieu
   */
  const handleDungCao = async () => {
    if (data_current_id_cam) {
      set_value_stop_ref('stop')
      await handleResetCam(data_current_id_cam)
      // Const_Libs.TOAST.success('Đã dừng cào bài.')
    } else {
      Const_Libs.TOAST.error('Vui lòng chọn chiến dịch trước khi thực hiện thao tác này!')
    }
  }

  /**
   *  Tìm kiếm key theo tên
   *
   * @param name_key: tên của key
   * @author XHieu
   */
  const findLikeKey = name_key => {
    if (name_key === '') {
      if (data_current_id_cam) {
        handleGetKeyByIdCam(data_current_id_cam)
      } else {
        handleGetKey()
      }
    } else {
      if (data_current_id_cam) {
        ajaxCallGet('find-key/' + name_key).then(async rs => {
          let arr = await rs.filter((item) => {
            return item.id_cam === data_current_id_cam;
          })
          dispatch(changeDataKey([...arr]))
        })
      } else {
        ajaxCallGet('find-key/' + name_key).then(rs => {
          dispatch(changeDataKey([...rs]))
        })
      }

    }
  }

  const handleResetKey = idKey => {
    if (data_current_id_cam) {
      ajaxCallGet('reset-key/' + idKey).then(rs => {
        handleGetKeyByIdCam(data_current_id_cam)
      })
    } else {
      ajaxCallGet('reset-key/' + idKey).then(rs => {
        handleGetKey()
      })
    }

  }


  const handleUpdateKey = idKey => {
    if (data_current_id_cam) {
      ajaxCallGet('update-key/' + idKey).then(rs => {
        handleGetKeyByIdCam(data_current_id_cam)
      })
    } else {
      ajaxCallGet('update-key/' + idKey).then(rs => {
        handleGetKey()
      })
    }
  }
  /**
   * Xóa url theo checkbox
   *
   * @param No
   * @author XHieu
   */
  const deleteUrl = async () => {
    if (get_current_id_key.current == null) {
      Const_Libs.TOAST.error('Bạn phải chọn key trước khi xóa.')
      return 0
    }
    if (document.querySelectorAll('input:checked[name="checkbox-url"]').length === 0) {
      Const_Libs.TOAST.error('Bạn phải chọn url cần xóa trước khi xóa.')

      return 0
    }
    for (const checkbox of document.querySelectorAll('input[name="checkbox-url"]')) {
      if (checkbox.checked) {
        await ajaxCallGet(
          'delete-url/' + checkbox.getAttribute('data-id-url')
        ).then(rs => {
          checkbox.checked = false
          handleResetKey(get_current_id_key.current)
        })
      }
    }
    Const_Libs.TOAST.success('Đã xóa thành công.')
    handleGetUrlByKey(get_current_id_key.current)
    $('#checkAll').prop('checked', false)
  }
  /**
   * Tìm kiếm theo tiêu đề bài post để lấy ra url
   *
   * @param name: post_title của bài viết
   * @author XHieu
   */

  const findByNameUrl = name => {
    if (name === '') {
      handleGetUrlByKey(get_current_id_key.current)
    } else {
      ajaxCallGet('find-like-url/' + name).then(rs => {
        for (let i = 0; i < rs.length; i++) {
          rs[i].state = 'create'
        }
        dispatch(changeDataUrl([...rs]))
      })
    }
  }




  useEffect(() => {
    set_data_url_ref(dataUrl)
  }, [dataUrl])

  useEffect(() => {

    $('#checkAll').click(function () {
      if ($(this).prop('checked')) {
        $('input[name="checkbox-url"]').prop('checked', true)
      } else {
        $('input[name="checkbox-url"]').prop('checked', false)
      }
    })

  }, [])

  /** Xử lý ấn vào checkbox all để cào lại
   *
   *
   * @param No
   * @author THieu
   */



  const handleCheckKeyAll = () => {
    if ($('#check-key-all').prop('checked')) {
      getIdKey();
      $('.start-cao-lai').removeClass('d-none')
      $('input[name="key"]').prop('checked', true)
    } else {
      setCheckedKey([]);
      $('.start-cao-lai').addClass('d-none')
      $('input[name="key"]').prop('checked', false)
    }
  }

  /** Lấy ra tất cả id key của 1 chiến dịch để xử lý khi nhấn checkbox
   *
   *
   * @param No
   * @author THieu
   */


  const getIdKey = async () => {
    let arr = [];
    await ajaxCallGet(`get-id-key/${data_current_id_cam}`).then(async rs => {
      await rs.map(item => {
        arr.push(item.id)
      })
    })
    console.log(arr);
    setCheckedKey([...arr]);
  }

  const handleChangeCheckBoxKey = (id) => {
    setCheckedKey(prev => {
      const isChecked = checkedKey.includes(id);
      if (isChecked) {
        return checkedKey.filter(item => item !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  const handleResetUrl = async (id_key) => {
    await ajaxCallGet(`reset-url/${id_key}`)
      .then(rs => {
        console.log(`resset url cua ${id_key} thanh cong`)
      })
  }

  const deletePostByIdKey = async (id_key) => {
    await ajaxCallGet(`delete-post-by-id-key/${id_key}`)
      .then(async rs => {
        await handleResetKey(id_key);
        await handleResetUrl(id_key);
        console.log(`Xoa post cua key co id ${id_key} thanh cong`);
      })
  }
  
  const handleCaoLai = async () => {
    let status = 1;
    handleUpdateCam(data_current_id_cam);
    set_value_stop_ref('pendding')

    for (let x = 0; x < checkedKey.length; x++) {
      await deletePostByIdKey(checkedKey[x]);

      let indexKey = document.querySelector(`.input-key-${checkedKey[x]}`).getAttribute('data-index-key');
      // if (dataKey[indexKey].check) continue // kiem tra key check = 1 thi bo qua
      await setTimeout(() => { }, 1000)
      let data = await handleGetUrlByKey(checkedKey[x])
      dispatch(changeDataUrl([...data]))
      $(`.label-key-${checkedKey[x]}`).addClass('pendding')
      let sl_bai_da_cao = 0
      for (let i = 0; i < data.length; i++) {
        if (get_value_stop_ref.current === 'stop') {
          $(`.label-key-${checkedKey[x]}`).removeClass('pendding')
          handleGetKeyByIdCam(data_current_id_cam)
          return 0
        }
        // if (data[i].check) continue
        let body = {
          id: data[i].id,
          url: data[i].url,
          id_key: data[i].id_key,
          check: data[i].check
        }
        $('.sspinner')
          .eq(i)
          .removeClass('d-none')

        await setTimeout(() => { }, 1000)
        set_current_url_ref(data[i].url)
        await ajaxCallPost('tool-clone', body)
          .then(rs => {
            if (rs.code == 200) {
              data[i].check = true
              data[i].post_name = rs.post_name
              sl_bai_da_cao += 1
            }
          })
          .catch(err => {
            console.log(err)
          })
        $('.sspinner')
          .eq(i)
          .addClass('d-none')
        set_data_url_ref(data)
      }
      $(`.label-key-${checkedKey[x]}`).removeClass('pendding')
      if (sl_bai_da_cao >= 0) {
        await ajaxCallGet('update-key/' + checkedKey[x])
        dataKey[indexKey].check = true
      }
      if(status === 1) continue;
    }
    setCheckedKey([]);
    status = 0;
    handleResetCam(data_current_id_cam);
    dispatch(changeDataKey([...dataKey]))
    Const_Libs.TOAST.success(
      'Các key đã được cào hết.'
    )
  }

  /**
   * Thay đổi nút bắt đầu cào và cào lại, 
   *
   * @param checkedKey
   * @author THieu
   */
  useEffect(() => {
    if (checkedKey.length !== 0) {
      $('.start-cao-lai').removeClass('d-none')
    } else {
      $('.start-cao-lai').addClass('d-none')

    }

  }, [checkedKey.length])

  const handleGetUrl = async () => {
    const black_list = new Map()

    await ajaxCallGet(`get-black-list-by-id-cam/${data_current_id_cam}`).then(rs => {
      console.log("Lay blackKey");
      rs.map((item, index) => {
        black_list.set(getHostname2(item.domain), index)
      })
    })
    for (const checkbox of document.querySelectorAll('input[name="key"]')) {
      if (checkbox.checked) {
        let id_key = checkbox.getAttribute('data-id-key')
        let name_key = checkbox.getAttribute('data-name-key')
        await ajaxCallGet(`get-url-by-id-key2/${id_key}`)
          .then(async rs => {
            var url_all = []
            let arr
            if (rs.length > 0) {
              checkbox.checked = false;
              document.querySelector('input[name="key-all"]').checked = false;
              console.log("Co nhieu URL hon 25, khong lam gi ca")
              return;

            } else {
              await ajaxCallGetUrl(1, 10, name_key, black_list).then(rs => {
                console.log('Get URL full:', rs)
                arr = rs.items
                for (let i in arr) {
                  url_all.push({ url: arr[i].link.split(' ').join('') })
                }
              })
              await ajaxCallGetUrl(11, 10, name_key).then(rs => {
                arr = rs.items
                for (let i in arr) {
                  url_all.push({ url: arr[i].link.split(' ').join('') })
                }
              })
              await ajaxCallGetUrl(21, 10, name_key).then(rs => {
                arr = rs.items
                for (let i in arr) {
                  url_all.push({ url: arr[i].link.split(' ').join('') })
                }
              })
              console.log(url_all);

              let result = url_all;
              for (let i in url_all) {
                let host_name = getHostname(url_all[i].url)
                if (black_list.has(host_name)) {
                  result = result.filter(item => {
                    return item.url !== url_all[i].url;
                  })
                }
              }

              await ajaxCallPost(`save-url/${id_key}`, result)
                .then(async rs => {
                  checkbox.checked = false;
                })
                .catch(err => {
                  console.log(err);
                })
              await setTimeout(() => {}, 2000)
            }


            // setTimeout(() => {
            // dispatch(changeDataUrl([...url_all]))
            // handleGetUrlByKey(id_key)
            // }, 3000)
          })
      }
    }
    setCheckedKey([])
    document.querySelector('input[name="key-all"]').checked = false;

    // if (get_current_key_ref.current !== null) {

    //   var url_all = []

    //   let arr = []
    //   if (dataUrl.length === 0) {
    //     await ajaxCallGetUrl(1, 10, get_current_key_ref.current.ten).then(
    //       rs => {
    //         console.log('Get URL full:', rs)
    //         arr = rs.items
    //         for (let i in arr) {
    //           url_all.push({ url: arr[i].link.split(' ').join('') })
    //         }
    //       }
    //     )
    //     await ajaxCallGetUrl(11, 10, get_current_key_ref.current.ten).then(
    //       rs => {
    //         arr = rs.items
    //         for (let i in arr) {
    //           url_all.push({ url: arr[i].link.split(' ').join('') })
    //         }
    //       }
    //     )
    //     await ajaxCallGetUrl(21, 10, get_current_key_ref.current.ten).then(
    //       rs => {
    //         arr = rs.items
    //         for (let i in arr) {
    //           url_all.push({ url: arr[i].link.split(' ').join('') })
    //         }
    //       }
    //     )
    //     let i = 0;
    //     for (let i in url_all) {
    //       let host_name = getHostname(url_all[i].url)
    //       if (black_list.has(host_name)) {
    //         i += 1;
    //         url_all.splice(i, 1)
    //       }
    //     }

    //     //Post danh sách url sau khi lọc
    //     await ajaxCallPost(`save-url/${get_current_key_ref.current.id}`, url_all)
    //       .then(rs => { })
    //       .catch(err => {
    //         console.log(err)
    //       })
    //   } else {
    //     console.log("khong lam gi ca")
    //     return;
    //   }

    //   setTimeout(() => {
    //     // dispatch(changeDataUrl([...url_all]))
    //     // handleGetUrlByKey(get_current_key_ref.current.id)
    //     Const_Libs.TOAST.success('Lấy Url thành công')
    //   }, 3000)
    // }
  }



  const handleClearDataByCheckBox = async () => {
    if (checkedKey.length > 0) {
      for (const checkbox of document.querySelectorAll('input[name="key"]')) {
        if (checkbox.checked) {
          let id_key = checkbox.getAttribute('data-id-key')

          await ajaxCallGet('delete-url-by-id-key/' + id_key).then(rs => {
            handleResetKey(id_key)
            handleGetUrlByKey(id_key)
          })
        }
      }
      document.querySelector('input[name="key-all"]').checked = false;
      setTimeout(() => {
        setCheckedKey([])
        Const_Libs.TOAST.success('Xóa data của Key thành công')
      }, 3000)
    } else {
      Const_Libs.TOAST.error('Vui lòng chọn key trước khi thực hiện thao tác này')
    }
  }


  return (
    <React.Fragment>
      <ModalPostContent />
      <section id='content'>
        <div className='top-content'>
          <div className='row justify-content-end'>
          </div>
        </div>
        <div className='bottom-content'>
          <div className='row '>
            <div className='col-3 left' style={{ height: '77vh' }}>
              <div
                className='left-container position-relative'
                style={{ overflowY: 'scroll', padding: '0 16px' }}
              >
                <div className='button-key d-flex justify-content-between align-items-center position-sticky'
                  style={{ zIndex: '10000', top: 0, background: '#fff', padding: '16px 0' }}>
                  <div>
                    <span className='fs-7 fw-bolder'>Danh sách key</span>
                  </div>
                  <div className='d-flex justify-content-between align-items-center'>
                    <button
                      type='button'
                      onClick={() => {
                        handleCaoBai()
                      }}
                      className='fw-bolder active btn btn-outline-primary me-2 start-cao-bai'
                      style={{ fontSize: '14px' }}
                    >
                      Bắt đầu cào
                    </button>

                    <button
                      type='button'
                      onClick={() => {
                        handleDungCao()
                      }}
                      className='fw-bolder btn btn-outline-primarybtn btn-outline-danger'
                      style={{ fontSize: '14px' }}
                    >
                      Dừng cào bài
                    </button>
                  </div>
                </div>
                <div className='d-flex align-items-cente position-sticky  align-items-center'
                  style={{ zIndex: '10000', background: '#fff', top: '56px' }}
                >
                  <div className=''>
                    <input
                      style={{ width: '18px', height: '18px' }}
                      id='check-key-all'
                      type='checkbox'
                      name='key-all'
                      onClick={() => handleCheckKeyAll()}
                      className='me-2 input-key-all'
                    />
                  </div>
                  <div
                    className='search-key d-flex align-items-center'
                    style={{ width: '100%' }}
                  >
                    <i
                      className='fa-solid fa-magnifying-glass'
                      style={{ width: '10%' }}
                    />
                    <input
                      type='text'
                      onChange={function (event) {
                        findLikeKey(event.target.value)
                      }}
                      placeholder='Tìm kiếm Key'
                      style={{ width: '90%', outline: 'none' }}
                    />
                  </div>
                </div>
                <div className='list-key' style={{ position: 'relative' }}>
                  {dataKey.length == 0 ? <span>Không tồn tại key</span> : ''}
                  {dataKey.map((item, index) => {
                    let label_key = `label-key-${item.id}`
                    let input_key = `input-key-${item.id}`
                    return (
                      <div
                        className='item d-flex align-items-center mt-1 mb- fw-bolder'
                        style={{ fontSize: '14px', padding: '3px 0' }}
                        key={label_key}
                      >
                        <input
                          type='checkbox'
                          name='key'
                          data-id-key={item.id}
                          data-index-key={index}
                          className={`me-2 input-key ${input_key}`}
                          data-name-key={item.ten}
                          checked={checkedKey.includes(item.id)}
                          onChange={() => handleChangeCheckBoxKey(item.id)}
                        />
                        <label
                          style={{ marginLeft: '8px', cursor: 'pointer' }}
                          htmlFor
                          className={
                            item.check == true
                              ? `h-100 mt-2 text-primary label-key ${label_key}`
                              : `h-100 mt-2 label-key ${label_key}`
                          }
                          data-id-key={item.id}
                          id={
                            get_current_id_key.current === item.id
                              ? 'text-green'
                              : ''
                          }
                          onClick={() => {
                            handleGetUrlByKey(item.id)
                          }}
                        >

                          {index + 1}. {item.ten}
                        </label>
                        <span
                          // className={get_current_id_key.current === item.id ? 'fa-regular fa-circle-play color-primary' : ''}
                          style={{ fontSize: '13px', position: 'absolute', right: '0', color: '#605c5c' }}
                        >
                          {/* {demDaCao}/{count} */}
                          {/* 23/30 */}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            <div className='col-9 right' style={{ height: '77vh' }}>
              <div className='right-container position-relative' style={{ overflowY: 'scroll' }}>
                <div
                  className='row px-4 d-flex align-items-center justify-content-between position-sticky'
                  style={{ top: '0', padding: '10px', background: '#fff' }}
                >
                  <div className='col-8'>
                    <span className='fs-7 fw-bolder'>Danh sách URL: </span>
                    <a href='#' className='mr-2'>
                      {get_current_key_ref.current != null
                        ? get_current_key_ref.current.ten
                        : ''}
                    </a>
                  </div>
                  <div className='col-4 d-flex flex-row justify-content-end'>

                    <div className='col-3 delete'>
                      <button
                        type='button'
                        onClick={() => {
                          handleCaoLai()
                        }}
                        className='fw-bolder active btn btn-outline-primary me-2 start-cao-lai d-none'
                        style={{ fontSize: '14px' }}
                      >
                        Cào lại
                      </button>
                    </div>
                    <div className='col-3 delete'>
                      <button
                        type='button'
                        className='fw-bolder btn btn-outline-primary'
                        onClick={() => handleGetUrl()}
                        style={{ fontSize: '14px' }}
                      >
                        Lấy URL
                      </button>
                    </div>
                    <div className='col-3 delete'>
                      <button
                        type='button'
                        onClick={() => {
                          deleteUrl()
                        }}
                        className=' fw-bolder btn btn-outline-danger btn-delete-url'
                        style={{ fontSize: '14px' }}
                      >
                        Xóa URL
                      </button>
                    </div>
                    <div className='col-3 delete' style={{ marginLeft: '12px' }}>
                      <button
                        type='button'
                        onClick={() => {
                          handleClearDataByCheckBox()
                        }}
                        className='fw-bolder btn btn-outline-danger'
                        style={{ fontSize: '14px' }}
                      >
                        Clear Data
                      </button>

                    </div>

                    {/* <div className='col-3 delete'>
                <ModalGetDataKey />
              </div> */}
                  </div>

                  {/* <div className='col-6 ' style={{ border: '1px solid #ccc', padding: '8px 12px', borderRadius: '4px' }}>
                    <i className='fa-solid fa-magnifying-glass col-1' />
                    <input
                      type='text'
                      className='col-10'
                      placeholder='Tìm kiếm url'
                      onChange={function (event) {
                        findByNameUrl(event.target.value)
                      }}
                      style={{ outline: 'none' }}
                    />
                  </div> */}
                </div>
                <div className='p-3 table-responsive'>
                  <table className='table '>
                    <thead>
                      <tr>
                        <th>
                          <input type='checkbox' id='checkAll' />
                        </th>
                        <th />
                        <th>URL</th>
                        <th>URL hoàn thiện</th>
                        <th />
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      <colgroup>
                        <col style={{ width: '5%!important' }}></col>
                        <col style={{ width: '5%!important' }}></col>
                        <col style={{ width: '40%!important' }}></col>
                        <col style={{ width: '40%!important' }}></col>
                        <col style={{ width: '10%!important' }}></col>
                        <col style={{ width: '10%!important' }}></col>
                      </colgroup>
                      {get_data_url_ref.current.length <= 0 ? (
                        <td>Không có url</td>
                      ) : (
                        get_data_url_ref.current.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td style={{ maxHeight: '21px', width: '5%' }}>
                                <input
                                  type='checkbox'
                                  name='checkbox-url'
                                  data-id-url={item.id}
                                />
                              </td>
                              <td
                                style={{
                                  maxHeight: '21px',
                                  width: '5%',
                                  textAlign: 'center'
                                }}
                              >
                                {index + 1}
                              </td>
                              <td
                                className={
                                  item.check == false
                                    ? 'text-dark'
                                    : 'text-primary'
                                }
                                style={{
                                  maxHeight: '21px',
                                  width: '40%',
                                  maxWidth: '300px'
                                }}
                              >
                                <a href={item.url} target='_blank'>
                                  {item.url}
                                </a>
                              </td>
                              <td style={{ maxHeight: '21px', width: '40%' }}>
                                {item.post_name == null ? (
                                  ''
                                ) : (
                                  <a
                                    target={'_blank'}
                                    href={URL_API_WEB + item.post_name}
                                  >
                                    {URL_API_WEB + item.post_name}
                                  </a>
                                )}{' '}
                                <div
                                  className='spinner-border text-primary sspinner d-none'
                                  style={{ width: '30px', height: '30px' }}
                                  role='status'
                                >
                                  <span className='visually-hidden'>
                                    Loading...
                                  </span>
                                </div>
                              </td>
                              <td
                                style={{
                                  maxHeight: '21px',
                                  width: '5%',
                                  textAlign: 'center',
                                  fontSize: '14px'
                                }}
                              >
                                {item.post_content
                                  ? item.post_content.length
                                  : ''}
                              </td>
                              <td
                                style={{
                                  maxHeight: '21px',
                                  width: '5%',
                                  textAlign: 'center'
                                }}
                              >
                                {item.check == true ? (
                                  <i
                                    data-bs-toggle='modal'
                                    data-bs-target='#exampleModal'
                                    style={{
                                      fontSize: '21px',
                                      color: '#6c6c6c',
                                      cursor: 'pointer'
                                    }}
                                    onClick={() => {
                                      getDetailPost(item.ID)
                                    }}
                                    className='fa-regular fa-paste'
                                  ></i>
                                ) : (
                                  ''
                                )}
                              </td>
                            </tr>
                          )
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* cursor: pointer;
    border: 1px solid #2b94ff;
    background: #a5d4ff61; */}

          <ul className='d-flex justify-content-start align-items-center' style={{ marginTop: '16px', padding: 0 }}>
            <li className='d-none align-items-center me-3 box-note box-note-all' onClick={e => handleGetKeyByIdCam(data_current_id_cam)} style={{ cursor: 'pointer', border: '1px solid #2b94ff', background: '#a5d4ff61' }}><span className='box-color box-key-all' style={{ background: '#000' }}></span>Mặc định</li>
            <li className='d-flex align-items-center me-3 box-note box-note-default' onClick={e => handleGetKeyNoneUrl()} style={{ cursor: 'pointer' }}><span className='box-color box-default'></span>Mặc định</li>
            <li className='d-flex align-items-center me-3 box-note'><span className='box-color box-running'></span>Đang cào</li>
            <li className='d-flex align-items-center me-3 box-note'><span className='box-color box-finish'></span>Đã cào</li>
            <li className='d-flex align-items-center me-3 box-note'><span className='box-color box-choosing'></span>Đang chọn</li>
          </ul>
        </div>
      </section>
    </React.Fragment>
  )
}

