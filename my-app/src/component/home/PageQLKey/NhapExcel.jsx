import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { OutTable, ExcelRenderer } from 'react-excel-renderer'

import { ajaxCallGet, ajaxCallPost } from '../../libs/base'
import { Const_Libs } from '../../libs/Const_Libs'
import { changeDataKey } from '../../reducer_action/BaseReducerAction'

const NhapExcel = () => {
  const dispatch = useDispatch()

  const [isUploading, setUploading] = useState(false);
  const data_current_id_cam = useSelector(state => state.base.current_id_cam)

  const cutKeyAndUrl = myString => {
    let index = myString.indexOf('-')
    return {
      phan_tu_1: myString.slice(0, index),
      phan_tu_2: myString.slice(index + 1).trim()
    }
  }

  const handleGetKeyByIdCam = (id) => {
    ajaxCallGet('get-key-by-id-cam/' + id).then(rs => {
      console.log(rs);
      dispatch(changeDataKey([...rs]))
    }).catch(err => console.log(err))
  }

  const handleGetAllKey = () => {
    ajaxCallGet('get-key').then(rs => {
      dispatch(changeDataKey([...rs]))
    }).catch(err => console.log(err))
  }

  //https://www.youtube.com/watch?v=41GviT3Pepk&list=PLBcGPKNwWSiJpYdz3JQZ4vOMz00jSt5il
  const cutIdListYoutubeFromLink = (Link) => {
    console.log(Link)
    let id_list;
    if (Link.length > 0) {
      let index = Link.indexOf('list=');
      if (index >= 0) {
        id_list = Link.substring(index + 5);
      } else {
        id_list = ''
      }
    }
    return id_list;
  }

  const fileHandler = event => {
    let fileObj = event.target.files[0]
    setUploading(true);

    ExcelRenderer(fileObj, async (err, resp) => {
      resp.rows.splice(0, 3)
      let data_key = [...resp.rows.filter(item => item.length !== 0)]
      console.log(data_key)
      if (err) {
        setUploading(false);
        console.log(err)
      } else {
        let arr = []
        await data_key.map(item => {
          arr.push({
            tien_to: item[2] ? item[2] : '',
            key_cha: item[3] ? item[3] : '',
            hau_to: item[4] ? item[4] : '',
          })
        })
        if (data_current_id_cam) {
          await ajaxCallPost(`save-key-by-id-cam/${data_current_id_cam}`, arr).then(rs => {
            console.log(rs)
            Const_Libs.TOAST.success('Thêm key theo chiến dịch thành công')
            handleGetKeyByIdCam(data_current_id_cam)
          })
        } else {
          await ajaxCallPost(`save-key`, arr).then(rs => {
            Const_Libs.TOAST.success('Thêm key thành công')
            handleGetAllKey()
          })
        }
      }
    })
  }
  return (
    <label htmlFor='inputTag' style={{ marginRight: '10px' }}>
      <span className='btn btn-primary fw-bolder' style={{ fontSize: '14px' }}>Nhập Excel</span>
      <input
        id='inputTag'
        key={isUploading}
        type='file'
        onChange={e => fileHandler(e)}
        style={{ display: 'none' }}
      />
    </label>
  )
}

export default NhapExcel