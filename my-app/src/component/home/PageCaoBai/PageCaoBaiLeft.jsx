import React from 'react'
import { useSelector } from 'react-redux'

import BatDauCao from './BatDauCao'
import DungCaoBai from './DungCaoBai'
import DanhSachKey from './DanhSachKey'

const PageCaoBaiLeft = (props) => {
    const { value_stop_ref, set_value_stop_ref, get_value_stop_ref } = props;
    const data_current_id_cam = useSelector(state => state.base.current_id_cam)

    return (
        <div className='col-3 left' style={{ height: '77vh' }}>
            <div
                className='left-container position-relative'
                style={{ overflowY: 'scroll', padding: '0 16px' }}
            >
                <div className='button-key d-flex justify-content-between align-items-center position-sticky'
                    style={{ zIndex: '10000', top: 0, background: '#fff', padding: '16px 0' }}>
                    <div>
                        <span className='fs-7 fw-bolder'>Danh sách câu hỏi</span>
                    </div>
                    <div className='d-flex justify-content-between align-items-center'>
                        {data_current_id_cam && <BatDauCao value_stop_ref={value_stop_ref} set_value_stop_ref={set_value_stop_ref} get_value_stop_ref={get_value_stop_ref}/>}
                        {data_current_id_cam && <DungCaoBai value_stop_ref={value_stop_ref} set_value_stop_ref={set_value_stop_ref} get_value_stop_ref={get_value_stop_ref}/>}
                        
                    </div>
                </div>
                <DanhSachKey />
            </div>
        </div>
    )
}

export default PageCaoBaiLeft