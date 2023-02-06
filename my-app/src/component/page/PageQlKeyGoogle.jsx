import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DanhSachKeyGg from '../home/PageKeyGoogle/DanhSachKeyGg'
import TestKeyGg from '../home/PageKeyGoogle/TestKeyGg'
import ThemKeyGgExcel from '../home/PageKeyGoogle/ThemKeyGgExcel'
import XoaKeyGg from '../home/PageKeyGoogle/XoaKeyGg'
import { ajaxCallGet } from '../libs/base'
import ModalAddKeyGoogle from '../modal/ModalAddKeyGoogle'
import { changeDataKeyGoogle } from '../reducer_action/BaseReducerAction'

const PageQlKeyGoogle = () => {
    const dispatch = useDispatch();
    const dataKeyGoogle = useSelector(state => state.base.data_key_google)

    const handleGetAllKeyGg = async () => {
        await ajaxCallGet(`get-all-key-google`).then(async rs => {
            dispatch(changeDataKeyGoogle([...rs]))
        }).catch(err => console.log(err))
    }

    return (
        <div style={{ height: '77vh', width: '900px', margin: 'auto', border: '1px solid #ccc', borderRadius: '5px', padding: '8px' }}>
            <div className='right-container position-relative'>
                <div
                    className='row px-4 d-flex align-items-center justify-content-between position-sticky'
                    style={{ top: '0', padding: '10px', background: '#fff' }}
                >
                    <div className='col-7'>
                        <span className='fs-7 fw-bolder'>Danh sách Key Api: </span>
                        <a href='#' className='mr-2'>

                        </a>
                    </div>
                    <div className='col-5 d-flex flex-row justify-content-end'>
                        <div className='col-4 delete'>
                            <ThemKeyGgExcel handleGetAllKeyGg={handleGetAllKeyGg} />
                        </div>
                        <div className='col-3 delete'>
                            <ModalAddKeyGoogle handleGetAllKeyGg={handleGetAllKeyGg} />
                        </div>
                        <div className='col-5 delete'>
                            <TestKeyGg />
                        </div>
                        <div className='col-3 delete'>
                            <XoaKeyGg handleGetAllKeyGg={handleGetAllKeyGg} />
                        </div>
                    </div>
                </div>
                <div className='p-3 table-responsive'>
                    <DanhSachKeyGg />
                </div>
            </div>
        </div>
    )
}

export default PageQlKeyGoogle