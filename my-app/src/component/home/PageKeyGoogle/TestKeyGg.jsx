import React from 'react'
import $ from 'jquery'
import { useDispatch, useSelector } from 'react-redux';
import { ajaxCallGet, CX_SEARCH, LINK_SEARCH } from '../../libs/base'
import { changeDataKeyGoogle } from '../../reducer_action/BaseReducerAction';

const TestKeyGg = () => {
    const dispatch = useDispatch();
    const KEY_API_SEARCH = useSelector(state => state.base.key_google);
    const data_key_google = useSelector(state => state.base.data_key_google)

    const UpdateCountKeyGoogle = async (key) => {
        await ajaxCallGet(`update-count-key-google/${key}`)
            .then(rs => {
                console.log("Update count thanh cong")
            })
            .catch(err => console.log(err))
    }

    const handleGetAllKeyGg = async () => {
        await ajaxCallGet(`get-all-key-google`).then(async rs => {
            await dispatch(changeDataKeyGoogle([...rs]))
        }).catch(err => console.log(err))
    }

    async function getUrlByGoogle(key_search, id_key) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer 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");

        var raw = JSON.stringify({
            "model": "text-davinci-003",
            "prompt": key_search,
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
            .then(response => {
                if (response.status === 200) {
                    // UpdateCountKeyGoogle(key_api);
                    // handleGetAllKeyGg();
                    $(`.api-item-${id_key}`).css("background-color", "green");
                } else {
                    $(`.api-item-${id_key}`).css("background-color", "orange");
                }
                response.text()
            })
            .catch(error => console.log(error));
    }


    const handleTestKeyGoogle = async () => {
        let arr = [];
        if (data_key_google.length > 0) {
            await data_key_google.map(async (item, index) => {
                if (item) {
                    await getUrlByGoogle('xây dựng là gì?', item.id)
                }
            })
        }
    }

    const handleStopTestKeyGoogle = () => {
        $(`.google-item`).css("background-color", "rgba(0, 0, 0, 0)").css("color", "black");
        $('.start-test-gg').removeClass('d-none')
        $('.stop-test-gg').addClass('d-none')
    }

    return (
        <>
            <button type="button" className="start-test-gg btn btn-primary fw-bolder" style={{ fontSize: '14px' }} onClick={() => handleTestKeyGoogle()}>
                Test Key
            </button>
            <button type="button" className="stop-test-gg btn btn-primary fw-bolder d-none" style={{ fontSize: '14px' }} onClick={() => handleStopTestKeyGoogle()}>
                Dừng test Key
            </button>
        </>
    )
}

export default TestKeyGg