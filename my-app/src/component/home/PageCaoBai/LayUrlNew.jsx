import axios from 'axios';
import $ from 'jquery'
import React from 'react'
import { useEffect } from 'react';
import { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { ajaxCallGet, ajaxCallPost, CX_SEARCH, getHostname, getHostname2, LINK_SEARCH, URL_API_GET } from '../../libs/base'
import { Const_Libs } from '../../libs/Const_Libs';
import { changeCheckKey, changeDataKeyGoogle, changeDataKeyHaveGoogle, changeDataKeyHaveVideo, changeDataKeyYoutube, changeKeyGoogle } from '../../reducer_action/BaseReducerAction';

const LayUrlNew = () => {
    const dispatch = useDispatch();
    const data_current_id_cam = useSelector(state => state.base.current_id_cam)
    const data_key_checked = useSelector(state => state.base.check_key)
    const dataKey = useSelector(state => state.base.data_key)
    const dataKeyGoogle = useSelector(state => state.base.data_key_google)

    const TestKeyGoogle = async () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${dataKeyGoogle[0].key_api}`);

        var raw = JSON.stringify({
            "model": "text-davinci-003",
            "prompt": "Tôi là ai",
            "max_tokens": 100,
            "temperature": 0,
            "logprobs": 10
        });
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://api.openai.com/v1/completions", requestOptions)
            .then(response => response.text())
            .then(async result => {
                let answer = JSON.parse(result)
                $('.spin-get-answer').addClass('d-none')
                $('.get-answer').html('Lấy câu trả lời')
                Const_Libs.TOAST.success("Đang lấy key")
            })
            .catch(error => console.log('error', error));
    }

    const handleGetUrl = async () => {
        if (data_key_checked.length === 0) {
            Const_Libs.TOAST.error("Vui lòng chọn trước khi thực hiện!!!")
        } else {
            $('.spin-get-url').removeClass('d-none')
            for (const checkbox of document.querySelectorAll('input[name="key"]')) {
                if (checkbox.checked) {
                    let id_key = checkbox.getAttribute('data-id-key')
                    let name_key = checkbox.getAttribute('data-name-key')
                    $('.status-get-url').removeClass('d-none')
                    $('.status-stop').addClass('d-none')
                    await ajaxCallGet(`get-ky-hieu/${id_key}`).then(async rs => {
                        var myHeaders = new Headers();
                        myHeaders.append("Content-Type", "application/json");
                        myHeaders.append("Authorization", "Bearer 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");

                        var raw = JSON.stringify({
                            "model": "text-davinci-003",
                            "prompt": rs[0].key_cha,
                            "max_tokens": 100,
                            "temperature": 0,
                            "logprobs": 10
                        });
                        var requestOptions = {
                            method: 'POST',
                            headers: myHeaders,
                            body: raw,
                            redirect: 'follow'
                        };

                        fetch("https://api.openai.com/v1/completions", requestOptions)
                            .then(response => response.text())
                            .then(async result => {
                                let answer = JSON.parse(result)
                                console.log(answer)
                                let dataPost = [];
                                dataPost.push({
                                    answer: answer.choices[0].text,
                                    id_key: id_key,
                                    id_cam: data_current_id_cam
                                })
                                let options = {
                                    method: 'POST', // *GET, POST, PUT, DELETE, etc.
                                    headers: {
                                        'Content-Type': 'application/json'
                                        // 'Content-Type': 'application/x-www-form-urlencoded',
                                    },
                                    body: JSON.stringify(dataPost) // body data type must match "Content-Type" header
                                }
                                await fetch(URL_API_GET + 'save-web', options).then(async rs => {
                                    console.log(rs)
                                    checkbox.checked = false;
                                })
                                .catch(error => console.log('error', error))
                            }).catch(err => console.log(err))
                    })
                }
            }
            setTimeout(() => {
                $('.spin-get-url').addClass('d-none')
                $('.status-get-url').addClass('d-none')
                $('.status-stop').removeClass('d-none')
                document.querySelector('input[name="key-all"]').checked = false;
                Const_Libs.TOAST.success("Hoàn thành")
            }, 10000)
        }
    }

    return (
        <div className='col-3 delete'>
            <button
                type='button'
                className='fw-bolder btn btn-outline-primary '
                onClick={() => handleGetUrl()}
                style={{ fontSize: '14px' }}
            >
                <span className="spinner-border spinner-border-sm d-none spin-get-url" style={{ marginRight: '13px' }}></span>
                Lấy phản hồi
            </button>
        </div>
    )
}
export default LayUrlNew