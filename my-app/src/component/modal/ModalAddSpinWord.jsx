import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ajaxCallPost } from '../libs/base';
import { Const_Libs } from '../libs/Const_Libs'

const ModalAddSpinWord = (props) => {
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
            <button type="button" className="btn btn-primary fw-bolder"  style={{ fontSize: '14px' }} data-bs-toggle="modal" data-bs-target="#myModal">
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

export default ModalAddSpinWord;