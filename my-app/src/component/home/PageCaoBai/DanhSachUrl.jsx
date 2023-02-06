import React, { useEffect } from 'react'
import $ from 'jquery'
import { useSelector, useDispatch } from 'react-redux';

import { URL_API_WEB } from '../../libs/base'
import DetailPost from './DetailPost';

const DanhSachUrl = () => {
    const dispatch = useDispatch();

    const data_url = useSelector(state => state.base.data_url)

    useEffect(() => {
        $('#checkAll').click(function () {
            if ($(this).prop('checked')) {
                $('input[name="checkbox-url"]').prop('checked', true)
            } else {
                $('input[name="checkbox-url"]').prop('checked', false)
            }
        })
    }, [])

    return (
        <div className='p-3 table-responsive'>
            <table className='table '>
                <colgroup>
                    <col style={{ width: '5%!important' }}></col>
                    <col style={{ width: '5%!important' }}></col>
                    <col style={{ width: '40%!important' }}></col>
                    <col style={{ width: '40%!important' }}></col>
                </colgroup>
                <thead>
                    <tr>
                        <th>
                            <input type='checkbox' id='checkAll' />
                        </th>
                        <th />
                        <th style={{ textAlign: 'center' }}>Câu trả lời</th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {data_url.length <= 0 ? (
                        <tr><td>Không có câu trả lời</td></tr>
                    ) : (
                        data_url.map((item, index) => {
                            return (

                                <tr>
                                    <td style={{ maxHeight: '21px', width: '2%' }}>
                                        <input
                                            type='checkbox'
                                            name='checkbox-url'
                                            data-id-url={item.id}
                                        />
                                    </td>
                                    <td style={{
                                        maxHeight: '21px',
                                        width: '1%',
                                        textAlign: 'center'
                                    }} />
                                    <td
                                        style={{
                                            maxHeight: '21px',
                                            width: '25%',
                                            textAlign: 'center'
                                        }}
                                    >
                                        {item.answer}
                                    </td>
                                    <td style={{
                                        maxHeight: '21px',
                                        width: '1%',
                                        textAlign: 'center'
                                    }} />
                                </tr>
                            )
                        })
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default DanhSachUrl