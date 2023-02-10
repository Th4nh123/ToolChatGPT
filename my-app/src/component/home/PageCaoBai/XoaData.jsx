import React, { useState } from 'react'
import $ from 'jquery'
import { useDispatch, useSelector } from 'react-redux'
import { ajaxCallGet } from '../../libs/base'
import { Const_Libs } from '../../libs/Const_Libs'
import { changeCheckKey, changeCurrentIdKey, changeDataKey, changeDataKeyHaveGoogle, changeDataKeyHaveVideo, changeDataUrl } from '../../reducer_action/BaseReducerAction'

const XoaData = () => {
    const dispatch = useDispatch()
    const current_id_key = useSelector(state => state.base.current_id_key)
    const data_current_id_cam = useSelector(state => state.base.current_id_cam)
    const dataKey = useSelector(state => state.base.data_key)
    const checkKey = useSelector(state => state.base.check_key)

    const handleGetKeyByIdCam = (id) => {
        ajaxCallGet(`get-key-by-id-cam/` + id).then(rs => {
            $('.box-note-default').addClass('d-flex');
            $('.box-note-default').removeClass('d-none');
            $('.box-note-all').addClass('d-none');
            $('.box-note-all').removeClass('d-flex');
            dispatch(changeDataKey([...rs]));
        }).catch(err => console.log(err))
    }

    const handleGetKey = () => {
        ajaxCallGet('get-key').then(rs => {
            dispatch(changeDataKey([...rs]))
        }).catch(err => console.log(err))
    }


    const handleResetKey = idKey => {
        if (data_current_id_cam) {
            ajaxCallGet('reset-key/' + idKey).then(rs => {
                handleGetKeyByIdCam(data_current_id_cam)
            }).catch(err => console.log(err))
        } else {
            ajaxCallGet('reset-key/' + idKey).then(rs => {
                handleGetKey()
            }).catch(err => console.log(err))
        }
    }

    const handleGetUrlByKey = async id_key => {
        let key = dataKey.filter(item => item.id === id_key)
        // set_current_key_ref(key[0])
        dispatch(changeCurrentIdKey(id_key))
        return await ajaxCallGet('get-url-by-id-key/' + id_key).then(rs => {
            for (let i = 0; i < rs.length; i++) {
                rs[i].state = 'create'
            }
            dispatch(changeDataUrl([...rs]))
            return rs
        }).catch(err => console.log(err))
    }

    const handleClearDataByCheckBox = async () => {
        if (data_current_id_cam) {
            if (checkKey.length > 0) {
                $('.spin-clear-data').removeClass('d-none')
                for (const checkbox of document.querySelectorAll('input[name="key"]')) {
                    if (checkbox.checked) {
                        let id_key = checkbox.getAttribute('data-id-key')

                        await ajaxCallGet('delete-url-by-id-key/' + id_key).then(rs => {
                            // handleResetKey(id_key)
                            // handleGetUrlByKey(id_key)
                        }).catch(err => console.log(err))
                    }
                }
                document.querySelector('input[name="key-all"]').checked = false;
                $('.spin-clear-data').addClass('d-none')
                // setTimeout(() => {
                //     getDataIdHaveVideo(data_current_id_cam)
                //     getDataIdHaveUrlGoogle(data_current_id_cam)
                //     dispatch(changeCheckKey([]))
                //     Const_Libs.TOAST.success('Xóa data của Key thành công')
                // }, 1000)
            } else {
                Const_Libs.TOAST.error('Vui lòng chọn key trước khi thực hiện thao tác này')
            }
        } else {
            Const_Libs.TOAST.error('Vui lòng chọn chiến dịch trước khi thực hiện thao tác này!!!')
        }
    }

    return (
        <div className='col-3 delete' style={{ marginLeft: '12px' }}>
            <button
                type='button'
                onClick={() => {
                    handleClearDataByCheckBox()
                }}
                className='fw-bolder btn btn-outline-danger'
                style={{ fontSize: '14px' }}
            >
                <span className="spinner-border spinner-border-sm d-none spin-clear-data" style={{ marginRight: '3px' }}></span>
                Clear Data
            </button>

        </div>
    )
}

export default XoaData