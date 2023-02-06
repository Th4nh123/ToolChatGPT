import React from 'react'
import useStateRef from 'react-usestateref'
import { useSelector } from 'react-redux'

import CaoLai from './CaoLai'
import LayUrl from './LayUrl'
import XoaUrl from './XoaUrl'
import XoaData from './XoaData'
import DanhSachUrl from './DanhSachUrl'
import LayUrlNew from './LayUrlNew'

const PageCaoBaiRight = (props) => {
    const { value_stop_ref, set_value_stop_ref, get_value_stop_ref } = props;
    const data_current_id_cam = useSelector(state => state.base.current_id_cam)
    const data_trang_thai_cam = useSelector(state => state.base.data_trang_thai_cam)

    const [
        current_key_ref,
        set_current_key_ref,
        get_current_key_ref
    ] = useStateRef(null)

    return (
        <div className='col-9 right' style={{ height: '77vh' }}>
            <div className='right-container position-relative' style={{ overflowY: 'scroll' }}>
                <div
                    className='row px-4 d-flex align-items-center justify-content-between position-sticky'
                    style={{ top: '0', padding: '10px', background: '#fff' }}
                >
                    <div className='col-7'>
                        <span className='fs-7 fw-bolder'>Câu trả lời: </span>
                        <span className='mr-2 ky-hieu' style={{ fontWeight: 'bolder', color: 'blue', padding: '12px' }}>

                        </span>
                        {data_current_id_cam && <span className="status-stop">Dừng cào</span>}
                        {data_current_id_cam && <span className="status-pedding icon-status d-none">Đang cào</span>}
                        {data_current_id_cam && <span style={{ color: 'green', fontWeight: 'bold' }} className="status-get-url d-none ">Đang lấy URL </span>}
                    </div>
                    <div className='col-5 d-flex flex-row justify-content-end'>

                        {data_current_id_cam && !data_trang_thai_cam && <CaoLai value_stop_ref={value_stop_ref} set_value_stop_ref={set_value_stop_ref} get_value_stop_ref={get_value_stop_ref} />}
                        {data_current_id_cam && !data_trang_thai_cam && <LayUrlNew />}
                        {data_current_id_cam && !data_trang_thai_cam && <XoaUrl />}
                        {data_current_id_cam && !data_trang_thai_cam && <XoaData />}
                    </div>
                </div>
                <DanhSachUrl />
            </div>
        </div>
    )
}

export default PageCaoBaiRight