import React from 'react'
import $ from 'jquery'
import { useSelector, useDispatch } from 'react-redux';

import { changeDataKey } from '../../reducer_action/BaseReducerAction';
import { ajaxCallGet } from '../../libs/base';
import { Const_Libs } from '../../libs/Const_Libs'

const DetailGhichu = () => {
    const dispatch = useDispatch();
    const data_current_id_cam = useSelector(state => state.base.current_id_cam)

    const handleGetKeyByIdCam = (id) => {
        ajaxCallGet(`get-key-by-id-cam/` + id).then(rs => {
            
            dispatch(changeDataKey([...rs]));
        }).catch(err => console.log(err))
    }

    const handleGetKeyNoneUrl = async () => {
        if (data_current_id_cam) {
            Const_Libs.TOAST.success("Vui lòng đợi trong giây lát")
            await ajaxCallGet(`get-key-none-url/${data_current_id_cam}`)
                .then(rs => {
                    console.log(rs);
                    if (rs.length === 0) {
                        Const_Libs.TOAST.success("Chiến dịch này đã có URL hết rồi")
                    } else {
                    
                        dispatch(changeDataKey([...rs]))
                    }
                }).catch(err => console.log(err)).finally(() => {
                    Const_Libs.TOAST.success("Hoàn thành")
                })
        } else {
            Const_Libs.TOAST.error("Vui lòng chọn chiến dịch trước khi thao tác,")
        }
    }
    return (
        <ul className='d-flex justify-content-start align-items-center' style={{ marginTop: '16px', padding: 0 }}>
            <li className='d-flex align-items-center me-3 box-note box-note-all' onClick={e => handleGetKeyByIdCam(data_current_id_cam)} style={{ cursor: 'pointer'}}><span className='box-color box-key-all' style={{ background: '#000' }}></span>All</li>
            <li className='d-flex align-items-center me-3 box-note box-note-default' onClick={e => handleGetKeyNoneUrl()} style={{ cursor: 'pointer' }}><span className='box-color box-default'></span>None URL</li>
            <li className='d-flex align-items-center me-3 box-note'><span className='box-color box-running'></span>Đang cào</li>
            <li className='d-flex align-items-center me-3 box-note'><span className='box-color box-finish'></span>Đã cào</li>
            <li className='d-flex align-items-center me-3 box-note'><span className='box-color box-choosing'></span>Đang chọn</li>
        </ul>
    )
}

export default DetailGhichu