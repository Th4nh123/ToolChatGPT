import '../../css/style.css'
import $ from 'jquery'

import { OutTable, ExcelRenderer } from 'react-excel-renderer';
import { ajaxCallGet, ajaxCallPost } from '../libs/base';
import { Const_Libs } from '../libs/Const_Libs';
import { changeDataSpinWord } from '../reducer_action/BaseReducerAction';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

const ModalInputSpin = (props) => {
    const { handleGetSpinByIdCam } = props;
    const current_id_cam = useSelector(state => state.base.current_id_cam)

    const [dataSpin, setDataSpin] = useState({
        key_1: '',
        key_2: '',
        key_3: '',
        key_4: '',
        key_5: '',
        key_6: '',
        key_7: '',
        key_8: '',
        key_9: '',
        key_10: '',
        key_11: ''
    });

    const handleSubmit = () => {
        let arr = [{
            key_1: dataSpin.key_1,
            key_2: dataSpin.key_2,
            key_3: dataSpin.key_3,
            key_4: dataSpin.key_4,
            key_5: dataSpin.key_5,
            key_6: dataSpin.key_6,
            key_7: dataSpin.key_7,
            key_8: dataSpin.key_8,
            key_9: dataSpin.key_9,
            key_10: dataSpin.key_10,
            key_11: dataSpin.key_11,
        }]

        ajaxCallPost(`save-spin-word-by-id-cam/${current_id_cam}`, arr).then(rs => {
            handleGetSpinByIdCam()
            resetData()
            Const_Libs.TOAST.success("Thêm thành công")
        })
    }

    const resetData = () => {
        setDataSpin({
            key_1: '',
            key_2: '',
            key_3: '',
            key_4: '',
            key_5: '',
            key_6: '',
            key_7: '',
            key_8: '',
            key_9: '',
            key_10: '',
            key_11: ''
        })
    }
    return (
        <>
            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#myModal">
                Thêm
            </button>
            <div>
                <div className="modal fade" id="myModal">
                    <div className="modal-dialog modal-dialog-centered" style={{ minWidth: '1000px' }}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Thêm Spin Word</h4>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" />
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="row">
                                        <div className="col-4">
                                            <label htmlFor="key1" className="form-label fs-6 fw-bolder">Key 1</label>
                                            <input type="text"
                                                className="form-control" id="key1"
                                                placeholder="Key 1"
                                                value={dataSpin.key_1}
                                                onChange={(e) => setDataSpin({ ...dataSpin, key_1: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-4">
                                            <label htmlFor="key2" className="form-label fs-6 fw-bolder">Key 2</label>
                                            <input type="text"
                                                className="form-control" id="key2"
                                                placeholder="Key 2"
                                                value={dataSpin.key_2}
                                                onChange={(e) => setDataSpin({ ...dataSpin, key_2: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-4">
                                            <label htmlFor="key3" className="form-label fs-6 fw-bolder">Key 3</label>
                                            <input type="text"
                                                className="form-control" id="key3"
                                                placeholder="Key 3"
                                                value={dataSpin.key_3}
                                                onChange={(e) => setDataSpin({ ...dataSpin, key_3: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-4">
                                            <label htmlFor="key4" className="form-label fs-6 fw-bolder">Key 4</label>
                                            <input type="text"
                                                className="form-control" id="key4"
                                                placeholder="Key 4"
                                                value={dataSpin.key_4}
                                                onChange={(e) => setDataSpin({ ...dataSpin, key_4: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-4">
                                            <label htmlFor="key5" className="form-label fs-6 fw-bolder">Key 5</label>
                                            <input type="text"
                                                className="form-control" id="key5"
                                                placeholder="Key 5"
                                                value={dataSpin.key_5}
                                                onChange={(e) => setDataSpin({ ...dataSpin, key_5: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-4">
                                            <label htmlFor="key6" className="form-label fs-6 fw-bolder">Key 6</label>
                                            <input type="text"
                                                className="form-control" id="key6"
                                                placeholder="Key 6"
                                                value={dataSpin.key_6}
                                                onChange={(e) => setDataSpin({ ...dataSpin, key_6: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-4">
                                            <label htmlFor="key7" className="form-label fs-6 fw-bolder">Key 7</label>
                                            <input type="text"
                                                className="form-control" id="key7"
                                                placeholder="Key 7"
                                                value={dataSpin.key_7}
                                                onChange={(e) => setDataSpin({ ...dataSpin, key_7: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-4">
                                            <label htmlFor="key8" className="form-label fs-6 fw-bolder">Key 8</label>
                                            <input type="text"
                                                className="form-control" id="key8"
                                                placeholder="Key 8"
                                                value={dataSpin.key_8}
                                                onChange={(e) => setDataSpin({ ...dataSpin, key_8: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-4">
                                            <label htmlFor="key9" className="form-label fs-6 fw-bolder">Key 9</label>
                                            <input type="text"
                                                className="form-control" id="key9"
                                                placeholder="Key 9"
                                                value={dataSpin.key_9}
                                                onChange={(e) => setDataSpin({ ...dataSpin, key_9: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-4">
                                            <label htmlFor="key10" className="form-label fs-6 fw-bolder">Key 10</label>
                                            <input type="text"
                                                className="form-control" id="key10"
                                                placeholder="Key 10"
                                                value={dataSpin.key_10}
                                                onChange={(e) => setDataSpin({ ...dataSpin, key_10: e.target.value })}
                                            />
                                        </div>
                                        <div className="col-4">
                                            <label htmlFor="key11" className="form-label fs-6 fw-bolder">Key 11</label>
                                            <input type="text"
                                                className="form-control" id="key11"
                                                placeholder="Key 11"
                                                value={dataSpin.key_11}
                                                onChange={(e) => setDataSpin({ ...dataSpin, key_11: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-success" data-bs-dismiss="modal" onClick={handleSubmit}>Submit</button>
                                <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}


export default function PageSpinWord() {
    const dispatch = useDispatch()

    const dataSpin = useSelector(state => state.base.data_spin_word)
    const current_id_cam = useSelector(state => state.base.current_id_cam)
    const [isUploading, setUploading] = useState(false);


    const handleGetSpinByIdCam = () => {
        ajaxCallGet(`get-spin-word-by-id-cam/${current_id_cam}`).then(rs => {
            dispatch(changeDataSpinWord([...rs]))
        })
    }

    const handleGetAllSpin = () => {
        ajaxCallGet('get-spin-word').then(rs => {
            dispatch(changeDataSpinWord([...rs]))
        })
    }


    useEffect(() => {
        if (current_id_cam) {
            handleGetSpinByIdCam()
        } else {
            handleGetAllSpin();
        }
    }, [current_id_cam])


    const fileHandler = event => {
        setUploading(true);
        let fileObj = event.target.files[0]

        ExcelRenderer(fileObj, async (err, resp) => {
            resp.rows.splice(0, 1)
            let data_key = [...resp.rows.filter(item => item.length !== 0)];
            if (err) {
                setUploading(false)
                console.log(err)
            } else {
                let arr = [];
                data_key.map(item => {
                    arr.push({
                        key_1: item[0] ? item[0] : '',
                        key_2: item[1] ? item[1] : '',
                        key_3: item[2] ? item[2] : '',
                        key_4: item[3] ? item[3] : '',
                        key_5: item[4] ? item[4] : '',
                        key_6: item[5] ? item[5] : '',
                        key_7: item[6] ? item[6] : '',
                        key_8: item[7] ? item[7] : '',
                        key_9: item[8] ? item[8] : '',
                        key_10: item[9] ? item[9] : '',
                        key_11: item[10] ? item[10] : ''
                    })
                })
                if (current_id_cam) {
                    await ajaxCallPost(`save-spin-word-by-id-cam/${current_id_cam}`, arr).then(rs => {
                        handleGetSpinByIdCam();
                        Const_Libs.TOAST.success("Thêm thành công")
                    })
                } else {
                    Const_Libs.TOAST.console.error("Phải chọn chiến dịch trước khi import")
                }
            }
        })
    }

    const deleteSpinByCheckBox = async () => {
        for (const checkbox of document.querySelectorAll(
            'input[name="checkbox-spin"]'
        )) {
            if (checkbox.checked) {
                await ajaxCallGet(
                    'delete-spin-word/' + checkbox.getAttribute('data-id-spin')
                ).then(rs => {
                    checkbox.checked = false;
                })
            }
        }
        handleGetSpinByIdCam();
        Const_Libs.TOAST.success('Đã xóa thành công.')
    }

    const deleteAllSpinByCheckBox = () => {
        ajaxCallGet(`delete-all-spin-word/${current_id_cam}`).then(rs => {
            $('#checkbox-all-spin').prop('checked', false);
            $('.btn-delete-all-spin').addClass('d-none')
            $('.btn-delete-spin').removeClass('d-none')
            Const_Libs.TOAST.success('Đã xóa thành công.')
            handleGetSpinByIdCam();
        })
    }




    return (
        <section id="content">
            <div className="top-content d-flex justify-content-between flex-row">
                <div className="d-flex align-items-center mb-3">
                    <div className=" me-3"><span className="fs-5 fw-bolder">Spin Word</span></div>
                    <div>

                        <label htmlFor='inputSpinExcel' style={{ marginRight: '10px' }}>
                            <span className='btn btn-primary'>
                                Nhập Excel
                            </span>
                            <input
                                id='inputSpinExcel'
                                key={isUploading}
                                type='file'
                                onChange={e => fileHandler(e)}
                                style={{ display: 'none' }}
                            />
                        </label>
                        <button type="button" className="d-none btn-delete-all-spin btn btn-primary me-3 " onClick={(e) => deleteAllSpinByCheckBox()}>Xóa hết</button>
                        <button type="button" className="btn-delete-spin btn btn-primary me-3 " onClick={(e) => deleteSpinByCheckBox()}>Xóa</button>

                        <ModalInputSpin handleGetSpinByIdCam={handleGetSpinByIdCam} />
                    </div>
                </div>
                <div>
                    <div className="input-group" style={{ width: '300px' }}>
                        <input type="text" className="form-control" placeholder="Tìm kiếm" aria-label="Username" aria-describedby="addon-wrapping" />
                    </div>
                </div>
            </div>
            <div className="bottom-content">
                <div className="row ">
                    <div className="right">
                        <div className="right-container">
                            <div className="p-3">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th />
                                            <th>Key 1</th>
                                            <th>Key 2</th>
                                            <th>Key 3</th>
                                            <th>Key 4</th>
                                            <th>Key 5</th>
                                            <th>Key 6</th>
                                            <th>Key 7</th>
                                            <th>Key 8</th>
                                            <th>Key 9</th>
                                            <th>Key 10</th>
                                            <th>Key 11</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dataSpin.length === 0 ? "Không có dữ liệu" : ''}
                                        {dataSpin.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>
                                                        <input
                                                            className='form-check-input'
                                                            type="checkbox"
                                                            name="checkbox-spin"
                                                            data-id-spin={item.id}
                                                        />
                                                    </td>
                                                    <td>{item.key_1}</td>
                                                    <td>{item.key_2}</td>
                                                    <td>{item.key_3}</td>
                                                    <td>{item.key_4}</td>
                                                    <td>{item.key_5}</td>
                                                    <td>{item.key_6}</td>
                                                    <td>{item.key_7}</td>
                                                    <td>{item.key_8}</td>
                                                    <td>{item.key_9}</td>
                                                    <td>{item.key_10}</td>
                                                    <td>{item.key_11}</td>
                                                </tr>
                                            )
                                        })}

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}