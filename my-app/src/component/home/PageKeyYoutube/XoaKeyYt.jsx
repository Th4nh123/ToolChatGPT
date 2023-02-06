import React from 'react'
import $ from "jquery";
import { ajaxCallGet } from '../../libs/base';
import { Const_Libs } from '../../libs/Const_Libs';

const XoaKeyYt = (props) => {
  const {handleGetAllKeyYt} = props;
  const handleDeleteYt = async () => {
    for (let checkbox of document.querySelectorAll('input[name="checkbox-key-youtube"]')) {
      if (checkbox.checked) {
        await ajaxCallGet(`delete-key-youtube/${checkbox.getAttribute('data-id-key-youtube')}`).then(rs => {
          checkbox.checked = false
          console.log(1111);
        }).catch(err => console.log(err))
      }
    }
    await handleGetAllKeyYt();
    Const_Libs.TOAST.success("Xóa thành công");
  }

  const handleDeleteAllYt = () => {
    ajaxCallGet(`delete-all-key-youtube`).then(async response => {
      $('#check-all-key-yt').prop('checked', false);
      $('input[name="checkbox-key-youtube"]').prop('checked', false)
      $('.btn-delete-key-yt').removeClass('d-none')
      $('.btn-delete-all-key-yt').addClass('d-none')
      await handleGetAllKeyYt();
      Const_Libs.TOAST.success("Xóa tất cả thành công");
    })
    // .catch(err => console.log(err))
  }


  return (
    <>
      <button
        type='button'
        className='btn-delete-key-yt fw-bolder btn btn-outline-danger'
        style={{ fontSize: '14px' }}
        onClick={() => handleDeleteYt()}
      >
        Xóa
      </button>
      <button
        type='button'
        className='btn-delete-all-key-yt fw-bolder btn btn-outline-danger d-none'
        style={{ fontSize: '14px' }}
        onClick={() => handleDeleteAllYt()}
      >
        Xóa hết
      </button>
    </>
  )
}

export default XoaKeyYt