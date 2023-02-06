import React from 'react'
import $ from 'jquery'
import { useDispatch, useSelector } from 'react-redux';

import { ajaxCallGet } from '../../libs/base';
import { changeDataBlackList } from '../../reducer_action/BaseReducerAction';
import { Const_Libs } from '../../libs/Const_Libs';

const XoaBlackList = () => {
  const dispatch = useDispatch();

  const current_id_cam = useSelector(state => state.base.current_id_cam)

  const handleGetBlackListByIdCam = () => {
    ajaxCallGet(`get-black-list-by-id-cam/${current_id_cam}`).then(rs => {
      dispatch(changeDataBlackList([...rs]))
    }).catch(err => console.log(err))
  }

  const deleteBlackKeyByCheckBox = async () => {

    for (const checkbox of document.querySelectorAll(
      'input[name="checkbox-black-key"]'
    )) {
      if (checkbox.checked) {
        await ajaxCallGet(
          'delete-black-list/' + checkbox.getAttribute('data-id-black-key')
        ).then(rs => {
          checkbox.checked = false;
        }).catch(err => console.log(err))
      }
    }
    handleGetBlackListByIdCam();
    $('#checkbox-all-black').prop('checked', false)
    Const_Libs.TOAST.success('Đã xóa thành công.')
  }

  const deleteAllBlackKeyByCheckBox = () => {
    ajaxCallGet(`delete-all-black-list/${current_id_cam}`).then(rs => {
      console.log(rs);
      $('#checkbox-all-black').prop('checked', false);
      $('.btn-delete-all-bl').addClass('d-none')
      $('.btn-delete-bl').removeClass('d-none')
      Const_Libs.TOAST.success('Đã xóa thành công.')
      handleGetBlackListByIdCam();
    }).catch(err => console.log(err))
  }
  return (
    <>
      <button
        type='submit'
        className='btn-delete-bl btn btn-outline-danger fw-bolder'
        style={{ marginRight: '10px', fontSize: '14px' }}
        onClick={deleteBlackKeyByCheckBox}
      >
        Xóa
      </button>

      <button
        type='submit'
        className='btn-delete-all-bl btn btn-outline-danger fw-bolder d-none '
        style={{ marginRight: '10px', fontSize: '14px' }}
        onClick={deleteAllBlackKeyByCheckBox}
      >
        Xóa hết
      </button>

    </>
  )
}

export default XoaBlackList