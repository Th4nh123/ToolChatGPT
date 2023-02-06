import $ from 'jquery'
import { useState } from 'react';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ajaxCallGet, ajaxCallPost, setItemLocalStorage, ajaxCallGetUrlDemo, getHostname, getHostname2 } from "../libs/base";
import { Const_Libs } from '../libs/Const_Libs';
import ModalAddChienDich from '../modal/ModalAddCampaign';
import { changeDataCam, changeDataKey } from "../reducer_action/BaseReducerAction";


const PageChienDich = () => {
    const dispatch = useDispatch()

    const dataKey = useSelector(state => state.base.data_key);
    const dataCam = useSelector(state => state.base.data_cam);
    const data_trang_thai_cam = useSelector(state => state.base.data_trang_thai_cam)



    const handleGetCampaign = () => {
        const select_all_key = {id: -1, label: 'Tất cả key', language: 'Vietnamese', check: 0} 
        ajaxCallGet(`get-cam`).then(async rs => {
            let arr = [];
            if (rs.length === 0) {
                dispatch(changeDataCam([]))
            } else {
                await rs.map(item => {
                    arr.push({ id: item.id, value: item.campaign, label: item.campaign, language: item.language, check: item.check })
                })
                dispatch(changeDataCam([...arr, select_all_key]))
            }
        })
    }


    const deleteCamByCheckBox = async () => {
        for (const checkbox of document.querySelectorAll(
            'input[name="checkbox-cam"]'
        )) {
            if (checkbox.checked) {
                await ajaxCallGet(
                    'delete-campaign/' + checkbox.getAttribute('data-id-cam')).then(rs => {
                        checkbox.checked = false
                    })
            }
        }
        $('#checkAllCam').prop('checked', false)
        handleGetCampaign();
        Const_Libs.TOAST.success('Đã xóa thành công.')
    }

    const handleGetKeyByIdCam = (id) => {
        ajaxCallGet(`get-key-by-id-cam/` + id).then(rs => {
            dispatch(changeDataKey([...rs]));
        })
    }

    // { url: 'https://baitapsgk.com/lop-8/cong-nghe-8/ban-ve-co-…i-va-ban-ve-xay-dung-dung-trong-cong-viec-gi.html' },
    // { url: 'https://sieuthibanve.com/ban-ve-xay-dung-la-gi' },
    // { url: 'https://lazi.vn/edu/exercise/ban-ve-co-khi-va-ban-ve-xay-dung-dung-trong-cong-viec-gi' },
    // { url: 'https://xaydunghoangphu.com/ban-ve-thiet-ke-xay-dung/' },
    // { url: 'https://mxaydung.vn/goc-tu-van/ban-ve-xay-dung-la-gi-cac-loai-ban-ve-thiet-ke-xay-dung/' },
    // { url: 'https://khoahocthietkenoithat.net/chuyen-muc/kien-thuc/kien-thuc-kien-truc/' },
    // { url: 'https://kientrucsuvietnam.vn/ban-ve-xay-dung-dung-de-lam-gi/' },
    // { url: 'https://khoahocthietkenoithat.net/chuyen-muc/kien-thuc/' },
    // { url: 'https://kimtrongphat.com/phan-biet-ban-ve-xin-phep-xay-dung-va-ban-ve-thiet-ke-nha/' },
    // { url: 'https://legoland.com.vn/ban-ve-xay-dung-lien-quan-den.html' },
    // { url: 'https://chungcupicityhighpark.com/ban-ve-co-khi-va-ban-ve-xay-dung-dung-trong-cac-cong-viec-gi/' },
    // { url: 'https://cjsc.vn/tin-tuc/kien-thuc-chuyen-mon/cac-loai-ban-ve-xay-dung-3857.htm' },
    // { url: 'https://www.narihamico.vn/xay-dung/ki-hieu-ban-ve-xay-dung/' },
    // { url: 'https://vlxdhiepha.com/tin-tuc/cach-doc-ban-ve-xay-dung-nhanh-va-hieu-qua-nhat-750.html' },
    // { url: 'https://hoc247.net/hoi-dap/cong-nghe-8/ban-ve-co-k…g-duoc-dung-trong-cac-cong-viec-gi-faq341907.html' },
    // { url: 'https://www.narihamico.vn/xay-dung/ki-hieu-ban-ve-xay-dung/' },
    // { url: 'https://xaynhasaigon.vn/kinh-nghiem-xay-nha/phan-b…ve-xin-giay-phep-xay-dung-va-ban-ve-thiet-ke-nha/' },
    // { url: 'https://trungtamdaynghe.edu.vn/ban-ve-xay-dung-duoc-su-dung-trong-viec-gi/' },
    // { url: 'https://www.olm.vn/hoi-dap/tim-kiem?id=24379664450…g+d%C3%B9ng+trong+c%C3%B4ng+vi%E1%BB%87c+g%C3%AC?' },
    // { url: 'https://kientruchoanggia.com/cach-doc-ban-ve-xay-dung-don-gian-cac-gia-chu-can-biet.html' },
    // { url: 'https://drhome.com.vn/thiet-ke-ket-cau-xay-dung/' },
    // { url: 'https://luathoangphi.vn/kich-thuoc-chung-trong-ban-ve-nha-la/' },
    // { url: 'https://www.elkay.vn/cach-doc-ban-ve-thiet-ke-trong-xay-dung/' },
    // { url: 'https://cityahomes.vn/cach-doc-ban-ve-xay-dung/' },
    // { url: 'https://duanpandora.vn/ban-ve-co-khi-va-ban-ve-xay-dung-dung-trong-cac-cong-viec-gi/' }
    const handleTest = async () => {
        const black_list = new Map()
        await ajaxCallGet(`get-black-list`).then(rs => {
            rs.map((item, index) => {
                black_list.set(getHostname2(item.domain), index)
            })
        })
        const url_all = [
            { url: 'https://loigiaihay.com/cau-2-trang-30-sgk-cong-nghe-8-c171a26215.html' },
            { url: 'https://www.pinterest.com/' },
            { url: 'https://acchome.com.vn/ban-ve-xay-dung-dung-de-lam-gi/' },
            { url: 'https://noithathangphat.com/ghe-van-phong/bo-ban-ghe-van-phong/' },
            { url: 'https://www.se.pinterest.com/pin/577868195949325629/?nic_v3=1a2CkuJQe' }
        ]

        let result = url_all;
        for (let i in url_all) {
            let host_name = getHostname(url_all[i].url)
            if (black_list.has(host_name)) {
                result = result.filter(item => {
                    return item.url !== url_all[i].url;
                })
            }
        }
        console.log(result);
    }

    useEffect(() => {
        handleGetCampaign()

        $('#checkAllCam').click(function () {
            if ($(this).prop('checked')) {
                $('input[name="checkbox-cam"]').prop('checked', true)
            } else {
                $('input[name="checkbox-cam"]').prop('checked', false)
            }
        })
    }, [data_trang_thai_cam])

    return (
        <div style={{ height: '77vh', width: '900px', margin: 'auto', border: '1px solid #ccc', borderRadius: '5px', padding: '8px' }}>
            <div className='right-container position-relative'>
                <div
                    className='row px-4 d-flex align-items-center justify-content-between position-sticky'
                    style={{ top: '0', padding: '10px', background: '#fff' }}
                >
                    <div className='col-9'>
                        <span className='fs-7 fw-bolder'>Danh sách chiến dịch: </span>
                        <a href='#' className='mr-2'>

                        </a>
                    </div>
                    <div className='col-3 d-flex flex-row justify-content-end'>
                        <div className='col-4 delete'>
                            <ModalAddChienDich handleGetCampaign={handleGetCampaign} />
                        </div>
                        <div className='col-4 delete'>
                            <button
                                type='button'
                                className=' fw-bolder btn btn-outline-danger'
                                style={{ fontSize: '14px' }}
                                onClick={() => deleteCamByCheckBox()}
                            // onClick={() => handleTest()}
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>
                <div className='p-3 table-responsive'>
                    <table className='table '>
                        <thead>
                            <tr>
                                <th>
                                    <input type='checkbox' id='checkAllCam' />
                                </th>
                                <th />
                                <th>Tên chiến dịch</th>
                                <th>Trạng thái</th>
                                <th>Ngôn ngữ</th>
                                {/* <th>Tổng số Key</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            <colgroup>
                                <col style={{ width: '5%!important' }}></col>
                                <col style={{ width: '5%!important' }}></col>
                                <col style={{ width: '40%!important' }}></col>
                                <col style={{ width: '40%!important' }}></col>
                                <col style={{ width: '10%!important' }}></col>
                                <col style={{ width: '10%!important' }}></col>
                            </colgroup>
                            {dataCam.length === 0 ? <td>Không có chiến dịch nào</td> :
                                (dataCam.map((item, index) => {
                                    let col_key_count = `col-count-${item.id}`
                                    return (
                                        <tr key={index}>
                                            <td style={{ maxHeight: '21px', width: '5%' }}>
                                                <input
                                                    type='checkbox'
                                                    name='checkbox-cam'
                                                    data-id-cam={item.id}
                                                />
                                            </td>
                                            <td
                                                style={{
                                                    maxHeight: '21px',
                                                    width: '5%',
                                                    textAlign: 'center'
                                                }}
                                            >
                                                {index + 1}
                                            </td>
                                            <td
                                                className='text-primary'
                                                style={{
                                                    maxHeight: '21px',
                                                    width: '30%',
                                                    maxWidth: '300px'
                                                }}
                                            >
                                                {item.value}
                                            </td>
                                            <td style={{ maxHeight: '21px', width: '20%' }}>
                                                {item.check ? 'Đang cào' : "Đã dừng"}
                                            </td>
                                            <td
                                                style={{
                                                    maxHeight: '21px',
                                                    width: '10%',
                                                    textAlign: 'center',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                {
                                                    item.language
                                                }
                                            </td>
                                            {/* <td
                                                style={{
                                                    maxHeight: '21px',
                                                    width: '10%',
                                                    textAlign: 'center'
                                                }}
                                                className={col_key_count}
                                            >
                                                1500
                                            </td> */}
                                        </tr>
                                    )
                                }))
                            }

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default PageChienDich;