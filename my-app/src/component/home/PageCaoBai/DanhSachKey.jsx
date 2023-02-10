import React, { useState, useEffect } from 'react'
import $, { data } from 'jquery'
import { useDispatch, useSelector } from 'react-redux'
import useStateRef from 'react-usestateref'

import { ajaxCallGet, CX_SEARCH, LINK_SEARCH } from '../../libs/base'
import { changeCheckKey, changeCurrentIdKey, changeDataKeyHaveGoogle, changeDataKeyHaveVideo, changeDataUrl } from '../../reducer_action/BaseReducerAction'
import SearchKey from './SearchKey'


const DanhSachKey = () => {
    const dispatch = useDispatch();
    const current_id_cam = useSelector(state => state.base.current_id_cam)

    const [
        current_key_ref,
        set_current_key_ref,
        get_current_key_ref
    ] = useStateRef(null)

    const current_id_key = useSelector(state => state.base.current_id_key)
    const dataKey = useSelector(state => state.base.data_key)
    const checkKey = useSelector(state => state.base.check_key)
    const data_key_have_video = useSelector(state => state.base.data_key_have_video);
    const data_key_have_url_google = useSelector(state => state.base.data_key_have_google);
    /**
       * Thay đổi nút bắt đầu cào và cào lại, 
       *
       * @param checkKey
       * @author THieu
       */
    useEffect(() => {
        if (checkKey.length !== 0) {
            $('.start-cao-lai').removeClass('d-none')
        } else {
            $('.start-cao-lai').addClass('d-none')
        }
    }, [checkKey.length])

    const handleGetUrlByKey = async id_key => {
        let key = dataKey.filter(item => item.id == id_key)
        set_current_key_ref(key[0])
        // set_current_id_key(id_key)
        dispatch(changeCurrentIdKey(id_key))
        return await ajaxCallGet('get-url-by-id-key/' + id_key).then(rs => {
            for (let i = 0; i < rs.length; i++) {
                rs[i].state = 'create'
            }
            dispatch(changeDataUrl([...rs]))
            return rs
        }).catch(err => console.log(err))
    }

    const addRemoveCheck = (id) => {
        const isChecked = checkKey.includes(id);
        if (isChecked) {
            return checkKey.filter(item => item !== id)
        } else {
            return [...checkKey, id]
        }

    }

    const handleChangeCheckBoxKey = (id) => {
        dispatch(changeCheckKey(addRemoveCheck(id)))
    }

    const handleCheckKeyAll = () => {
        if ($('#check-key-all').prop('checked')) {
            getIdKey();
            $('.start-cao-lai').removeClass('d-none')
            $('input[name="key"]').prop('checked', true)
        } else {
            dispatch(changeCheckKey([]));
            $('.start-cao-lai').addClass('d-none')
            $('input[name="key"]').prop('checked', false)
        }
    }

    const getIdKey = async () => {
        let arr = [];
        await ajaxCallGet(`get-id-key/${current_id_cam}`).then(async rs => {
            await rs.map(item => {
                arr.push(item.id)
            })
        }).catch(err => console.log(err))
        dispatch(changeCheckKey([...arr]));
    }
    return (
        <>
            <div className='d-flex align-items-cente position-sticky  align-items-center'
                style={{ zIndex: '10000', background: '#fff', top: '56px' }}
            >
                <div className=''>
                    <input
                        style={{ width: '18px', height: '18px' }}
                        id='check-key-all'
                        type='checkbox'
                        name='key-all'
                        onClick={() => handleCheckKeyAll()}
                        className='me-2 input-key-all'
                    />
                </div>
                <SearchKey />
            </div>
            <div className='list-key' style={{ position: 'relative' }}>
                {dataKey.length == 0 ? <span>Không tồn tại key</span> : ''}
                {dataKey.map((item, index) => {
                    let label_key = `label-key-${item.id}`
                    let input_key = `input-key-${item.id}`
                    return (

                        <div
                            className='item d-flex align-items-center mt-1 mb- fw-bolder'
                            style={{ fontSize: '14px', padding: '3px 0' }}
                            key={label_key}
                        >
                            <input
                                id='key_word'
                                type='checkbox'
                                name='key'
                                data-id-key={item.id}
                                className={`me-2 input-key ${input_key}`}
                                data-name-key={item.key_cha}
                                checked={checkKey.includes(item.id)}
                                onChange={() => handleChangeCheckBoxKey(item.id)}
                            />
                            <label
                                style={{ marginLeft: '8px', cursor: 'pointer' }}
                                htmlFor
                                className={
                                    item.check == true
                                        ? `h-100 mt-2 text-primary label-key ${label_key}`
                                        : `h-100 mt-2 label-key ${label_key}`
                                }
                                data-id-key={item.id}
                                id={
                                    current_id_key === item.id
                                        ? 'text-green'
                                        : ''
                                }
                                onClick={() => {
                                    handleGetUrlByKey(item.id)
                                }}
                            >

                                {index + 1}. {item.key_cha}
                            </label>
                            <span
                                // className={get_current_id_key.current === item.id ? 'fa-regular fa-circle-play color-primary' : ''}
                                style={{ fontSize: '13px', position: 'absolute', right: '16px', color: '#605c5c' }}
                            >
                            </span>
                        </div>
                    )
                })}
            </div>
        </>
    )
}
export default DanhSachKey