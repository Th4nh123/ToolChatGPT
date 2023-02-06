import { useSelector } from 'react-redux'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

import '../../css/style.css'
import NhapExcel from '../home/PageQLKey/NhapExcel'
import XoaKey from '../home/PageQLKey/XoaKey'
import DanhSachKey from '../home/PageQLKey/DanhSachKey'
import { ajaxCallGetUrlTest } from '../libs/base'



export default function PageQLKeyNew() {
    const data_current_id_cam = useSelector(state => state.base.current_id_cam);

    return (
        <div style={{ height: '77vh', width: '100%', margin: 'auto', border: '1px solid #ccc', borderRadius: '5px', padding: '8px', overflow: 'auto' }}>
            <div className='right-container position-relative'>
                <div
                    className='row px-4 d-flex align-items-center justify-content-between position-sticky'
                    style={{ top: '0', padding: '10px', background: '#fff' }}
                >
                    <div className='col-9'>
                        <span className='fs-7 fw-bolder'>Danh sách câu hỏi:  </span>
                        <a href='#' className='mr-2'>

                        </a>
                    </div>
                    <div className='col-3 d-flex flex-row justify-content-end'>
                        <div className='col-4 delete'>
                            {data_current_id_cam && <NhapExcel />}
                        </div>
                        <div className='col-4 delete'>
                            {data_current_id_cam && <XoaKey />}
                        </div>
                    </div>
                </div>
                <div className='p-3 '>
                    <DanhSachKey />
                </div>
            </div>
        </div>

    )
}

