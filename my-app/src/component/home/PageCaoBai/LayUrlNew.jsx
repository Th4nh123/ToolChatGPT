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

    const list_kh = ["w", "i", "doc", "y", "pdf", "excel"];
    const list_nd = ["Cào nội dung web",
        "Hình ảnh + Tiêu đề hình ảnh",
        "filetype:doc",
        "Video + Tiêu đề video",
        "filetype:pdf",
        "filetype:excel"];




    const UpdateCountKeyGoogle = (KEY_API_SEARCH) => {
        let options = {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json'
            }
        }
        fetch(`${URL_API_GET}update-count-key-google/${KEY_API_SEARCH}`, options).then(response => response.json())
            // .then(rs => console.log("update count thanh cong", rs))
            .catch(err => console.log(err))
    }

    const UpdateCountKeyYoutube = (KEY_API_SEARCH) => {
        let options = {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json'
            }
        }
        fetch(`${URL_API_GET}update-count-key-youtube/${KEY_API_SEARCH}`, options).then(response => response.json())
            // .then(rs => console.log("update count thanh cong", rs))
            .catch(err => console.log(err))
    }



    const getNextKeyGoogle = async (KEY_API_SEARCH) => {
        let options = {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json'
            }
        }
        await fetch(`${URL_API_GET}get-next-key-google/${KEY_API_SEARCH}`, options).then(rs => {
            console.log('get next key GG', rs)
        })
            .catch(err => console.log(err))
    }

    const getNextKeyYoutube = async (KEY_API_SEARCH) => {
        let options = {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json'
            }
        }
        await fetch(`${URL_API_GET}get-next-key-youtube/${KEY_API_SEARCH}`, options).then(rs => {
            console.log('get next key YT', rs)
        })
            .catch(err => console.log(err))
    }



    // Việc trả về đúng số lượng video là do api google
    async function getUrlByYoutube(so_luong, key_search, id_key, id_list_vd, timeOut) {
        let result;
        var check = false;
        // var checkLimitKey = false;
        let KEY_API_SEARCH;
        let options = {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            }
        }
        await fetch(URL_API_GET + 'get-key-youtube', options).then(rs => rs.json())
            .then(rs => {
                if (rs.length > 0) { KEY_API_SEARCH = rs[0].key_api }
            })
            .catch(err => console.log(err))
        if (Boolean(KEY_API_SEARCH) === true) {
            if (Boolean(id_list_vd) === true) {
                const options = {
                    method: 'GET',
                    url: 'https://youtube-v31.p.rapidapi.com/playlistItems',
                    params: {
                        playlistId: id_list_vd,
                        part: 'snippet',
                        maxResults: '50',
                    },
                    headers: {
                        'X-RapidAPI-Key': KEY_API_SEARCH,
                        'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com'
                    }
                };

                await axios.request(options).then(async function (response) {
                    if (response.status === 200) {
                        await UpdateCountKeyYoutube(KEY_API_SEARCH);
                        result = [...response.data.items]
                        check = true;
                    }
                }).catch(function (error) {
                    console.error(error);
                });
                if (check === false) {
                    await getNextKeyYoutube(KEY_API_SEARCH)
                }
            } else {
                const options = {
                    method: 'GET',
                    url: 'https://youtube-v31.p.rapidapi.com/search',
                    params: {
                        q: key_search,
                        part: 'snippet,id',
                        maxResults: so_luong,
                        order: 'relevance',
                        // order: 'rating',
                        regionCode: 'VN'
                    },
                    headers: {
                        'X-RapidAPI-Key': KEY_API_SEARCH,
                        'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com'
                    }
                };
                //k bắt được lỗi 429
                await axios.request(options).then(async function (response) {
                    if (response.status === 200) {
                        await UpdateCountKeyYoutube(KEY_API_SEARCH);
                        result = [...response.data.items]
                        check = true;
                    }
                }).catch(function (error) {
                    console.error(error);
                })
                if (check === false) {
                    await getNextKeyYoutube(KEY_API_SEARCH)
                }
            }
        }
        return result
    }

    const saveVideo = async (dataPost) => {
        let options = {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(dataPost) // body data type must match "Content-Type" header
        }
        await fetch(URL_API_GET + 'save-video ', options).then(async rs => {
            // if (rs.status === 500) {
            //     console.log("save lai video lan nua")
            //     await saveVideo(dataPost)
            // }
        })
            .catch(err => console.log(err))
    }



    const postVideo = async (key_search, ky_hieu, id_key, so_luong, timeOut, id_list_vd, stt) => {
        var dataPost = [];
        var fake_so_luong = so_luong + 5
        var count = 0;
        var countOut = 0;
        if (Boolean(id_list_vd) === true) {
            await getUrlByYoutube(fake_so_luong, key_search, id_key, id_list_vd, timeOut)
                .then(rs => {
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            resolve(rs);
                        }, 1000)
                    })
                })
                .then(async rs => {
                    if (rs.length > 0) { // do rs chắc chắn ra 1 mảng (có thể là rỗng)
                        for (let i = 0; i < rs.length; i++) {
                            dataPost.push({
                                url: `https://www.youtube.com/watch?v=${rs[i].snippet?.resourceId?.videoId}`,
                                url_title: rs[i].snippet?.title ? rs[i].snippet.title : '',
                                url_description: rs[i].snippet?.description ? rs[i].snippet.description : 'Khong co description',
                                ky_hieu: ky_hieu,
                                id_key: id_key,
                                stt: stt
                            })
                        }
                        await saveVideo(dataPost);

                        console.log("DATAPOST: ", dataPost)


                    }
                }).catch(err => console.log(err))
        } else {
            do {
                await getUrlByYoutube(fake_so_luong, key_search, id_key, id_list_vd, timeOut)
                    .then(rs => {
                        return new Promise((resolve) => {
                            setTimeout(() => {
                                resolve(rs);
                            }, 1000)
                        })
                    })
                    .then(async rs => {
                        if (rs.length > 0) { // do rs chắc chắn ra 1 mảng (có thể là rỗng)
                            // Hàm lọc ra mảng có chứa thuộc tính videoId
                            let main_rs = await rs.filter(item => {
                                return item.id.videoId;
                            })
                            if (main_rs.length >= so_luong) {
                                for (let i = 0; i < so_luong; i++) {
                                    count += 1;
                                    dataPost.push({
                                        url: `https://www.youtube.com/watch?v=${main_rs[i].id.videoId}`,
                                        url_title: main_rs[i].snippet?.title ? main_rs[i].snippet.title : '',
                                        url_description: main_rs[i].snippet?.description ? main_rs[i].snippet.description : 'Khong co description',
                                        ky_hieu: ky_hieu,
                                        id_key: id_key,
                                        stt: stt
                                    })
                                }
                                await saveVideo(dataPost);
                            }
                            // Nếu k đủ main_rs => fake_count + 10, hết key, 

                            console.log("DATAPOST: ", dataPost)
                        }
                    }).catch(err => console.log(err))
                // chưa ưng ý, kiểm tra thêm về phần cộng
                countOut += 1;
                fake_so_luong += 5;

            } while (count < so_luong && countOut < 3)
            // } while (countOut < 1000)
        }
    }


    async function getUrlByGoogle(start, count, key_search, timeOut) {
        let result;
        let key;
        let KEY_API_SEARCH;
        let options = {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            }
        }
        await fetch(URL_API_GET + 'get-key-google', options).then(rs => rs.json())
            .then(rs => {
                if (rs.length > 0) { KEY_API_SEARCH = rs[0].key_api }
            })
            .catch(err => console.log(err))
        // do {
        if (Boolean(KEY_API_SEARCH) === true) {
            await fetch(`${LINK_SEARCH}key=${KEY_API_SEARCH}&cx=${CX_SEARCH}&start=${start}&num=${count}&safe=active&gl=vn&q=${key_search}`).then(async response => {
                console.log(response);
                if (response.status === 200) {
                    return response.json()
                } else if (response.status === 429) {
                    // arrKey
                    await getNextKeyGoogle(KEY_API_SEARCH)
                } else if (response.status === 400) {
                }
            })
                .then(async rs => {
                    if (rs) {
                        return new Promise((resolve) => {
                            setTimeout(() => {
                                resolve(rs);
                            }, 500)
                        })
                    }
                })
                .then(async rs => {
                    if (rs) {
                        if (rs.url) {
                            await UpdateCountKeyGoogle(KEY_API_SEARCH);
                            result = rs;
                        }
                    }
                }).catch(err => console.log(err))
            return result;
        }


        // } while (result === null)

    }

    async function getImageByGoogle(start, count, key_search, timeOut) {
        // &imgSize=xxlarge&imgType=photo
        let result;
        let KEY_API_SEARCH;
        let options = {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            }
        }
        // do {
        await fetch(URL_API_GET + 'get-key-google', options).then(rs => rs.json())
            .then(rs => {
                if (rs.length > 0) { KEY_API_SEARCH = rs[0].key_api }
            })
            .catch(err => console.log(err))

        if (Boolean(KEY_API_SEARCH) === true) {
            await fetch(`${LINK_SEARCH}key=${KEY_API_SEARCH}&cx=${CX_SEARCH}&start=${start}&num=${count}&q=${key_search}&searchType=image&gl=vn`).then(async response => {
                if (response.status === 200) {
                    return response.json()
                } else if (response.status === 429) {
                    await getNextKeyGoogle(KEY_API_SEARCH)
                }
                // response.json()
            })
                .then(rs => {
                    if (rs) {
                        return new Promise((resolve) => {
                            setTimeout(() => {
                                resolve(rs);
                            }, 500)
                        })
                    }
                })
                .then(async rs => {
                    if (rs) {
                        if (rs.url) {
                            await UpdateCountKeyGoogle(KEY_API_SEARCH);
                            result = rs;
                        }
                    }
                }).catch(err => console.log(err))
            return result;
        }

        // } while (result === null)
    }

    const PhanTich = async (kh, key_search, id_key, id_list_vd) => {
        var timeOut = 0;
        if (kh.toLowerCase().indexOf(".")) {
            let lskh = kh.toLowerCase().split('.');
            await lskh.map(async (s, index) => {
                timeOut = timeOut + 1000;
                await docKyHieu(s, key_search, id_key, timeOut, id_list_vd, index + 1);
            })
        } else {
            await docKyHieu(kh, key_search, id_key, timeOut, id_list_vd, 1);
        }
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([{ response: true, status: 200 }]);
            }, 3000)
        })

    }

    // w2.y3.w5 -> w7.y3

    const PhanTich2 = async (kh, key_search, id_key, id_list_vd) => {
        let list_key = [];
        if (kh.toLowerCase().indexOf(".")) {
            let lskh = kh.toLowerCase().split('.');
            await lskh.map(async (s, index) => { // [w3, i3, w5]
                let vi_tri = -1;
                if (s.indexOf('w') >= 0) {
                    let so_luong = s.replace('w', '')
                    if (so_luong > 0) {
                        so_luong = so_luong;
                    } else {
                        so_luong = 10;
                    }
                    for (let i = 0; i < list_key.length; i++) {
                        if (list_key[i].key === 'w') {
                            vi_tri = i;
                            break;
                        }
                    }
                    if (vi_tri >= 0) {
                        list_key[vi_tri].so_luong = Number(list_key[vi_tri].so_luong) + Number(so_luong);
                    } else {
                        list_key.push({ key: 'w', so_luong: so_luong })
                    }

                } else if (s.indexOf('doc') >= 0) {
                    let so_luong = s.replace('doc', '')
                    if (so_luong > 0) {
                        so_luong = so_luong;
                    } else {
                        so_luong = 1;
                    }
                    for (let i = 0; i < list_key.length; i++) {
                        if (list_key[i].key === 'doc') {
                            vi_tri = i;
                            break;
                        }
                    }
                    if (vi_tri >= 0) {
                        list_key[vi_tri].so_luong = Number(list_key[vi_tri].so_luong) + Number(so_luong);
                    } else {
                        list_key.push({ key: 'doc', so_luong: so_luong })
                    }

                } else if (s.indexOf('pdf') >= 0) {
                    let so_luong = s.replace('pdf', '')
                    if (so_luong > 0) {
                        so_luong = so_luong;
                    } else {
                        so_luong = 1;
                    }
                    for (let i = 0; i < list_key.length; i++) {
                        if (list_key[i].key === 'pdf') {
                            vi_tri = i;
                            break;
                        }
                    }
                    if (vi_tri >= 0) {
                        list_key[vi_tri].so_luong = Number(list_key[vi_tri].so_luong) + Number(so_luong);
                    } else {
                        list_key.push({ key: 'pdf', so_luong: so_luong })
                    }

                } else if (s.indexOf('i') >= 0) {
                    let so_luong = s.replace('i', '')
                    if (so_luong > 0) {
                        so_luong = so_luong;
                    } else {
                        so_luong = 1;
                    }
                    for (let i = 0; i < list_key.length; i++) {
                        if (list_key[i].key === 'i') {
                            vi_tri = i;
                            break;
                        }
                    }
                    if (vi_tri >= 0) {
                        list_key[vi_tri].so_luong = Number(list_key[vi_tri].so_luong) + Number(so_luong);
                    } else {
                        list_key.push({ key: 'i', so_luong: so_luong })
                    }

                } else if (s.indexOf('y') >= 0) {
                    let so_luong = s.replace('y', '')
                    if (so_luong > 0) {
                        so_luong = so_luong;
                    } else {
                        so_luong = 1;
                    }
                    for (let i = 0; i < list_key.length; i++) {
                        if (list_key[i].key === 'y') {
                            vi_tri = i;
                            break;
                        }
                    }
                    if (vi_tri >= 0) {
                        list_key[vi_tri].so_luong = Number(list_key[vi_tri].so_luong) + Number(so_luong);
                    } else {
                        list_key.push({ key: 'y', so_luong: so_luong })
                    }
                }
            })
        }
        let str = ""
        for (let i = 0; i < list_key.length; i++) {
            str = str + list_key[i].key + list_key[i].so_luong + '.';
        }
        await PhanTich(str, key_search, id_key, id_list_vd);
    }



    const docKyHieu = async (skh, key_search, id_key, timeOut, id_list_vd, stt) => {
        let vi_tri = -1;
        for (let i = 0; i < list_kh.length; ++i) {
            if (skh.indexOf(list_kh[i].toLowerCase()) >= 0) {
                vi_tri = i;
                break;
            }
        }
        if (vi_tri >= 0) {
            let kh = list_kh[vi_tri];
            let nd = list_nd[vi_tri];
            let so_luong = Number(skh.replace(kh, ''));
            if (so_luong > 0) {
                so_luong = so_luong;
            } else {
                if (kh.toLowerCase() === "w") {
                    so_luong = 10;
                } else {
                    so_luong = 1;
                }
            }
            // "w", "i", "doc", "y", "pdf", "excel"
            console.log("Kh: ", kh, " nd: ", nd, " soLuong: ", so_luong);
            await LayUrlAll(kh, so_luong, key_search, id_key, nd, timeOut, id_list_vd, stt)
        }
    }

    const LayUrlAll = async (kh, so_luong, key_search, id_key, nd, timeOut, id_list_vd, stt) => {
        switch (kh) {
            case 'w': {
                await postWeb(key_search, kh, id_key, 1, so_luong, timeOut, stt)
                break;
            }
            case 'y': {
                await postVideo(key_search, kh, id_key, so_luong, timeOut, id_list_vd, stt)
                break;
            }
            case 'i': {
                await postImage(key_search, kh, id_key, 1, so_luong, timeOut, stt)
                break;
            }
            case 'doc': {
                await postFile(key_search, kh, nd, id_key, 1, so_luong, timeOut, stt)
                break;
            }
            case 'pdf': {
                await postFile(key_search, kh, nd, id_key, 1, so_luong, timeOut, stt)
                break;
            }
            case 'excel': {
                await postFile(key_search, kh, nd, id_key, 1, so_luong, timeOut, stt)
                break;
            }
            default:
                throw new Error('Invalid');
        }
    }

    const getDataWeb = async (key_search, ky_hieu, id_key, start, so_luong, timeOut, stt) => {
        var dataPost = [];
        let arr = [];
        await getUrlByGoogle(start, so_luong, key_search, timeOut).then(async rs => {
            if (rs) {
                arr = rs.items
                for (let i in arr) {
                    await dataPost.push({
                        url: arr[i].link ? arr[i].link : '',
                        url_image: arr[i].pagemap?.cse_image?.at(0).src ? arr[i].pagemap.cse_image.at(0).src : '',
                        url_title: arr[i].title ? arr[i].title : '',
                        url_description: arr[i].snippet ? arr[i].snippet : '',
                        ky_hieu: ky_hieu,
                        id_key: id_key,
                        stt: stt
                    })
                }
            }
        })
        return dataPost;
    }

    const saveWeb = async (dataPost) => {
        let options = {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(dataPost) // body data type must match "Content-Type" header
        }
        await fetch(URL_API_GET + 'save-web', options).then(rs => {
            console.log(rs)
            // if (rs.status === 500) {
            //     console.log("save lai video lan nua")
            //     await saveVideo(dataPost)
            // }
        })
            .catch(err => console.log(err))
    }

    const postWeb = async (key_search, ky_hieu, id_key, start, so_luong, timeOut, stt) => {
        var dataPost = [];
        const black_list = new Map()

        await ajaxCallGet(`get-black-list-by-id-cam/${data_current_id_cam}`).then(rs => {
            console.log("Lay blackKey");
            rs.map((item, index) => {
                black_list.set(getHostname2(item.domain), index)
            })
        }).catch(err => console.log(err))

        if (so_luong > 1 && so_luong <= 10) {
            dataPost = await getDataWeb(key_search, ky_hieu, id_key, start, so_luong, timeOut, stt)
        } else if (so_luong > 10 && so_luong <= 20) {
            let dataPost1 = await getDataWeb(key_search, ky_hieu, id_key, start, 10, timeOut, stt)
            let dataPost2 = await getDataWeb(key_search, ky_hieu, id_key, 11, so_luong - 10, timeOut, stt)
            dataPost = [...dataPost1, ...dataPost2]
        } else if (so_luong > 20 && so_luong <= 30) {
            let dataPost1 = await getDataWeb(key_search, ky_hieu, id_key, start, 10, timeOut + 1000, stt)
            let dataPost2 = await getDataWeb(key_search, ky_hieu, id_key, 11, 10, timeOut + 1000, stt)
            let dataPost3 = await getDataWeb(key_search, ky_hieu, id_key, 21, so_luong - 20, timeOut + 1000, stt)
            dataPost = [...dataPost1, ...dataPost2, ...dataPost3]
        } else if (so_luong > 30 && so_luong <= 40) {
            let dataPost1 = await getDataWeb(key_search, ky_hieu, id_key, start, 10, timeOut, stt)
            let dataPost2 = await getDataWeb(key_search, ky_hieu, id_key, 11, 10, timeOut, stt)
            let dataPost3 = await getDataWeb(key_search, ky_hieu, id_key, 31, 10, timeOut, stt)
            let dataPost4 = await getDataWeb(key_search, ky_hieu, id_key, 41, so_luong - 30, timeOut, stt)
            dataPost = [...dataPost1, ...dataPost2, ...dataPost3, ...dataPost4]
        } else if (so_luong > 40 && so_luong <= 50) {
            let dataPost1 = await getDataWeb(key_search, ky_hieu, id_key, start, 10, timeOut, stt)
            let dataPost2 = await getDataWeb(key_search, ky_hieu, id_key, 11, 10, timeOut, stt)
            let dataPost3 = await getDataWeb(key_search, ky_hieu, id_key, 21, 10, timeOut, stt)
            let dataPost4 = await getDataWeb(key_search, ky_hieu, id_key, 31, 10, timeOut, stt)
            let dataPost5 = await getDataWeb(key_search, ky_hieu, id_key, 41, so_luong - 40, timeOut, stt)
            dataPost = [...dataPost1, ...dataPost2, ...dataPost3, ...dataPost4, ...dataPost5]
        } else if (so_luong > 50 && so_luong <= 60) {
            let dataPost1 = await getDataWeb(key_search, ky_hieu, id_key, start, 10, timeOut, stt)
            let dataPost2 = await getDataWeb(key_search, ky_hieu, id_key, 11, 10, timeOut, stt)
            let dataPost3 = await getDataWeb(key_search, ky_hieu, id_key, 21, 10, timeOut, stt)
            let dataPost4 = await getDataWeb(key_search, ky_hieu, id_key, 31, 10, timeOut, stt)
            let dataPost5 = await getDataWeb(key_search, ky_hieu, id_key, 41, 10, timeOut, stt)
            let dataPost6 = await getDataWeb(key_search, ky_hieu, id_key, 51, so_luong - 50, timeOut, stt)
            dataPost = [...dataPost1, ...dataPost2, ...dataPost3, ...dataPost4, ...dataPost5, ...dataPost6]
        } else if (so_luong > 60 && so_luong <= 70) {
            let dataPost1 = await getDataWeb(key_search, ky_hieu, id_key, start, 10, timeOut, stt)
            let dataPost2 = await getDataWeb(key_search, ky_hieu, id_key, 11, 10, timeOut, stt)
            let dataPost3 = await getDataWeb(key_search, ky_hieu, id_key, 21, 10, timeOut, stt)
            let dataPost4 = await getDataWeb(key_search, ky_hieu, id_key, 31, 10, timeOut, stt)
            let dataPost5 = await getDataWeb(key_search, ky_hieu, id_key, 41, 10, timeOut, stt)
            let dataPost6 = await getDataWeb(key_search, ky_hieu, id_key, 51, 10, timeOut, stt)
            let dataPost7 = await getDataWeb(key_search, ky_hieu, id_key, 61, so_luong - 60, timeOut, stt)
            dataPost = [...dataPost1, ...dataPost2, ...dataPost3, ...dataPost4, ...dataPost5, ...dataPost6, ...dataPost7]
        } else if (so_luong > 70 && so_luong <= 80) {
            let dataPost1 = await getDataWeb(key_search, ky_hieu, id_key, start, 10, timeOut, stt)
            let dataPost2 = await getDataWeb(key_search, ky_hieu, id_key, 11, 10, timeOut, stt)
            let dataPost3 = await getDataWeb(key_search, ky_hieu, id_key, 21, 10, timeOut, stt)
            let dataPost4 = await getDataWeb(key_search, ky_hieu, id_key, 31, 10, timeOut, stt)
            let dataPost5 = await getDataWeb(key_search, ky_hieu, id_key, 41, 10, timeOut, stt)
            let dataPost6 = await getDataWeb(key_search, ky_hieu, id_key, 51, 10, timeOut, stt)
            let dataPost7 = await getDataWeb(key_search, ky_hieu, id_key, 61, 10, timeOut, stt)
            let dataPost8 = await getDataWeb(key_search, ky_hieu, id_key, 71, so_luong - 70, timeOut, stt)
            dataPost = [...dataPost1, ...dataPost2, ...dataPost3, ...dataPost4, ...dataPost5, ...dataPost6, ...dataPost7, ...dataPost8]
        } else if (so_luong > 80 && so_luong <= 90) {
            let dataPost1 = await getDataWeb(key_search, ky_hieu, id_key, start, 10, timeOut, stt)
            let dataPost2 = await getDataWeb(key_search, ky_hieu, id_key, 11, 10, timeOut, stt)
            let dataPost3 = await getDataWeb(key_search, ky_hieu, id_key, 21, 10, timeOut, stt)
            let dataPost4 = await getDataWeb(key_search, ky_hieu, id_key, 31, 10, timeOut, stt)
            let dataPost5 = await getDataWeb(key_search, ky_hieu, id_key, 41, 10, timeOut, stt)
            let dataPost6 = await getDataWeb(key_search, ky_hieu, id_key, 51, 10, timeOut, stt)
            let dataPost7 = await getDataWeb(key_search, ky_hieu, id_key, 61, 10, timeOut, stt)
            let dataPost8 = await getDataWeb(key_search, ky_hieu, id_key, 71, 10, timeOut, stt)
            let dataPost9 = await getDataWeb(key_search, ky_hieu, id_key, 81, so_luong - 80, timeOut, stt)
            dataPost = [...dataPost1, ...dataPost2, ...dataPost3, ...dataPost4, ...dataPost5, ...dataPost6, ...dataPost7, ...dataPost8, ...dataPost9]
        } else if (so_luong > 90) {
            let dataPost1 = await getDataWeb(key_search, ky_hieu, id_key, start, 10, timeOut, stt)
            let dataPost2 = await getDataWeb(key_search, ky_hieu, id_key, 11, 10, timeOut, stt)
            let dataPost3 = await getDataWeb(key_search, ky_hieu, id_key, 21, 10, timeOut, stt)
            let dataPost4 = await getDataWeb(key_search, ky_hieu, id_key, 31, 10, timeOut, stt)
            let dataPost5 = await getDataWeb(key_search, ky_hieu, id_key, 41, 10, timeOut, stt)
            let dataPost6 = await getDataWeb(key_search, ky_hieu, id_key, 51, 10, timeOut, stt)
            let dataPost7 = await getDataWeb(key_search, ky_hieu, id_key, 61, 10, timeOut, stt)
            let dataPost8 = await getDataWeb(key_search, ky_hieu, id_key, 71, 10, timeOut, stt)
            let dataPost9 = await getDataWeb(key_search, ky_hieu, id_key, 81, 10, timeOut, stt)
            let dataPost10 = await getDataWeb(key_search, ky_hieu, id_key, 90, 10, timeOut, stt)
            dataPost = [...dataPost1, ...dataPost2, ...dataPost3, ...dataPost4, ...dataPost5, ...dataPost6, ...dataPost7, ...dataPost8, ...dataPost9, ...dataPost10]
        }

        let result = dataPost;
        for (let i in dataPost) {
            let host_name = getHostname(dataPost[i].url)
            if (black_list.has(host_name)) {
                result = result.filter(item => {
                    return item.url !== dataPost[i].url;
                })
            }
        }

        console.log("RESULT WEB: ", result)
        await saveWeb(result);
    }

    const getDataFile = async (start, so_luong, search, key_search, timeOut, stt, ky_hieu, id_key) => {
        var dataPost = [];
        let arr = [], arr2 = [];
        await getUrlByGoogle(start, so_luong, search, timeOut).then(async rs => {
            if (rs) {
                arr = rs.items;
                await getImageByGoogle(start, so_luong, key_search, 500).then(async rs2 => {
                    if (rs2) {
                        arr2 = rs2.items;
                        for (let i in arr) {
                            await dataPost.push({
                                url: arr[i].link ? arr[i].link : '',
                                url_image: arr2[i].link ? arr2[i].link : '',
                                url_title: arr[i].title ? arr[i].title : '',
                                url_description: arr[i].snippet ? arr[i].snippet : '',
                                ky_hieu: ky_hieu,
                                id_key: id_key,
                                stt: stt
                            })
                        }
                    }
                })
            }
        })
        return dataPost;
    }

    const saveFile = async (dataPost) => {
        let options = {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(dataPost) // body data type must match "Content-Type" header
        }
        await fetch(URL_API_GET + 'save-file', options).then(rs => console.log(rs))
            .catch(err => console.log(err))

    }

    const postFile = async (key_search, ky_hieu, filetype, id_key, start, so_luong, timeOut, stt) => {
        let search = key_search + " " + filetype;
        var dataPost = [];
        const black_list = new Map()

        await ajaxCallGet(`get-black-list-by-id-cam/${data_current_id_cam}`).then(rs => {
            rs.map((item, index) => {
                black_list.set(getHostname2(item.domain), index)
            })
        }).catch(err => console.log(err))
        if (so_luong <= 10) {
            dataPost = await getDataFile(start, so_luong, search, key_search, timeOut, stt, ky_hieu, id_key);
        } else if (so_luong > 10 && so_luong <= 20) {
            let dataPost1 = await getDataFile(start, 10, search, key_search, timeOut, stt, ky_hieu, id_key);
            let dataPost2 = await getDataFile(11, so_luong - 10, search, key_search, timeOut, stt, ky_hieu, id_key);
            dataPost = [...dataPost1, ...dataPost2]
        } else if (so_luong > 20 && so_luong <= 30) {
            let dataPost1 = await getDataFile(start, 10, search, key_search, timeOut + 1000, stt, ky_hieu, id_key);
            let dataPost2 = await getDataFile(11, 10, search, key_search, timeOut + 1000, stt, ky_hieu, id_key);
            let dataPost3 = await getDataFile(21, so_luong - 20, search, key_search, timeOut + 1000, stt, ky_hieu, id_key);
            dataPost = [...dataPost1, ...dataPost2, ...dataPost3]
        } else if (so_luong > 30 && so_luong <= 40) {
            let dataPost1 = await getDataFile(key_search, ky_hieu, id_key, start, 10, timeOut, stt)
            let dataPost2 = await getDataFile(key_search, ky_hieu, id_key, 11, 10, timeOut, stt)
            let dataPost3 = await getDataFile(key_search, ky_hieu, id_key, 31, 10, timeOut, stt)
            let dataPost4 = await getDataFile(key_search, ky_hieu, id_key, 41, so_luong - 30, timeOut, stt)
            dataPost = [...dataPost1, ...dataPost2, ...dataPost3, ...dataPost4]
        } else if (so_luong > 40 && so_luong <= 50) {
            let dataPost1 = await getDataFile(key_search, ky_hieu, id_key, start, 10, timeOut, stt)
            let dataPost2 = await getDataFile(key_search, ky_hieu, id_key, 11, 10, timeOut, stt)
            let dataPost3 = await getDataFile(key_search, ky_hieu, id_key, 21, 10, timeOut, stt)
            let dataPost4 = await getDataFile(key_search, ky_hieu, id_key, 31, 10, timeOut, stt)
            let dataPost5 = await getDataFile(key_search, ky_hieu, id_key, 41, so_luong - 40, timeOut, stt)
            dataPost = [...dataPost1, ...dataPost2, ...dataPost3, ...dataPost4, ...dataPost5]
        } else if (so_luong > 50 && so_luong <= 60) {
            let dataPost1 = await getDataFile(key_search, ky_hieu, id_key, start, 10, timeOut, stt)
            let dataPost2 = await getDataFile(key_search, ky_hieu, id_key, 11, 10, timeOut, stt)
            let dataPost3 = await getDataFile(key_search, ky_hieu, id_key, 21, 10, timeOut, stt)
            let dataPost4 = await getDataFile(key_search, ky_hieu, id_key, 31, 10, timeOut, stt)
            let dataPost5 = await getDataFile(key_search, ky_hieu, id_key, 41, 10, timeOut, stt)
            let dataPost6 = await getDataFile(key_search, ky_hieu, id_key, 51, so_luong - 50, timeOut, stt)
            dataPost = [...dataPost1, ...dataPost2, ...dataPost3, ...dataPost4, ...dataPost5, ...dataPost6]
        } else if (so_luong > 60 && so_luong <= 70) {
            let dataPost1 = await getDataFile(key_search, ky_hieu, id_key, start, 10, timeOut, stt)
            let dataPost2 = await getDataFile(key_search, ky_hieu, id_key, 11, 10, timeOut, stt)
            let dataPost3 = await getDataFile(key_search, ky_hieu, id_key, 21, 10, timeOut, stt)
            let dataPost4 = await getDataFile(key_search, ky_hieu, id_key, 31, 10, timeOut, stt)
            let dataPost5 = await getDataFile(key_search, ky_hieu, id_key, 41, 10, timeOut, stt)
            let dataPost6 = await getDataFile(key_search, ky_hieu, id_key, 51, 10, timeOut, stt)
            let dataPost7 = await getDataFile(key_search, ky_hieu, id_key, 61, so_luong - 60, timeOut, stt)
            dataPost = [...dataPost1, ...dataPost2, ...dataPost3, ...dataPost4, ...dataPost5, ...dataPost6, ...dataPost7]
        } else if (so_luong > 70 && so_luong <= 80) {
            let dataPost1 = await getDataFile(key_search, ky_hieu, id_key, start, 10, timeOut, stt)
            let dataPost2 = await getDataFile(key_search, ky_hieu, id_key, 11, 10, timeOut, stt)
            let dataPost3 = await getDataFile(key_search, ky_hieu, id_key, 21, 10, timeOut, stt)
            let dataPost4 = await getDataFile(key_search, ky_hieu, id_key, 31, 10, timeOut, stt)
            let dataPost5 = await getDataFile(key_search, ky_hieu, id_key, 41, 10, timeOut, stt)
            let dataPost6 = await getDataFile(key_search, ky_hieu, id_key, 51, 10, timeOut, stt)
            let dataPost7 = await getDataFile(key_search, ky_hieu, id_key, 61, 10, timeOut, stt)
            let dataPost8 = await getDataFile(key_search, ky_hieu, id_key, 71, so_luong - 70, timeOut, stt)
            dataPost = [...dataPost1, ...dataPost2, ...dataPost3, ...dataPost4, ...dataPost5, ...dataPost6, ...dataPost7, ...dataPost8]
        } else if (so_luong > 80 && so_luong <= 90) {
            let dataPost1 = await getDataFile(key_search, ky_hieu, id_key, start, 10, timeOut, stt)
            let dataPost2 = await getDataFile(key_search, ky_hieu, id_key, 11, 10, timeOut, stt)
            let dataPost3 = await getDataFile(key_search, ky_hieu, id_key, 21, 10, timeOut, stt)
            let dataPost4 = await getDataFile(key_search, ky_hieu, id_key, 31, 10, timeOut, stt)
            let dataPost5 = await getDataFile(key_search, ky_hieu, id_key, 41, 10, timeOut, stt)
            let dataPost6 = await getDataFile(key_search, ky_hieu, id_key, 51, 10, timeOut, stt)
            let dataPost7 = await getDataFile(key_search, ky_hieu, id_key, 61, 10, timeOut, stt)
            let dataPost8 = await getDataFile(key_search, ky_hieu, id_key, 71, 10, timeOut, stt)
            let dataPost9 = await getDataFile(key_search, ky_hieu, id_key, 81, so_luong - 80, timeOut, stt)
            dataPost = [...dataPost1, ...dataPost2, ...dataPost3, ...dataPost4, ...dataPost5, ...dataPost6, ...dataPost7, ...dataPost8, ...dataPost9]
        } else if (so_luong > 90) {
            let dataPost1 = await getDataFile(key_search, ky_hieu, id_key, start, 10, timeOut, stt)
            let dataPost2 = await getDataFile(key_search, ky_hieu, id_key, 11, 10, timeOut, stt)
            let dataPost3 = await getDataFile(key_search, ky_hieu, id_key, 21, 10, timeOut, stt)
            let dataPost4 = await getDataFile(key_search, ky_hieu, id_key, 31, 10, timeOut, stt)
            let dataPost5 = await getDataFile(key_search, ky_hieu, id_key, 41, 10, timeOut, stt)
            let dataPost6 = await getDataFile(key_search, ky_hieu, id_key, 51, 10, timeOut, stt)
            let dataPost7 = await getDataFile(key_search, ky_hieu, id_key, 61, 10, timeOut, stt)
            let dataPost8 = await getDataFile(key_search, ky_hieu, id_key, 71, 10, timeOut, stt)
            let dataPost9 = await getDataFile(key_search, ky_hieu, id_key, 81, 10, timeOut, stt)
            let dataPost10 = await getDataFile(key_search, ky_hieu, id_key, 90, 10, timeOut, stt)
            dataPost = [...dataPost1, ...dataPost2, ...dataPost3, ...dataPost4, ...dataPost5, ...dataPost6, ...dataPost7, ...dataPost8, ...dataPost9, ...dataPost10]
        }
        let result = dataPost;
        for (let i in dataPost) {
            let host_name = getHostname(dataPost[i].url)
            if (black_list.has(host_name)) {
                result = result.filter(item => {
                    return item.url !== dataPost[i].url;
                })
            }
        }
        console.log("RESULT FILE: ", result)

        await saveFile(result);
    }

    const getDataImage = async (key_search, ky_hieu, id_key, start, so_luong, timeOut, stt) => {
        var dataPost = [];
        let arr = [];

        await getImageByGoogle(start, so_luong, key_search, timeOut).then(async rs => {
            console.log(rs);
            if (rs) {
                arr = rs.items
                for (let i in arr) {
                    await dataPost.push({
                        url: arr[i].image?.contextLink ? arr[i].image.contextLink : '',
                        url_image: arr[i].link ? arr[i].link : '',
                        url_title: arr[i].title ? arr[i].title : '',
                        url_description: arr[i].snippet ? arr[i].snippet : '',
                        ky_hieu: ky_hieu,
                        id_key: id_key,
                        stt: stt,
                    })
                }
            }
        })
        return dataPost;
    }

    const saveImage = async (dataPost) => {
        console.log("Result int SAVE IMAGE: ", dataPost);
        let options = {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(dataPost) // body data type must match "Content-Type" header
        }
        await fetch(URL_API_GET + 'save-image', options).then(rs => console.log(rs))
            .catch(err => console.log(err))
    }

    const getPhanTuBySoLuong = async (arr, so_luong) => {
        console.log(arr);
        if (arr.length > so_luong) {
            await arr.splice(so_luong)
        }
        console.log(arr);
        return arr;
    }

    const postImage = async (key_search, ky_hieu, id_key, start, so_luong, timeOut, stt) => {
        var dataPost = [];
        var count = 0;
        var countOut = 0;
        let count_current = so_luong + 10;

        const black_list = new Map()

        await ajaxCallGet(`get-black-list-by-id-cam/${data_current_id_cam}`).then(rs => {
            rs.map((item, index) => {
                black_list.set(getHostname2(item.domain), index)
            })
        }).catch(err => console.log(err))
        // do {
        if (count_current > 1 && count_current <= 10) {
            dataPost = await getDataImage(key_search, ky_hieu, id_key, start, count_current, timeOut, stt)
        } else if (count_current > 10 && count_current <= 20) {
            let dataPost1 = await getDataImage(key_search, ky_hieu, id_key, start, 10, timeOut, stt)
            let dataPost2 = await getDataImage(key_search, ky_hieu, id_key, 11, count_current - 10, timeOut, stt)
            dataPost = [...dataPost1, ...dataPost2]
        } else if (count_current > 20 && count_current <= 30) {
            let dataPost1 = await getDataImage(key_search, ky_hieu, id_key, start, 10, timeOut, stt)
            let dataPost2 = await getDataImage(key_search, ky_hieu, id_key, 11, 10, timeOut, stt)
            let dataPost3 = await getDataImage(key_search, ky_hieu, id_key, 21, count_current - 20, timeOut, stt)
            dataPost = [...dataPost1, ...dataPost2, ...dataPost3]
        } else if (count_current > 30 && count_current <= 40) {
            let dataPost1 = await getDataImage(key_search, ky_hieu, id_key, start, 10, timeOut, stt)
            let dataPost2 = await getDataImage(key_search, ky_hieu, id_key, 11, 10, timeOut, stt)
            let dataPost3 = await getDataImage(key_search, ky_hieu, id_key, 31, 10, timeOut, stt)
            let dataPost4 = await getDataImage(key_search, ky_hieu, id_key, 41, count_current - 30, timeOut, stt)
            dataPost = [...dataPost1, ...dataPost2, ...dataPost3, ...dataPost4]
        } else if (count_current > 40 && count_current <= 50) {
            let dataPost1 = await getDataImage(key_search, ky_hieu, id_key, start, 10, timeOut, stt)
            let dataPost2 = await getDataImage(key_search, ky_hieu, id_key, 11, 10, timeOut, stt)
            let dataPost3 = await getDataImage(key_search, ky_hieu, id_key, 21, 10, timeOut, stt)
            let dataPost4 = await getDataImage(key_search, ky_hieu, id_key, 31, 10, timeOut, stt)
            let dataPost5 = await getDataImage(key_search, ky_hieu, id_key, 41, count_current - 40, timeOut, stt)
            dataPost = [...dataPost1, ...dataPost2, ...dataPost3, ...dataPost4, ...dataPost5]
        } else if (count_current > 50 && count_current <= 60) {
            let dataPost1 = await getDataImage(key_search, ky_hieu, id_key, start, 10, timeOut, stt)
            let dataPost2 = await getDataImage(key_search, ky_hieu, id_key, 11, 10, timeOut, stt)
            let dataPost3 = await getDataImage(key_search, ky_hieu, id_key, 21, 10, timeOut, stt)
            let dataPost4 = await getDataImage(key_search, ky_hieu, id_key, 31, 10, timeOut, stt)
            let dataPost5 = await getDataImage(key_search, ky_hieu, id_key, 41, 10, timeOut, stt)
            let dataPost6 = await getDataImage(key_search, ky_hieu, id_key, 51, count_current - 50, timeOut, stt)
            dataPost = [...dataPost1, ...dataPost2, ...dataPost3, ...dataPost4, ...dataPost5, ...dataPost6]
        } else if (count_current > 60 && count_current <= 70) {
            let dataPost1 = await getDataImage(key_search, ky_hieu, id_key, start, 10, timeOut, stt)
            let dataPost2 = await getDataImage(key_search, ky_hieu, id_key, 11, 10, timeOut, stt)
            let dataPost3 = await getDataImage(key_search, ky_hieu, id_key, 21, 10, timeOut, stt)
            let dataPost4 = await getDataImage(key_search, ky_hieu, id_key, 31, 10, timeOut, stt)
            let dataPost5 = await getDataImage(key_search, ky_hieu, id_key, 41, 10, timeOut, stt)
            let dataPost6 = await getDataImage(key_search, ky_hieu, id_key, 51, 10, timeOut, stt)
            let dataPost7 = await getDataImage(key_search, ky_hieu, id_key, 61, count_current - 60, timeOut, stt)
            dataPost = [...dataPost1, ...dataPost2, ...dataPost3, ...dataPost4, ...dataPost5, ...dataPost6, ...dataPost7]
        } else if (count_current > 70 && count_current <= 80) {
            let dataPost1 = await getDataImage(key_search, ky_hieu, id_key, start, 10, timeOut, stt)
            let dataPost2 = await getDataImage(key_search, ky_hieu, id_key, 11, 10, timeOut, stt)
            let dataPost3 = await getDataImage(key_search, ky_hieu, id_key, 21, 10, timeOut, stt)
            let dataPost4 = await getDataImage(key_search, ky_hieu, id_key, 31, 10, timeOut, stt)
            let dataPost5 = await getDataImage(key_search, ky_hieu, id_key, 41, 10, timeOut, stt)
            let dataPost6 = await getDataImage(key_search, ky_hieu, id_key, 51, 10, timeOut, stt)
            let dataPost7 = await getDataImage(key_search, ky_hieu, id_key, 61, 10, timeOut, stt)
            let dataPost8 = await getDataImage(key_search, ky_hieu, id_key, 71, count_current - 70, timeOut, stt)
            dataPost = [...dataPost1, ...dataPost2, ...dataPost3, ...dataPost4, ...dataPost5, ...dataPost6, ...dataPost7, ...dataPost8]
        } else if (count_current > 80 && count_current <= 90) {
            let dataPost1 = await getDataImage(key_search, ky_hieu, id_key, start, 10, timeOut, stt)
            let dataPost2 = await getDataImage(key_search, ky_hieu, id_key, 11, 10, timeOut, stt)
            let dataPost3 = await getDataImage(key_search, ky_hieu, id_key, 21, 10, timeOut, stt)
            let dataPost4 = await getDataImage(key_search, ky_hieu, id_key, 31, 10, timeOut, stt)
            let dataPost5 = await getDataImage(key_search, ky_hieu, id_key, 41, 10, timeOut, stt)
            let dataPost6 = await getDataImage(key_search, ky_hieu, id_key, 51, 10, timeOut, stt)
            let dataPost7 = await getDataImage(key_search, ky_hieu, id_key, 61, 10, timeOut, stt)
            let dataPost8 = await getDataImage(key_search, ky_hieu, id_key, 71, 10, timeOut, stt)
            let dataPost9 = await getDataImage(key_search, ky_hieu, id_key, 81, count_current - 80, timeOut, stt)
            dataPost = [...dataPost1, ...dataPost2, ...dataPost3, ...dataPost4, ...dataPost5, ...dataPost6, ...dataPost7, ...dataPost8, ...dataPost9]
        } else if (count_current > 90) {
            let dataPost1 = await getDataImage(key_search, ky_hieu, id_key, start, 10, timeOut, stt)
            let dataPost2 = await getDataImage(key_search, ky_hieu, id_key, 11, 10, timeOut, stt)
            let dataPost3 = await getDataImage(key_search, ky_hieu, id_key, 21, 10, timeOut, stt)
            let dataPost4 = await getDataImage(key_search, ky_hieu, id_key, 31, 10, timeOut, stt)
            let dataPost5 = await getDataImage(key_search, ky_hieu, id_key, 41, 10, timeOut, stt)
            let dataPost6 = await getDataImage(key_search, ky_hieu, id_key, 51, 10, timeOut, stt)
            let dataPost7 = await getDataImage(key_search, ky_hieu, id_key, 61, 10, timeOut, stt)
            let dataPost8 = await getDataImage(key_search, ky_hieu, id_key, 71, 10, timeOut, stt)
            let dataPost9 = await getDataImage(key_search, ky_hieu, id_key, 81, 10, timeOut, stt)
            let dataPost10 = await getDataImage(key_search, ky_hieu, id_key, 90, 10, timeOut, stt)
            dataPost = [...dataPost1, ...dataPost2, ...dataPost3, ...dataPost4, ...dataPost5, ...dataPost6, ...dataPost7, ...dataPost8, ...dataPost9, ...dataPost10]
        }
        let result = dataPost;
        for (let i in dataPost) {
            let host_name = getHostname(dataPost[i].url)
            if (black_list.has(host_name)) {
                result = result.filter(item => {
                    return item.url !== dataPost[i].url;
                })
            }
        }

        result = await getPhanTuBySoLuong(result, so_luong)
        // count = result.length;
        // count_current = so_luong - count;

        console.log("ReSult after BLACKLIST IMAGE: ", result)

        console.log("Rusult Before BLACKLIST IMAGE: ", dataPost)

        await saveImage(result);
        // countOut += 1;

        // } while (count < so_luong && countOut < 3)
    }
    const getDataIdHaveVideo = async (id_cam) => {
        let arr1 = [];
        await ajaxCallGet(`get-data-id-have-video/${id_cam}`).then(async rs => {
            await rs.map(item => {
                arr1.push(item.id);
            })
            let reducedArray = arr1.reduce((acc, curr, _, arr) => {
                if (acc.length === 0) acc.push({ idKey: curr, count: 1 })
                else if (acc.findIndex(f => f.idKey === curr) === -1) acc.push({ idKey: curr, count: 1 })
                else ++acc[acc.findIndex(f => f.idKey === curr)].count
                return acc
            }, []);

            dispatch(changeDataKeyHaveVideo([...reducedArray]))
        })
    }

    const getDataIdHaveUrlGoogle = async (id_cam) => {
        let arr1 = [];
        await ajaxCallGet(`get-data-id-have-url-google/${id_cam}`).then(async rs => {
            await rs.map(item => {
                arr1.push(item.id);
            })
            let reducedArray = arr1.reduce((acc, curr, _, arr) => {
                if (acc.length === 0) acc.push({ idKey: curr, count: 1 })
                else if (acc.findIndex(f => f.idKey === curr) === -1) acc.push({ idKey: curr, count: 1 })
                else ++acc[acc.findIndex(f => f.idKey === curr)].count
                return acc
            }, []);

            dispatch(changeDataKeyHaveGoogle([...reducedArray]))
        })
    }

    const isCheckLimitKeyGoogle = async () => {
        let result = false;
        let options = {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            }
        }

        await fetch(URL_API_GET + 'get-key-google', options).then(rs => rs.json())
            .then(rs => {
                if (rs.length > 0) { result = true }
            })
            .catch(err => console.log(err))
        return result;
    }

    const isCheckLimitKeyYoutube = async () => {
        let result = false;
        let options = {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            }
        }

        await fetch(URL_API_GET + 'get-key-youtube', options).then(rs => rs.json())
            .then(rs => {
                if (rs.length > 0) { result = true }
            })
            .catch(err => console.log(err))
        return result;
    }

    const resetAllKeyGg = async () => {
        await ajaxCallGet(`reset-all-key-google`).then(rs => {
            console.log('reset all key gg')
        }).catch(err => console.log(err))
    }

    const resetAllKeyYt = async () => {
        await ajaxCallGet(`reset-all-key-youtube`).then(rs => {
            console.log('reset all key yt')
        }).catch(err => console.log(err))
    }

    const TestKeyGoogle = async () => {
        let KEY_API_SEARCH;
        let options = {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            }
        }

        await fetch(URL_API_GET + 'get-first-key-google', options).then(rs => rs.json())
            .then(rs => {
                if (rs.length > 0) { KEY_API_SEARCH = rs[0].key_api }
            })
            .catch(err => console.log(err))
        if (Boolean(KEY_API_SEARCH) === true) {
            let key_search = "xay dung la gi"
            await fetch(`${LINK_SEARCH}key=${KEY_API_SEARCH}&cx=${CX_SEARCH}&start=${1}&num=${2}&q=${key_search}&searchType=image&gl=vn`).then(async response => {
                if (response.status === 200) {
                    console.log("KEY IN 200 API: ", KEY_API_SEARCH)
                    return response.json()
                } else if (response.status === 429) {
                    console.log("KEY IN 429 API: ", KEY_API_SEARCH)
                }
                // response.json()
            })
                .then(async rs => {
                    if (rs) {
                        await resetAllKeyGg();
                        await UpdateCountKeyGoogle(KEY_API_SEARCH);
                    }
                }).catch(err => console.log(err))
        }
    }

    const TestKeyYoutube = async () => {
        let KEY_API_SEARCH;
        let options = {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            }
        }
        await fetch(URL_API_GET + 'get-first-key-youtube', options).then(rs => rs.json())
            .then(rs => {
                if (rs.length > 0) { KEY_API_SEARCH = rs[0].key_api }
            })
            .catch(err => console.log(err))
        if (Boolean(KEY_API_SEARCH) === true) {
            const options = {
                method: 'GET',
                url: 'https://youtube-v31.p.rapidapi.com/search',
                params: {
                    q: "xay dung la gi",
                    part: 'snippet,id',
                    maxResults: 10,
                    order: 'relevance',
                    regionCode: 'VN'
                },
                headers: {
                    'X-RapidAPI-Key': KEY_API_SEARCH,
                    'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com'
                }
            };
            //k bắt được lỗi 429
            await axios.request(options).then(async function (response) {
                console.log(response);
                if (response.status === 200) {
                    await UpdateCountKeyYoutube(KEY_API_SEARCH);
                    await resetAllKeyYt();
                }
            }).catch(function (error) {
                console.error(error);
            })
        }
    }
    const getResponseByKeyApi = async () => {

    }
    // w5.i10.w2 => w7.i10
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
                                console.log(dataPost)
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
                // for (const id_key of data_key_checked) {
                //     if (id_key) {
                //         ajaxCallGet(`update-vi-tri/${id_key}`).then(rs => {
                //             console.log("update vi tri thanh cong " + id_key);
                //         })
                //             .catch(err => console.log(err))
                //     }
                // }
                $('.spin-get-url').addClass('d-none')
                $('.status-get-url').addClass('d-none')
                $('.status-stop').removeClass('d-none')
                // dispatch(changeCheckKey([]))
                // getDataIdHaveVideo(data_current_id_cam)
                // getDataIdHaveUrlGoogle(data_current_id_cam)
                document.querySelector('input[name="key-all"]').checked = false;
                Const_Libs.TOAST.success("Hoàn thành")
                // }, 3000)
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