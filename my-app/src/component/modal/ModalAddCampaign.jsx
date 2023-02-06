import { useEffect } from "react";
import { useState } from "react";
import { ajaxCallGetUrlDemo, ajaxCallPost } from "../libs/base";
import Select from 'react-select'
import { Const_Libs } from "../libs/Const_Libs";

const ModalAddChienDich = (props) => {

    const { handleGetCampaign } = props;
    const [chienDich, setChienDich] = useState({
        ten: '',
        lang: ''
    });

    function SelectLanguage() {

        const [selectedOption, setSelectedOption] = useState({});

        const options = [
            { value: 'Vietnamese', label: 'Vietnamese' },
            { value: 'English', label: 'English' },
        ];

        const handleChangeOption = () => {
            //Check logic nếu đồng ý thì cho thay đổi 
            return setSelectedOption;
            //nêu không đồng ý thì không làm gì cả, hiện ra thông báo
        }

        useEffect(() => {
            if (selectedOption.value) {
                console.log(selectedOption)
                setChienDich({ ...chienDich, lang: selectedOption.value })
            }

        }, [selectedOption])

        return (
            <Select className={`col-12 o-languages`}
                value={chienDich.lang ? { value: chienDich.lang, label: chienDich.lang } : { value: "Chọn ngôn ngữ", label: "Chọn ngôn ngữ" }}
                onChange={handleChangeOption()}
                options={options} />
        )
    }

    const handleSubmit = () => {
        let arr = [{
            campaign: chienDich.ten,
            language: chienDich.lang
        }]

        ajaxCallPost(`save-cam`, arr).then(rs => {
            resetData()
            handleGetCampaign();
            Const_Libs.TOAST.success("Thêm thành công")
        })
    }

    const resetData = () => {
        setChienDich({
            ten: '',
            lang: ''
        })
    }

    return (
        <>
            <button type="button" className="btn btn-primary fw-bolder" data-bs-toggle="modal" data-bs-target="#myModalAddChienDich" style={{ fontSize: '14px' }}>
                Thêm
            </button>
            <div>
                <div className="modal fade" id="myModalAddChienDich">
                    <div className="modal-dialog modal-dialog-centered" style={{ minWidth: '700px' }}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Thêm chiến dịch</h4>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" />
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="row">
                                        <div className="col">
                                            <label htmlFor="name-campaign" className="form-label fs-6 fw-bolder">Tên chiến dịch</label>
                                            <input type="text"
                                                className="form-control" id="name-campaign"
                                                placeholder="Nhập tên chiến dịch...."
                                                value={chienDich.ten}
                                                onChange={(e) => setChienDich({ ...chienDich, ten: e.target.value })}
                                            />
                                        </div>
                                        <div className="col">
                                            <label htmlFor="lang-campaign" className="form-label fs-6 fw-bolder">Tên chiến dịch</label>
                                            <SelectLanguage />
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

export default ModalAddChienDich;