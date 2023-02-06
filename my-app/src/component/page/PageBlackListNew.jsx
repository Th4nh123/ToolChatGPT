import $ from 'jquery'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { ajaxCallGet } from '../libs/base';
import { changeDataBlackList } from '../reducer_action/BaseReducerAction';
import NhapExcel from '../home/PageBlackList/NhapExcel';
import XoaBlackList from '../home/PageBlackList/XoaBlackList';
import DanhSachBlackList from '../home/PageBlackList/DanhSachBlackList';
import ModalAddBlackList from '../modal/ModalAddBlackList';



const options = [
  { value: 'Blacklist Web', label: 'Blacklist Web' },
  { value: 'Blacklist Báo', label: 'Blacklist Báo' },
  { value: 'Blacklist Social', label: 'Blacklist Social' },
]


export default function PageBlacklistDomain() {
  const dispatch = useDispatch()

  const dataCam = useSelector(state => state.base.data_cam)
  const current_id_cam = useSelector(state => state.base.current_id_cam)

  const handleGetBlackListByIdCam = () => {
    ajaxCallGet(`get-black-list-by-id-cam/${current_id_cam}`).then(rs => {
      dispatch(changeDataBlackList([...rs]))
    }).catch(err => console.log(err))
  }
  
  return (
    <div style={{ height: '77vh', width: '70%', margin: 'auto', border: '1px solid #ccc', borderRadius: '5px', padding: '8px', overflow: 'auto' }}>
      <div className='right-container position-relative'>
        <div
          className='row px-4 d-flex align-items-center justify-content-between position-sticky'
          style={{ top: '0', padding: '10px', background: '#fff' }}
        >
          <div className='col-8'>
            <span className='fs-7 fw-bolder'>Danh sách blackList:  </span>
            <a href='#' className='mr-2'>
            </a>
          </div>
          <div className='col-4 d-flex flex-row justify-content-end'>
            <div className='col-4 delete'>
              {current_id_cam && <NhapExcel />}
            </div>
            <div className='col-4 delete'>
              {current_id_cam && <ModalAddBlackList handleGetBlackListByIdCam={handleGetBlackListByIdCam} />}
            </div>
            <div className='col-4 delete'>
              {current_id_cam && <XoaBlackList />}
            </div>

          </div>
        </div>
        <div className='p-3'>
          <DanhSachBlackList />
        </div>
      </div>
    </div>
  )
}
