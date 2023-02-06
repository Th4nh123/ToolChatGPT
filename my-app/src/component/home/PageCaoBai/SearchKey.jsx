import React from 'react'
import $ from 'jquery'
import { useSelector, useDispatch } from 'react-redux';
import { ajaxCallGet } from '../../libs/base';
import { changeDataKey } from '../../reducer_action/BaseReducerAction';

const SearchKey = () => {
    const dispatch = useDispatch();
    const data_current_id_cam = useSelector(state => state.base.current_id_cam)

    const handleGetKeyByIdCam = (id) => {
        ajaxCallGet(`get-key-by-id-cam/` + id).then(rs => {
            $('.box-note-default').addClass('d-flex');
            $('.box-note-default').removeClass('d-none');
            $('.box-note-all').addClass('d-none');
            $('.box-note-all').removeClass('d-flex');
            dispatch(changeDataKey([...rs]));
        }).catch(err => console.log(err))
    }

    /**
     *  Tìm kiếm key theo tên
     *
     * @param name_key: tên của key
     * @author XHieu
     */
    const findLikeKey = name_key => {
        if (name_key === '') {
            if (data_current_id_cam) {
                handleGetKeyByIdCam(data_current_id_cam)
            }
        } else {
            if (data_current_id_cam) {
                ajaxCallGet('find-key/' + name_key).then(async rs => {
                    let arr = await rs.filter((item) => {
                        return item.id_cam === data_current_id_cam;
                    })
                    dispatch(changeDataKey([...arr]))
                }).catch(err => console.log(err))
            } else {
                ajaxCallGet('find-key/' + name_key).then(rs => {
                    dispatch(changeDataKey([...rs]))
                }).catch(err => console.log(err))
            }

        }
    }

    return (
        <div
            className='search-key d-flex align-items-center'
            style={{ width: '100%' }}
        >
            <i
                className='fa-solid fa-magnifying-glass'
                style={{ width: '10%' }}
            />
            <input
                type='text'
                onChange={function (event) {
                    findLikeKey(event.target.value)
                }}
                placeholder='Tìm kiếm Key'
                style={{ width: '90%', outline: 'none' }}
            />
        </div>
    )
}

export default SearchKey