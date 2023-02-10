import React from 'react'
import { useSelector } from 'react-redux'

import BatDauCao from './BatDauCao'
import DungCaoBai from './DungCaoBai'
import DanhSachKey from './DanhSachKey'

const PageCaoBaiLeft = (props) => {

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
                    </div>
                </div>
                <DanhSachKey />
            </div>
        </div>
    )
}

export default PageCaoBaiLeft