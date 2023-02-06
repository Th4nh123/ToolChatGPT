import axios from 'axios';
import React from 'react'
import { ajaxCallPost } from './base';

const NewProject = () => {


    const DSKL = [

    ]
    const getLinkYoutube = async (key_search, id_key, so_luong = 1) => {
        const danhSachKey = [
            "a9a62742f5mshba0c73cd4da3741p1f7ef5jsn602698d6fee1", //L
            "aadccdc40bmsh3a9f5f87c567e88p159880jsnf8304fce34dc", //TA1
            "665c3090e2msh7dbd269ebf55be3p1bb3fcjsn54557412fc5d", //TA2
            "5f4cdb1957mshc511167d3e8e1e4p1f1912jsn4a2718fe2b76", //TA3
            "580c3d2ee1msh2b1f9c22a476e60p1b32dcjsn15c0598d3625", //TA4
            "a6a81a4b80mshc3b3b3d54401c53p126001jsne35a72a3db1d", //TA5
            "3fe7b45bb8msh6efbfa124cfc1d7p17c18djsnc4b0fb246e0e",
            "c0eb40b476msh231059c886fccc4p171a55jsn86d44ff993aa",
            "f202241f8amsh2ec5fe7dc999166p15413fjsn5cf4a7250dc4",
            "14c198d128mshed863037bee2bf9p19bbbbjsn1523d70dfc7d",
            "f202241f8amsh2ec5fe7dc999166p15413fjsn5cf4a7250dc4",
            "91ceeecfdemsh84fc89f27d169c4p1eebacjsnb5ab5ce7f58e", //Nam
            "754d6fcd18msha243aa0cec081dcp16902ejsnc92beea6e9b6", //Nam
        ];
        let i = 0;
        await search_youtube(danhSachKey[i], key_search, 1).then(async rs => {
            if (rs.length > 0) {
                console.log(rs);
                let dataPost = [{
                    link: rs[0].link ? rs[0].link : '',
                    video_title: rs[0].video_title ? rs[0].video_title : '',
                    video_description: rs[0].video_description ? rs[0].video_description : '',
                    id_key: id_key
                }]
                await ajaxCallPost('save-video', dataPost).then(rs => {
                    console.log('Luu video thanh cong')
                })
                    .catch(err => {
                        console.log(err);
                    })
            } else {
                i++;
            }
        })
        console.log(i);
    }


    const search_youtube = async (key_api, key_search, so_luong = 1) => {
        let result = [];
        const options = {
            method: 'GET',
            url: 'https://youtube-v31.p.rapidapi.com/search',
            params: {
                q: key_search,
                part: 'snippet,id',
                maxResults: so_luong,
                order: 'viewCount'
            },
            headers: {
                'X-RapidAPI-Key': key_api,
                'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com'
            }
        };

        await axios.request(options).then(async function (response) {
            let arr = [];
            await response.data.items.map(async (item, index) => {
                await arr.push(
                    {
                        'link': 'https://www.youtube.com/watch?v=' + item.id.videoId,
                        'video_title': item.snippet.title ? item.snippet.title : '',
                        'video_description': item.snippet.description ? item.snippet.description : ''
                    }
                );
            })
            result = [...arr];
        }).catch(function (error) {
            console.error(error);
        });
        console.log(result);
        return result;
    }
    return (
        <button>Test search Url Yt</button>
    )
}

export default NewProject