import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import NhapExcel from '../home/PageSpinWord/NhapExcel';
import '../../css/style.css'
import { ajaxCallGet } from '../libs/base';
import { changeDataSpinWord } from '../reducer_action/BaseReducerAction';
import DanhSachSpin from '../home/PageSpinWord/DanhSachSpin';
import TimKiemSpin from '../home/PageSpinWord/TimKiemSpin';
import XoaSpin from '../home/PageSpinWord/XoaSpin';
import ModalAddSpinWord from '../modal/ModalAddSpinWord'

export default function PageSpinWord() {
    const dispatch = useDispatch()

    const current_id_cam = useSelector(state => state.base.current_id_cam)

    const handleGetSpinByIdCam = () => {
        ajaxCallGet(`get-spin-word-by-id-cam/${current_id_cam}`).then(rs => {
            dispatch(changeDataSpinWord([...rs]))
        })
    }

    useEffect(() => {
        if (current_id_cam) {
            handleGetSpinByIdCam()
        } else {
            dispatch(changeDataSpinWord([]))
        }
    }, [current_id_cam])

    return (
        <section id="content">
            <div className="top-content d-flex justify-content-between flex-row">
                <div className="d-flex align-items-center mb-3">
                    <div className=" me-3"><span className="fs-6 fw-bolder">Spin Word</span></div>
                    <div>

                        {current_id_cam && <NhapExcel />}
                        {current_id_cam && <XoaSpin />}

                        {current_id_cam && <ModalAddSpinWord handleGetSpinByIdCam={handleGetSpinByIdCam} />}
                    </div>
                </div>
                <div>
                    <TimKiemSpin />
                </div>
            </div>
            <div className="bottom-content">
                <div className="row ">
                    <div className="right">
                        <div className="right-container">
                            <div className="p-3">
                                <DanhSachSpin />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}