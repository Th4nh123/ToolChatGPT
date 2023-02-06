import React from 'react'
import $ from 'jquery'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { ajaxCallGet, CX_SEARCH, LINK_SEARCH } from '../../libs/base'
import { changeDataKeyYoutube } from '../../reducer_action/BaseReducerAction';

const TestKeyYoutube = () => {
    const dispatch = useDispatch();
    const data_key_youtube = useSelector(state => state.base.data_key_youtube)

    const UpdateCountKeyYoutube = async (key) => {
        await ajaxCallGet(`update-count-key-youtube/${key}`)
            .then(rs => {
                console.log("Update count thanh cong")
            })
            .catch(err => console.log(err))
    }

    const handleGetAllKeyYt = async () => {
        await ajaxCallGet(`get-all-key-youtube`).then(async rs => {
            await dispatch(changeDataKeyYoutube([...rs]))
        }).catch(err => console.log(err))
    }

    async function getUrlByYoutube(so_luong, KEY_API_SEARCH, id, key_search, timeOut) {
        let result;
        const options = {
            method: 'GET',
            url: 'https://youtube-v31.p.rapidapi.com/search',
            params: {
                q: key_search,
                part: 'snippet,id',
                maxResults: so_luong,
                order: 'relevance',
                regionCode: 'VN'
            },
            headers: {
                'X-RapidAPI-Key': KEY_API_SEARCH,
                'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com'
            }
        };
        //k bắt được lỗi 429, 403
        await axios.request(options).then(async function (response) {
            console.log(response)
            if (response.status === 200) {
                console.log(response.data)
                await UpdateCountKeyYoutube(KEY_API_SEARCH);
                result = [...response.data.items]
            }
        }).catch(function (error) {
            console.error(error);
        })
        return result;
    }

    const handleTestKeyYoutube = async () => {
        let arr = [];
        if (data_key_youtube.length > 0) {
            await data_key_youtube.map(async (item, index) => {
                if (item) {
                    let rs2 = await getUrlByYoutube(10, item.key_api, item.id, 'xây dựng là gì?', 1000)
                    console.log(rs2);
                    if (Boolean(rs2) === true) {
                        // await handleGetAllKeyYt();
                        $(`.youtube-item-${item.id}`).css("background-color", "green");
                    } else {
                        $(`.youtube-item-${item.id}`).css("background-color", "orange");
                    }
                }
                if (data_key_youtube.length - 1 === index) {
                    // $('.start-test-yt').addClass('d-none')
                    // $('.stop-test-yt').removeClass('d-none')
                }
            })
        }
    }

    const handleStopTestKeyYoutube = () => {
        $(`.youtube-item`).css("background-color", "rgba(0, 0, 0, 0)").css("color", "black");
        $('.start-test-yt').removeClass('d-none')
        $('.stop-test-yt').addClass('d-none')
    }

    return (
        <>
            <button type="button" className="start-test-yt btn btn-primary fw-bolder" style={{ fontSize: '14px' }} onClick={() => handleTestKeyYoutube()}>
                Test Key
            </button>
            <button type="button" className="stop-test-yt btn btn-primary fw-bolder d-none" style={{ fontSize: '14px' }} onClick={() => handleStopTestKeyYoutube()}>
                Dừng test Key
            </button>
        </>
    )
}

export default TestKeyYoutube