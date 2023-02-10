import $ from 'jquery'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux';

import { ajaxCallGet, URL_API_GET } from '../../libs/base'
import { Const_Libs } from '../../libs/Const_Libs';

const LayUrlNew = () => {
    const data_current_id_cam = useSelector(state => state.base.current_id_cam)
    const data_key_checked = useSelector(state => state.base.check_key)
    const dataKeyGoogle = useSelector(state => state.base.data_key_google)
    const dataToken = useSelector(state => state.base.data_token)
    const dataTemperture = useSelector(state => state.base.data_temperture)

    const TestKeyGoogle = async (key_api) => {
        var settings = {
            "url": "https://api.openai.com/v1/completions",
            "method": "POST",
            "timeout": 0,
            "headers": {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${key_api}`
            },
            "data": JSON.stringify({
                "model": "text-davinci-003",
                "prompt": "tôi là ai",
                "max_tokens": 100,
                "temperature": 0,
                "logprobs": 10
            }),
        };
        let status = null;
        await $.ajax(settings).done(function (jqXHR, textStatus, errorThrown) {
            status = textStatus;
            console.log(textStatus);
            Const_Libs.TOAST.success("Key Đầu tiên hợp lệ")
        }).fail(function (jqXHR, textStatus, errorThrown) {
            status = textStatus;
            Const_Libs.TOAST.error("Key Đầu tiên bị lỗi")
        });
    }

    const handleGetUrl = async () => {
        if (dataKeyGoogle.length === 0) {
            Const_Libs.TOAST.error("Hãy nhập 1 Key Api")
            return;
        }
        if (Number.isNaN(Number(dataToken)) || Number.isNaN(Number(dataTemperture))) {
            Const_Libs.TOAST.error("Hãy bổ sung đầy dủ thông tin cho cài đặt")
            return;
        }
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
                    await ajaxCallGet(`get-url-by-id-key2/${id_key}`).then(async rs => {
                        console.log(rs);
                        if (rs.length > 0) {
                            checkbox.checked = false;
                            document.querySelector('input[name="key-all"]').checked = false;
                            console.log("Co Url, khong lam gi ca")
                        } else {
                            TestKeyGoogle(dataKeyGoogle[0].key_api);
                            await ajaxCallGet(`get-ky-hieu/${id_key}`).then(async rs => {
                                var myHeaders = new Headers();
                                myHeaders.append("Content-Type", "application/json");
                                myHeaders.append("Authorization", `Bearer ${dataKeyGoogle[0].key_api}`);

                                var raw = JSON.stringify({
                                    "model": "text-davinci-003",
                                    "prompt": rs[0].key_cha,
                                    "max_tokens": Number(dataToken),
                                    "temperature": Number(dataTemperture),
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

                    })
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