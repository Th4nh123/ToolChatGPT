import axios from 'axios';
import React from 'react'
import { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { ajaxCallGet, ajaxCallPost, CX_SEARCH, getHostname2, LINK_SEARCH, postVideo } from '../../libs/base'
import { Const_Libs } from '../../libs/Const_Libs';
import { changeCheckKey, changeKeyGoogle } from '../../reducer_action/BaseReducerAction';

const LayUrlNew = () => {
    const dispatch = useDispatch();
    const data_current_id_cam = useSelector(state => state.base.current_id_cam)
    const data_url_all = useSelector(state => state.base.data_url_all)
    const KEY_API_SEARCH = useSelector(state => state.base.key_google);

    const countWeb = useRef({ so_lan: 0, so_luong_sau: 0, so_luong_them: 0 });
    const countImg = useRef({ so_lan: 0, so_luong_sau: 0, so_luong_them: 0 });
    const countVideo = useRef({ so_lan: 0, so_luong_sau: 0, so_luong_them: 0 });
    const countDoc = useRef({ so_lan: 0, so_luong_sau: 0, so_luong_them: 0 });
    const countPdf = useRef({ so_lan: 0, so_luong_sau: 0, so_luong_them: 0 });
    const countExcel = useRef({ so_lan: 0, so_luong_sau: 0, so_luong_them: 0 });

    const list_kh = ["w", "i", "doc", "y", "pdf", "excel"];
    const list_nd = ["Cào nội dung web",
        "Hình ảnh + Tiêu đề hình ảnh",
        "filetype:doc",
        "Video + Tiêu đề video",
        "filetype:pdf",
        "filetype:excel"];


    // const list_nd = ["Cào nội dung web",
    //     "Hình ảnh + Tiêu đề hình ảnh",
    //     "link url download Word: Filetype:doc",
    //     "Video + Tiêu đề video",
    //     "Link url download PDF: Filetype:pdf",
    //     "Link url download excel: Filetype:excel"];

    // console.log("Key hien tai dang dung: ", KEY_API_SEARCH, "--------------------------");

    const UpdateCountKeyGoogle = (KEY_API_SEARCH) => {
        ajaxCallGet(`update-count-key-google/${KEY_API_SEARCH}`)
            .then(rs => console.log("Update count thanh cong"))
            .catch(err => console.log(err))
    }



    const getNextKey = async (KEY_API_SEARCH, start, count, key_search, timeOut) => {
        await ajaxCallGet(`get-next-key-google/${KEY_API_SEARCH}`).then(async rs => {
            console.log("get next key", rs)
        }).catch(err => console.log(err))
    }


    async function getUrlByGoogle(start, count, key_search, timeOut) {
        let result;
        let KEY_API_SEARCH;
        await ajaxCallGet(`get-key-google`).then(async rs => {
            KEY_API_SEARCH = rs[0].key_api
        }).catch(err => console.log(err))
        // console.log("KEY API: ", KEY_API_SEARCH)
        if (KEY_API_SEARCH !== null) {
            await fetch(`${LINK_SEARCH}key=${KEY_API_SEARCH}&cx=${CX_SEARCH}&start=${start}&num=${count}&safe=active&q=${key_search}`).then(response => response.json())
                .then(rs => {
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            resolve(rs);
                        }, timeOut)
                    })
                })
                .then(async rs => {
                    if (rs.url) {
                        await UpdateCountKeyGoogle(KEY_API_SEARCH);
                        result = rs;
                    }
                }).catch(err => console.log(err))
            if (!result) {
                await getNextKey(KEY_API_SEARCH);
                // await getUrlByGoogle(start, count, key_search, timeOut);
            }
            return result;
        } else {
            Const_Libs.TOAST.console.error("Key Google đã hết! Vui lòng thêm hoặc đợi ngày hôm sau");
        }
    }

    async function getImageByGoogle(start, count, key_search, timeOut) {
        // &imgSize=xxlarge&imgType=photo
        let result;
        let KEY_API_SEARCH;
        await ajaxCallGet(`get-key-google`).then(rs => {
            KEY_API_SEARCH = rs[0].key_api;
        }).catch(err => console.log(err))
        if (KEY_API_SEARCH) {
            await fetch(`${LINK_SEARCH}key=${KEY_API_SEARCH}&cx=${CX_SEARCH}&start=${start}&num=${count}&q=${key_search}&searchType=image`).then(response => response.json())
                .then(rs => {
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            resolve(rs);
                        }, timeOut)
                    })
                })
                .then(async rs => {
                    if (rs.url) {
                        await UpdateCountKeyGoogle(KEY_API_SEARCH);
                        result = rs;
                    }
                }).catch(err => console.log(err))
            if (!result) {
                await getNextKey(KEY_API_SEARCH);
                // await getImageByGoogle(start, count, key_search, timeOut);
            }
            return result;
        } else {
            Const_Libs.TOAST.console.error("Key Google đã hết! Vui lòng thêm hoặc đợi ngày hôm sau");
            await ajaxCallGet(`reset-all-key-google`).catch(err => console.log(err))
        }
    }

    const PhanTich = async (kh, key_search, id_key) => {
        var timeOut = 0;
        if (kh.toLowerCase().indexOf(".")) {
            let lskh = kh.toLowerCase().split('.');
            await lskh.map(async (s, index) => {
                timeOut = timeOut + 1000;
                await docKyHieu(s, key_search, id_key, timeOut, 0);
            })
        } else {
            await docKyHieu(kh, key_search, id_key, timeOut, 1);
        }
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(timeOut);
            }, 10000)
        })
    }


    // w2.y3.w5 -> w7.y3

    const PhanTich2 = async (kh, key_search, id_key) => {
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
        await PhanTich(str, key_search, id_key);
    }



    const docKyHieu = async (skh, key_search, id_key, timeOut, stt) => {
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
            await LayUrlAll(kh, so_luong, key_search, id_key, nd, timeOut, stt)
        }
    }

    const LayUrlAll = async (kh, so_luong, key_search, id_key, nd, timeOut, stt) => {
        var index_key_api = 0;
        switch (kh) {
            case 'w': {
                // countWeb.current = {
                //     so_lan: countWeb.current.so_lan + 1,
                //     so_luong_sau: countWeb.current.so_luong_sau + so_luong,
                //     so_luong_them: so_luong,
                // }
                await postWeb(key_search, kh, id_key, 1, so_luong, timeOut, stt)
                break;
            }
            case 'y': {
                await postVideo(key_search, kh, id_key, so_luong, index_key_api, timeOut, stt)
                break;
            }
            case 'i': {
                // countImg.current = {
                //     so_lan: countImg.current.so_lan + 1,
                //     so_luong_sau: countImg.current.so_luong_sau + so_luong,
                //     so_luong_them: so_luong,
                // }
                await postImage(key_search, kh, id_key, 1, so_luong, timeOut, stt)
                break;
            }
            case 'doc': {
                // countDoc.current = {
                //     so_lan: countDoc.current.so_lan + 1,
                //     so_luong_sau: countDoc.current.so_luong_sau + so_luong,
                //     so_luong_them: so_luong,
                // }
                await postFile(key_search, kh, nd, id_key, 1, so_luong, timeOut, stt)
                break;
            }
            case 'pdf': {
                // countPdf.current = {
                //     so_lan: countPdf.current.so_lan + 1,
                //     so_luong_sau: countPdf.current.so_luong_sau + so_luong,
                //     so_luong_them: so_luong,
                // }
                await postFile(key_search, kh, nd, id_key, 1, so_luong, timeOut, stt)
                break;
            }
            case 'excel': {
                // countExcel.current = {
                //     so_lan: countExcel.current.so_lan + 1,
                //     so_luong_sau: countExcel.current.so_luong_sau + so_luong,
                //     so_luong_them: so_luong,
                // }
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
        })
        return dataPost;
    }

    const saveWeb = async (dataPost) => {
        await ajaxCallPost(`save-web`, dataPost).then(rs => {
            console.log(rs)
        }).catch(err => {
            console.log(err);
        })
    }

    const postWeb = async (key_search, ky_hieu, id_key, start, so_luong, timeOut, stt) => {
        // if (countWeb.current.so_lan === 1) {
        if (so_luong > 1 && so_luong <= 10) {
            let dataPost = await getDataWeb(key_search, ky_hieu, id_key, start, so_luong, timeOut, stt)
            await saveWeb(dataPost)
        } else if (so_luong > 10 && so_luong <= 20) {
            let dataPost1 = await getDataWeb(key_search, ky_hieu, id_key, start, 10, timeOut, stt)
            let dataPost2 = await getDataWeb(key_search, ky_hieu, id_key, 11, so_luong - 10, timeOut, stt)
            await setTimeout(async () => {
                await saveWeb([...dataPost1, ...dataPost2])
            }, 1000)
        } else if (so_luong > 20 && so_luong <= 30) {
            let dataPost1 = await getDataWeb(key_search, ky_hieu, id_key, start, 10, timeOut + 1000, stt)
            let dataPost2 = await getDataWeb(key_search, ky_hieu, id_key, 11, 10, timeOut + 1000, stt)
            let dataPost3 = await getDataWeb(key_search, ky_hieu, id_key, 21, so_luong - 20, timeOut + 1000, stt)
            await setTimeout(async () => {
                await saveWeb([...dataPost1, ...dataPost2, ...dataPost3])
            }, 1000)
        }
        else if (so_luong > 30) {
            let dataPost1 = await getDataWeb(key_search, ky_hieu, id_key, start, 10, timeOut + 1000, stt)
            let dataPost2 = await getDataWeb(key_search, ky_hieu, id_key, 11, 10, timeOut + 1000, stt)
            let dataPost3 = await getDataWeb(key_search, ky_hieu, id_key, 21, 10, timeOut + 1000, stt)
            await setTimeout(async () => {
                await saveWeb([...dataPost1, ...dataPost2, ...dataPost3])
            }, 1000)
        }
        // } else if (countWeb.current.so_lan === 2) {
        //     let start_current = countWeb.current.so_luong_sau - countWeb.current.so_luong_them;
        //     if (so_luong <= 10 && so_luong > 1) {
        //         let dataPost = await getDataWeb(key_search, ky_hieu, id_key, start_current + 1, so_luong, timeOut, stt)
        //         await saveWeb(dataPost)
        //     }
        //     else if (so_luong > 10 && so_luong <= 20) {
        //         let dataPost1 = await getDataWeb(key_search, ky_hieu, id_key, start_current + 1, 10, timeOut, stt)
        //         let dataPost2 = await getDataWeb(key_search, ky_hieu, id_key, start_current + 11, countWeb.current.so_luong_them - 10, timeOut, stt)
        //         await saveWeb([...dataPost1, ...dataPost2])
        //     }
        // }
    }

    const getDataFile = async (start, so_luong, search, key_search, timeOut, stt, ky_hieu, id_key) => {
        var dataPost = [];
        let arr = [], arr2 = [];
        await getUrlByGoogle(start, so_luong, search, timeOut).then(async rs => {
            arr = rs.items;
            await getImageByGoogle(start, so_luong, key_search, 500).then(async rs2 => {
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

            })
        })
        return dataPost;
    }

    const saveFile = async (dataPost) => {
        await ajaxCallPost(`save-file`, dataPost).then(rs => {
            console.log(rs)
        }).catch(err => { console.log(err) })

    }

    const postFile = async (key_search, ky_hieu, filetype, id_key, start, so_luong, timeOut, stt) => {
        let search = key_search + " " + filetype;
        // if (countDoc.current.so_lan === 1 || countPdf.current.so_lan === 1 || countExcel.current.so_lan === 1) {
        if (so_luong <= 10) {
            let dataPost = await getDataFile(start, so_luong, search, key_search, timeOut, stt, ky_hieu, id_key);
            await saveFile(dataPost)
        } else if (so_luong > 10 && so_luong <= 20) {
            let dataPost1 = await getDataFile(start, 10, search, key_search, timeOut, stt, ky_hieu, id_key);
            let dataPost2 = await getDataFile(11, so_luong - 10, search, key_search, timeOut, stt, ky_hieu, id_key);
            await setTimeout(async () => {
                await saveFile([...dataPost1, ...dataPost2])
            }, 1000)

        } else if (so_luong > 20 && so_luong <= 30) {
            let dataPost1 = await getDataFile(start, 10, search, key_search, timeOut + 1000, stt, ky_hieu, id_key);
            let dataPost2 = await getDataFile(11, 10, search, key_search, timeOut + 1000, stt, ky_hieu, id_key);
            let dataPost3 = await getDataFile(21, so_luong - 20, search, key_search, timeOut + 1000, stt, ky_hieu, id_key);
            await setTimeout(async () => {
                await saveFile([...dataPost1, ...dataPost2, dataPost3])
            }, 1000)
        }
        else if (so_luong > 30) {
            let dataPost1 = await getDataFile(start, 10, search, key_search, timeOut + 1000, stt, ky_hieu, id_key);
            let dataPost2 = await getDataFile(11, 10, search, key_search, timeOut + 1000, stt, ky_hieu, id_key);
            let dataPost3 = await getDataFile(21, 10, search, key_search, timeOut + 1000, stt, ky_hieu, id_key);
            await setTimeout(async () => {
                await saveFile([...dataPost1, ...dataPost2, dataPost3])
            }, 1000)
        }
        // }
        // else if (countDoc.current.so_lan === 2) {
        //     let start_current = countDoc.current.so_luong_sau - countDoc.current.so_luong_them;
        //     if (so_luong <= 10) {
        //         let dataPost = await getDataFile(start_current + 1, so_luong, search, key_search, timeOut, stt, ky_hieu, id_key);
        //         await saveFile(dataPost)
        //     } else if (so_luong > 10 && so_luong <= 20) {
        //         let dataPost1 = await getDataFile(start_current + 1, 10, search, key_search, timeOut, stt, ky_hieu, id_key);
        //         let dataPost2 = await getDataFile(start_current + 11, countDoc.current.so_luong_them - 10, search, key_search, timeOut, stt, ky_hieu, id_key);
        //         await saveFile([...dataPost1, ...dataPost2])
        //     }
        // }
        // else if (countPdf.current.so_lan === 2) {
        //     let start_current = countPdf.current.so_luong_sau - countPdf.current.so_luong_them;
        //     if (so_luong <= 10) {
        //         let dataPost = await getDataFile(start_current + 1, so_luong, search, key_search, timeOut, stt, ky_hieu, id_key);
        //         await saveFile(dataPost)
        //     } else if (so_luong > 10 && so_luong <= 20) {
        //         let dataPost1 = await getDataFile(start_current + 1, 10, search, key_search, timeOut, stt, ky_hieu, id_key);
        //         let dataPost2 = await getDataFile(start_current + 11, countPdf.current.so_luong_them - 10, search, key_search, timeOut, stt, ky_hieu, id_key);
        //         await saveFile([...dataPost1, ...dataPost2])
        //     }
        // }
        // else if (countExcel.current.so_lan === 2) {
        //     let start_current = countExcel.current.so_luong_sau - countExcel.current.so_luong_them;
        //     if (so_luong <= 10) {
        //         let dataPost = await getDataFile(start_current + 1, so_luong, search, key_search, timeOut, stt, ky_hieu, id_key);
        //         await saveFile(dataPost)
        //     } else if (so_luong > 10 && so_luong <= 20) {
        //         let dataPost1 = await getDataFile(start_current + 1, 10, search, key_search, timeOut, stt, ky_hieu, id_key);
        //         let dataPost2 = await getDataFile(start_current + 11, countExcel.current.so_luong_them - 10, search, key_search, timeOut, stt, ky_hieu, id_key);
        //         await saveFile([...dataPost1, ...dataPost2])
        //     }
        // }
    }

    const getDataImage = async (key_search, ky_hieu, id_key, start, so_luong, timeOut, stt) => {
        var dataPost = [];
        let arr = [];
        // searchType: 'image',
        // imgSize: 'xxlarge',
        // imgType: 'photo'
        await getImageByGoogle(start, so_luong, key_search, timeOut).then(async rs => {
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
        })
        return dataPost;
    }

    const saveImage = async (dataPost) => {
        await ajaxCallPost(`save-image`, dataPost).then(rs => {
            console.log(rs)
        }).catch(err => { console.log(err) })
    }

    const postImage = async (key_search, ky_hieu, id_key, start, so_luong, timeOut, stt) => {
        // if (countImg.current.so_lan === 1) {
        if (so_luong > 1 && so_luong <= 10) {
            let dataPost = await getDataImage(key_search, ky_hieu, id_key, start, so_luong, timeOut, stt)
            await saveImage(dataPost)
        } else if (so_luong > 10 && so_luong <= 20) {
            let dataPost1 = await getDataImage(key_search, ky_hieu, id_key, start, 10, timeOut, stt)
            let dataPost2 = await getDataImage(key_search, ky_hieu, id_key, 11, so_luong - 10, timeOut, stt)
            await setTimeout(async () => {
                await saveImage([...dataPost1, ...dataPost2])
            }, 1000)
        } else if (so_luong > 20 && so_luong <= 30) {
            let dataPost1 = await getDataImage(key_search, ky_hieu, id_key, start, 10, timeOut, stt)
            let dataPost2 = await getDataImage(key_search, ky_hieu, id_key, 11, 10, timeOut, stt)
            let dataPost3 = await getDataImage(key_search, ky_hieu, id_key, 21, so_luong - 20, timeOut, stt)
            await setTimeout(async () => {
                await saveImage([...dataPost1, ...dataPost2, ...dataPost3])
            }, 1000)
        } else if (so_luong > 30 && so_luong <= 40) {
            let dataPost1 = await getDataImage(key_search, ky_hieu, id_key, start, 10, timeOut, stt)
            let dataPost2 = await getDataImage(key_search, ky_hieu, id_key, 11, 10, timeOut, stt)
            let dataPost3 = await getDataImage(key_search, ky_hieu, id_key, 31, 10, timeOut, stt)
            let dataPost4 = await getDataImage(key_search, ky_hieu, id_key, 41, so_luong - 30, timeOut, stt)
            await setTimeout(async () => {
                await saveImage([...dataPost1, ...dataPost2, ...dataPost3, ...dataPost4])
            }, 1000)
        } else if (so_luong > 40 && so_luong <= 50) {
            let dataPost1 = await getDataImage(key_search, ky_hieu, id_key, start, 10, timeOut, stt)
            let dataPost2 = await getDataImage(key_search, ky_hieu, id_key, 11, 10, timeOut, stt)
            let dataPost3 = await getDataImage(key_search, ky_hieu, id_key, 21, 10, timeOut, stt)
            let dataPost4 = await getDataImage(key_search, ky_hieu, id_key, 31, 10, timeOut, stt)
            let dataPost5 = await getDataImage(key_search, ky_hieu, id_key, 41, so_luong - 40, timeOut, stt)
            let data = [...dataPost1, ...dataPost2, ...dataPost3, dataPost4, dataPost5]
            console.log(data)
            await setTimeout(async () => {
                await saveImage(data)
            }, 1000)
        } else if (so_luong > 50) {
            let dataPost1 = await getDataImage(key_search, ky_hieu, id_key, start, 10, timeOut, stt)
            let dataPost2 = await getDataImage(key_search, ky_hieu, id_key, 11, 10, timeOut, stt)
            let dataPost3 = await getDataImage(key_search, ky_hieu, id_key, 21, 10, timeOut, stt)
            let dataPost4 = await getDataImage(key_search, ky_hieu, id_key, 31, 10, timeOut, stt)
            let dataPost5 = await getDataImage(key_search, ky_hieu, id_key, 41, 10, timeOut, stt)
            await setTimeout(async () => {
                await saveImage([...dataPost1, ...dataPost2, ...dataPost3, dataPost4, dataPost5])
            }, 1000)
        }


        // } else if (countImg.current.so_lan === 2) {
        //     let start_current = countImg.current.so_luong_sau - countImg.current.so_luong_them;
        //     if (so_luong <= 10 && so_luong > 1) {
        //         let dataPost = await getDataImage(key_search, ky_hieu, id_key, start_current + 1, so_luong, timeOut, stt)
        //         await saveImage(dataPost)
        //     }
        //     else if (so_luong > 10 && so_luong <= 20) {
        //         let dataPost1 = await getDataImage(key_search, ky_hieu, id_key, start_current + 1, 10, timeOut, stt)
        //         let dataPost2 = await getDataImage(key_search, ky_hieu, id_key, start_current + 11, countImg.current.so_luong_them - 10, timeOut, stt)
        //         await saveImage([...dataPost1, ...dataPost2])
        //     }
        // }
    }
    const handleGetUrl = async () => {
        const black_list = new Map()

        await ajaxCallGet(`get-black-list-by-id-cam/${data_current_id_cam}`).then(rs => {
            console.log("Lay blackKey");
            rs.map((item, index) => {
                black_list.set(getHostname2(item.domain), index)
            })
        })
        for (const checkbox of document.querySelectorAll('input[name="key"]')) {
            if (checkbox.checked) {
                let id_key = checkbox.getAttribute('data-id-key')
                let name_key = checkbox.getAttribute('data-name-key')
                await ajaxCallGet(`get-url-by-id-key2/${id_key}`)
                    .then(async rs => {
                        if (rs.length > 0) {
                            checkbox.checked = false;
                            document.querySelector('input[name="key-all"]').checked = false;
                            console.log("Co nhieu URL hon 25, khong lam gi ca")
                            return;
                        } else {
                            await ajaxCallGet(`get-ky-hieu/${id_key}`).then(async rs => {
                                await PhanTich2(rs[0].ky_hieu, name_key, id_key).then(async rs => {
                                    checkbox.checked = false;
                                    await setTimeout(async () => {
                                        await ajaxCallGet(`update-vi-tri/${id_key}`).then(rs => {
                                            console.log("update vi tri thanh cong");
                                        }).catch(err => console.log(err))
                                    }, 10000)
                                }).catch(err => console.log(err));
                            }).catch(err => console.log(err))
                        }
                    }).catch(err => console.log(err))
            }
            // countWeb.current = {
            //     so_lan: 0,
            //     so_luong_sau: 0,
            //     so_luong_them: 0
            // }
            // countDoc.current = {
            //     so_lan: 0,
            //     so_luong_sau: 0,
            //     so_luong_them: 0
            // }
            // countImg.current = {
            //     so_lan: 0,
            //     so_luong_sau: 0,
            //     so_luong_them: 0
            // }
            // countPdf.current = {
            //     so_lan: 0,
            //     so_luong_sau: 0,
            //     so_luong_them: 0
            // }
        }
        dispatch(changeCheckKey([]))
        document.querySelector('input[name="key-all"]').checked = false;
        Const_Libs.TOAST.success("Hoàn thành")
    }
    return (
        <div className='col-3 delete'>
            <button
                type='button'
                className='fw-bolder btn btn-outline-primary'
                onClick={() => handleGetUrl()}
                // onClick={() => PhanTich2('w5.y3.w7.y2.doc', 'xay dung la gi', 10)}
                style={{ fontSize: '14px' }}
            >
                Lấy URL
            </button>
        </div>
    )
}

export default LayUrlNew