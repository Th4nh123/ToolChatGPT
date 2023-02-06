import React from 'react'
import $ from 'jquery'
import { useDispatch, useSelector } from 'react-redux';

import { ajaxCallGet } from '../../libs/base';
import { changeDataSpinWord } from '../../reducer_action/BaseReducerAction';
import { Const_Libs } from '../../libs/Const_Libs';


const XoaSpin = () => {
    const dispatch = useDispatch()
    const current_id_cam = useSelector(state => state.base.current_id_cam)

    const handleGetSpinByIdCam = () => {
        ajaxCallGet(`get-spin-word-by-id-cam/${current_id_cam}`).then(rs => {
            dispatch(changeDataSpinWord([...rs]))
        }).catch(err => console.log(err))
    }
    const deleteSpinByCheckBox = async () => {
        for (const checkbox of document.querySelectorAll(
            'input[name="checkbox-spin"]'
        )) {
            if (checkbox.checked) {
                await ajaxCallGet(
                    'delete-spin-word/' + checkbox.getAttribute('data-id-spin')
                ).then(rs => {
                    checkbox.checked = false;
                }).catch(err => console.log(err))
            }
        }
        handleGetSpinByIdCam();
        Const_Libs.TOAST.success('Đã xóa thành công.')
    }

    const deleteAllSpinByCheckBox = () => {
        ajaxCallGet(`delete-all-spin-word/${current_id_cam}`).then(rs => {
            $('#checkbox-all-spin').prop('checked', false);
            $('.btn-delete-all-spin').addClass('d-none')
            $('.btn-delete-spin').removeClass('d-none')
            Const_Libs.TOAST.success('Đã xóa thành công.')
            handleGetSpinByIdCam();
        }).catch(err => console.log(err))
    }

    return (
        <>
            <button type="button"
                className="d-none btn-delete-all-spin btn btn-primary me-3 fw-bolder"
                style={{ fontSize: '14px' }}
                onClick={(e) => deleteAllSpinByCheckBox()}
            >
                Xóa hết
            </button>
            <button type="button"
                className="btn-delete-spin btn btn-primary me-3 fw-bolder"
                style={{ fontSize: '14px' }}
                onClick={(e) => deleteSpinByCheckBox()}
            >
                Xóa
            </button>
        </>
    )
}

export default XoaSpin