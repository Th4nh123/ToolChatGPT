import React, { useState } from 'react'
import { OutTable, ExcelRenderer } from 'react-excel-renderer'
import { Const_Libs } from '../../libs/Const_Libs'
import { ajaxCallGet, ajaxCallPost } from '../../libs/base'


const ThemKeyYtExcel = (props) => {
    const { handleGetAllKeyYt } = props;
    const [isUploading, setUploading] = useState(false);

    const fileHandler = event => {
        let fileObj = event.target.files[0]
        setUploading(true);

        ExcelRenderer(fileObj, async (err, resp) => {
            if (err) {
                setUploading(false);
                console.log(err)
            } else {
                let arr = []
                console.log(resp.rows)
                await resp.rows.map(async item => {
                    await arr.push({
                        key_api: item[0]?.trim(),
                        description: item[1] ? item[1].trim() : ''
                    })
                })
                console.log(arr);
                await ajaxCallPost(`save-key-youtube`, arr).then(async rs => {
                    await handleGetAllKeyYt()
                    Const_Libs.TOAST.success('Thêm thành công')
                }).catch(err => Const_Libs.TOAST.console.error('Thêm thất bại'))
            }
        })
    }
    return (
        <label htmlFor='inputTagKeyYt' style={{ marginRight: '10px' }}>
            <span className='btn btn-primary fw-bolder' style={{ fontSize: '14px', width: '100px' }}>Nhập Excel</span>
            <input
                id='inputTagKeyYt'
                key={isUploading}
                type='file'
                onChange={e => fileHandler(e)}
                style={{ display: 'none' }}
            />
        </label>
    )
}

export default ThemKeyYtExcel