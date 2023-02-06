import React from 'react'
import { useSelector, useDispatch } from 'react-redux';

import { ajaxCallGet, ajaxCallGetUrl, ajaxCallPost, getHostname, getHostname2 } from '../../libs/base'
import { changeCheckKey } from '../../reducer_action/BaseReducerAction';

const LayUrl = () => {
    const dispatch = useDispatch();
    const data_current_id_cam = useSelector(state => state.base.current_id_cam)


    const handleGetUrl = async () => {
        const black_list = new Map()

        await ajaxCallGet(`get-black-list-by-id-cam/${data_current_id_cam}`).then(rs => {
            console.log("Lay blackKey");
            rs.map((item, index) => {
                black_list.set(getHostname2(item.domain), index)
            })
        }).catch(err => console.log(err))
        for (const checkbox of document.querySelectorAll('input[name="key"]')) {
            if (checkbox.checked) {
                let id_key = checkbox.getAttribute('data-id-key')
                let name_key = checkbox.getAttribute('data-name-key')
                await ajaxCallGet(`get-url-by-id-key2/${id_key}`)
                    .then(async rs => {
                        var url_all = []
                        let arr
                        if (rs.length > 0) {
                            checkbox.checked = false;
                            document.querySelector('input[name="key-all"]').checked = false;
                            console.log("Co nhieu URL hon 25, khong lam gi ca")
                            return;
                        } else {
                            ajaxCallGet(`get-ky-hieu/${id_key}`).then(rs => {
                                if(rs.length > 0) {
                                    // PhanTich(rs[0].ky_hieu, name_key)
                                }
                            }).catch(err => console.log(err))
                        }

                    }).catch(err => console.log(err))
            }
        }
        dispatch(changeCheckKey([]))
        document.querySelector('input[name="key-all"]').checked = false;

    }
    return (
        <div className='col-3 delete'>
            <button
                type='button'
                className='fw-bolder btn btn-outline-primary btn-lay-url'
                onClick={() => handleGetUrl()}
                style={{ fontSize: '14px' }}
                disabled='true'
            >
                Lấy URL
            </button>
        </div>
    )
}

export default LayUrl