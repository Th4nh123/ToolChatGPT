import React, { useState } from 'react'
import $ from 'jquery'
import { useSelector, useDispatch } from 'react-redux';
import useStateRef from 'react-usestateref'

import { changeCheckKey, changeCurrentIdKey, changeDataKey, changeDataUrl, changeTrangThaiCam } from '../../reducer_action/BaseReducerAction';
import { ajaxCallGet, ajaxCallPost, URL_API_GET } from '../../libs/base';
import { Const_Libs } from '../../libs/Const_Libs'

const CaoLai = (props) => {
    const dispatch = useDispatch();

    const { value_stop_ref, set_value_stop_ref, get_value_stop_ref } = props;

    const data_trang_thai_cam = useSelector(state => state.base.data_trang_thai_cam);

    const [current_id_key, set_current_id_key, get_current_id_key] = useStateRef(
        null
    )

    const [data_url_ref, set_data_url_ref, get_data_url_ref] = useStateRef('')

    const [
        current_key_ref,
        set_current_key_ref,
        get_current_key_ref
    ] = useStateRef(null)

    const [
        current_url_ref,
        set_current_url_ref,
        get_current_url_ref
    ] = useStateRef()

    const dataKey = useSelector(state => state.base.data_key)
    const checkKey = useSelector(state => state.base.check_key)

    const data_current_id_cam = useSelector(state => state.base.current_id_cam)
    const handleUpdateCam = (id) => {
        ajaxCallGet(`update-cam/${id}`).then(async rs => {
            await dispatch(changeTrangThaiCam(true));
            Const_Libs.TOAST.success("Chiến dịch này đang được chạy")
        }).catch(err => console.log(err))
    }

    const handleResetCam = (id) => {
        ajaxCallGet(`reset-cam/${id}`).then(async rs => {
            await dispatch(changeTrangThaiCam(false));
            Const_Libs.TOAST.success("Chiến dịch này đã được dừng lại, vui lòng đợi chạy nốt URL này")
        }).catch(err => console.log(err))
    }

    const handleResetUrl = async (id_key) => {
        await ajaxCallGet(`reset-url/${id_key}`)
            .then(rs => {
                console.log(`resset url cua ${id_key} thanh cong`)
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

    const handleGetKey = () => {
        ajaxCallGet('get-key').then(rs => {
            dispatch(changeDataKey([...rs]))
        }).catch(err => console.log(err))
    }

    const deletePostByIdKey = async (id_key) => {
        await ajaxCallGet(`delete-post-by-id-key/${id_key}`)
            .then(async rs => {
                await handleResetKey(id_key);
                await handleResetUrl(id_key);
                console.log(`Xoa post cua key co id ${id_key} thanh cong`);
            }).catch(err => console.log(err))
    }


    /**
* Lấy ra danh sách Url theo key
*
* @param id_key
* @author XHieu
*/
    const handleGetUrlByKey = async id_key => {
        let result = [];
        let key = dataKey.filter(item => item.id == id_key)
        set_current_key_ref(key[0])
        dispatch(changeCurrentIdKey(id_key))
        await fetch(URL_API_GET + `get-url-by-id-key/` + id_key)
            .then(response => response.json())
            .then(async rs => {
                await dispatch(changeDataUrl([...rs]));
                result = [...rs];
            })
            .catch(err => {
                console.log(err);
            })
        return result;
        // let key = dataKey.filter(item => item.id == id_key)
        // set_current_key_ref(key[0])
        // set_current_id_key(id_key)
        // dispatch(changeCurrentIdKey(id_key))
        // return await ajaxCallGet('get-url-by-id-key/' + id_key).then(rs => {
        //     // for (let i = 0; i < rs.length; i++) {
        //     //     rs[i].state = 'create'
        //     // }
        //     dispatch(changeDataUrl([...rs]))
        //     return rs
        // })
    }

    const handleGetKeyByIdCam = (id) => {
        ajaxCallGet(`get-key-by-id-cam/` + id).then(rs => {
            $('.box-note-default').addClass('d-flex');
            $('.box-note-default').removeClass('d-none');
            $('.box-note-all').addClass('d-none');
            $('.box-note-all').removeClass('d-flex');
            dispatch(changeDataKey([...rs]));
        }).catch(err => console.log(err));
    }

    const handleCaoLai = async () => {
        if (!data_trang_thai_cam) {
            let status = 1;
            handleUpdateCam(data_current_id_cam);
            set_value_stop_ref('pendding')
            var check_key_api = 0;
            for (let x = 0; x < checkKey.length; x++) {
                await deletePostByIdKey(checkKey[x]);

                let indexKey = document.querySelector(`.input-key-${checkKey[x]}`).getAttribute('data-index-key');
                let data = await handleGetUrlByKey(checkKey[x])
                $('.icon-status').removeClass('d-none')
                $('.status-stop').addClass('d-none')

                $(`.label-key-${checkKey[x]}`).addClass('pendding')
                let sl_bai_da_cao = 0
                for (let i = 0; i < data.length; i++) {
                    if (get_value_stop_ref.current === 'stop') {
                        $('.icon-status').addClass('d-none')
                        $('.status-stop').removeClass('d-none')
                        $(`.label-key-${checkKey[x]}`).removeClass('pendding')
                        handleGetKeyByIdCam(data_current_id_cam)
                        return 0
                    }
                    let body = {
                        id: data[i].id,
                        url: data[i].url,
                        id_key: data[i].id_key,
                        check: data[i].check
                    }
                    $('.sspinner')
                        .eq(i)
                        .removeClass('d-none')
                    set_current_url_ref(data[i].url)
                    await ajaxCallPost('tool-clone', body)
                        .then(rs => {
                            if (rs.code == 200) {
                                data[i].check = true
                                data[i].post_name = rs.post_name
                                sl_bai_da_cao += 1
                            }
                        })
                        .catch(err => {
                            console.log(err)
                        })
                    $('.sspinner')
                        .eq(i)
                        .addClass('d-none')
                    set_data_url_ref(data)
                    handleGetUrlByKey(dataKey[indexKey].id);

                }

                $('.icon-status').addClass('d-none')
                $('.status-stop').removeClass('d-none')
                $(`.label-key-${checkKey[x]}`).removeClass('pendding')
                if (sl_bai_da_cao >= 0) {
                    await ajaxCallGet('update-key/' + checkKey[x]).catch(err => {
                        console.log(err);
                    }).catch(err => console.log(err))
                    dataKey[indexKey].check = true
                }
                if (status === 1) continue;
            }
            $('#check-key-all').prop('checked', false);
            dispatch(changeCheckKey([]))
            status = 0;
            handleResetCam(data_current_id_cam);
            dispatch(changeDataKey([...dataKey]))
            Const_Libs.TOAST.success(
                'Các key đã được cào hết.'
            )
        } else {
            Const_Libs.TOAST.error('Vui lòng dừng chiến dịch trước khi thực hiện thao tác này!')
        }

    }


    const checkVideo = async (id_key) => {
        let result = [];
        await ajaxCallGet(`check-video/${id_key}`).then(async rs => {
            result = rs;
        }).catch(err => console.log(err))
        return result;
    }

    return (
        <div className='delete' style={{ display: 'flex' }}>
            <button
                type='button'
                onClick={() => {
                    handleCaoLai()
                }}
                className='fw-bolder active btn btn-outline-primary me-2 start-cao-lai d-none'
                style={{ fontSize: '14px', minWidth: '70px' }}
            >
                Cào lại
            </button>
        </div>
    )
}

export default CaoLai