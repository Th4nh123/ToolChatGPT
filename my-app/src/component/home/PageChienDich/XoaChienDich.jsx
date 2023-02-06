import React from 'react'
import $ from 'jquery'
import { useDispatch, useSelector } from "react-redux";
import { ajaxCallGet, ajaxCallGetUrlYoutube, SearchResults } from '../../libs/base';
import { changeDataCam, changeDataKey } from '../../reducer_action/BaseReducerAction';
import { Const_Libs } from '../../libs/Const_Libs';


const XoaChienDich = () => {
  const dispatch = useDispatch()

  const handleGetCampaign = () => {
    const select_all_key = { id: -1, label: 'Tất cả key', language: 'Vietnamese', check: 0 }
    ajaxCallGet(`get-cam`).then(async rs => {
      let arr = [];
      if (rs.length === 0) {
        dispatch(changeDataCam([]))
      } else {
        await rs.map(item => {
          arr.push({ id: item.id, value: item.campaign, label: item.campaign, language: item.language, check: item.check })
        })
        dispatch(changeDataCam([...arr, select_all_key]))
      }
    })
  }

  const deleteCamByCheckBox = async () => {
    for (const checkbox of document.querySelectorAll(
      'input[name="checkbox-cam"]'
    )) {
      if (checkbox.checked) {
        await ajaxCallGet(
          'delete-campaign/' + checkbox.getAttribute('data-id-cam')).then(rs => {
            checkbox.checked = false
          }).catch(err => console.log(err))
      }
    }
    $('#checkAllCam').prop('checked', false)
    handleGetCampaign();
    Const_Libs.TOAST.success('Đã xóa thành công.')
  }

  return (
    <>
      <button
        type='button'
        className='fw-bolder btn btn-outline-danger'
        style={{ fontSize: '14px' }}
        onClick={() => deleteCamByCheckBox()}
      >
        Xóa
      </button>
    </>
  )
}

export default XoaChienDich