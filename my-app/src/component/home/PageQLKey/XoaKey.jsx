import React from 'react'
import $ from 'jquery'
import { useDispatch, useSelector } from 'react-redux'

import { ajaxCallGet } from '../../libs/base'
import { changeDataKey } from '../../reducer_action/BaseReducerAction'
import { Const_Libs } from '../../libs/Const_Libs'

const XoaKey = () => {
  const dispatch = useDispatch()
  const data_current_id_cam = useSelector(state => state.base.current_id_cam)

  const handleGetKeyByIdCam = (id) => {
    ajaxCallGet('get-key-by-id-cam/' + id).then(rs => {
      console.log(rs);
      dispatch(changeDataKey([...rs]))
    }).catch(err => console.log(err))
  }

  const deleteKeyByCheckBox = async () => {
    if (data_current_id_cam) {
      for (const checkbox of document.querySelectorAll(
        'input[name="checkbox-key"]'
      )) {
        console.log(checkbox)
        if (checkbox.checked) {
          await ajaxCallGet(
            'delete-key/' + checkbox.getAttribute('data-id-key')
          ).then(rs => {
            checkbox.checked = false
            console.log(rs)
          }).catch(err => console.log(err))
        }
      }
      handleGetKeyByIdCam(data_current_id_cam)
      $('#check-all-key').prop('checked', false);
      Const_Libs.TOAST.success('Đã xóa thành công.');
    } else {
      Const_Libs.TOAST.error('Vui lòng chọn chiến dịch trước khi thực hiện thao tác này!!');

    }
  }

  const deleteAllKeyByCheckBox = async () => {
    if (data_current_id_cam) {
      ajaxCallGet(`delete-all-key/${data_current_id_cam}`).then(rs => {
        console.log(rs)
        $('#check-all-key').prop('checked', false);

        $('.btn-delete-all-key').addClass('d-none');
        $('.btn-delete-key').removeClass('d-none');

        handleGetKeyByIdCam(data_current_id_cam);
        Const_Libs.TOAST.success('Đã xóa thành công.');
      }).catch(err => console.log(err))
    } else {
      Const_Libs.TOAST.error('Vui lòng chọn chiến dịch trước khi thực hiện thao tác này!!');
    }
  }
  return (
    <>
      <button
        type='submit'
        className='btn-delete-key btn btn-outline-danger fw-bolder'
        style={{ marginRight: '10px' }}
        onClick={() => deleteKeyByCheckBox()}
      >
        Xóa
      </button>

      <button
        type='submit'
        className='d-none btn-delete-all-key btn btn-outline-danger fw-bolder'
        style={{ marginRight: '10px', fontSize: '14px' }}
        onClick={() => deleteAllKeyByCheckBox()}
      >
        Xóa hết
      </button>
    </>
  )
}

export default XoaKey