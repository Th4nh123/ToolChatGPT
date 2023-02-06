import React from 'react'
import { useState } from 'react';
import { ajaxCallGet, ajaxCallPost } from '../libs/base';
import { Const_Libs } from '../libs/Const_Libs';

const ModalAddKeyYoutube = (props) => {
    const [keyYoutube, setKeyYoutube] = useState('')
    const [description, setDescription] = useState('')
    const { handleGetAllKeyYt } = props;

    const handleSubmit = () => {
        let data = [{
                key_api: keyYoutube,
                description: description
            }]
        ajaxCallPost(`save-key-youtube`, data).then(rs => {
            Const_Libs.TOAST.success("Thêm thành công");
            handleGetAllKeyYt();
            setKeyYoutube('');
            setDescription('');
        }).catch(err => { Const_Libs.TOAST.error("Thêm thất bại"); })

    }

    
    return (
        <>
            <button type="button" className="btn btn-primary fw-bolder" data-bs-toggle="modal" data-bs-target="#myModalAddKeyYoutube" style={{ fontSize: '14px' }}>
                Thêm
            </button>
            <div>
                <div className="modal fade" id="myModalAddKeyYoutube">
                    <div className="modal-dialog modal-dialog-centered" style={{ minWidth: '700px' }}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Thêm Key Youtube</h4>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" />
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="row">
                                        <div className="col-7">
                                            <label htmlFor="name-campaign" className="form-label fs-6 fw-bolder">Key Youtube</label>
                                            <input type="text"
                                                className="form-control" id="name-campaign"
                                                placeholder="Nhập ở đây"
                                                value={keyYoutube}
                                                onChange={e => setKeyYoutube(e.target.value)}
                                            />
                                        </div>
                                        <div className="col-5">
                                            <label htmlFor="name-campaign" className="form-label fs-6 fw-bolder">Mô tả</label>
                                            <input type="text"
                                                className="form-control" id="name-campaign"
                                                placeholder="Nhập mô tả"
                                                value={description}
                                                onChange={e => setDescription(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-success" data-bs-dismiss="modal" onClick={() => handleSubmit()}>Submit</button>
                                <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ModalAddKeyYoutube