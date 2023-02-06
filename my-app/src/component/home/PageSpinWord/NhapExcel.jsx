import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { OutTable, ExcelRenderer } from 'react-excel-renderer';

import { ajaxCallGet, ajaxCallPost } from '../../libs/base';
import { changeDataSpinWord } from '../../reducer_action/BaseReducerAction';
import { Const_Libs } from '../../libs/Const_Libs';

const NhapExcel = () => {
  const dispatch = useDispatch()
  const [isUploading, setUploading] = useState(false);

  const current_id_cam = useSelector(state => state.base.current_id_cam)

  const handleGetSpinByIdCam = () => {
    ajaxCallGet(`get-spin-word-by-id-cam/${current_id_cam}`).then(rs => {
      dispatch(changeDataSpinWord([...rs]))
    }).catch(err => console.log(err))
  }

  const fileHandler = event => {
    setUploading(true);
    let fileObj = event.target.files[0]

    ExcelRenderer(fileObj, async (err, resp) => {
      resp.rows.splice(0, 1)
      let data_key = [...resp.rows.filter(item => item.length !== 0)];
      if (err) {
        setUploading(false)
        console.log(err)
      } else {
        let arr = [];
        data_key.map(item => {
          arr.push({
            key_1: item[0] ? item[0] : '',
            key_2: item[1] ? item[1] : '',
            key_3: item[2] ? item[2] : '',
            key_4: item[3] ? item[3] : '',
            key_5: item[4] ? item[4] : '',
            key_6: item[5] ? item[5] : '',
            key_7: item[6] ? item[6] : '',
            key_8: item[7] ? item[7] : '',
            key_9: item[8] ? item[8] : '',
            key_10: item[9] ? item[9] : '',
            key_11: item[10] ? item[10] : ''
          })
        })
        if (current_id_cam) {
          await ajaxCallPost(`save-spin-word-by-id-cam/${current_id_cam}`, arr).then(rs => {
            handleGetSpinByIdCam();
            Const_Libs.TOAST.success("Thêm thành công")
          })
        } else {
          Const_Libs.TOAST.console.error("Phải chọn chiến dịch trước khi import")
        }
      }
    })
  }
  return (
    <label htmlFor='inputSpinExcel' style={{ marginRight: '10px' }}>
      <span className='btn btn-primary fw-bolder'  style={{ fontSize: '14px' }}>
        Nhập Excel
      </span>
      <input
        id='inputSpinExcel'
        key={isUploading}
        type='file'
        onChange={e => fileHandler(e)}
        style={{ display: 'none' }}
      />
    </label>
  )
}

export default NhapExcel