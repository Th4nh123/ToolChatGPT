import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { ajaxCallPost } from "../libs/base";
import { Const_Libs } from "../libs/Const_Libs";
import Select from 'react-select'
const ModalAddNgonNgu = (props) => {



    const { handleGetLanguage } = props;
    const current_id_cam = useSelector(state => state.base.current_id_cam)
    const [ngonNgu, setNgonNgu] = useState({
        lang: '',
        related_lang: '',
    });

    function SelectLanguage() {

        const [selectedOption, setSelectedOption] = useState();

        
        const options = [
            { value: 'Vietnamese', label: 'Vietnamese' },
            { value: 'English', label: 'English' },
            { value: 'Japanese', label: 'Japanese' }
        ];

        const handleChangeOption = (data) => {
            //Check logic nếu đồng ý thì cho thay đổi 
            setSelectedOption(data);
            //nêu không đồng ý thì không làm gì cả, hiện ra thông báo
        }

        console.log(selectedOption)

        useEffect(() => {
            // if (selectedOption.value) {
            //     // console.log(selectedOption)
            //     setNgonNgu({ ...ngonNgu, related_lang: selectedOption.value })
            // }

        }, [selectedOption])

        return (
            <Select className={`col-12 o-languages basic-multi-select`}
                // value={ngonNgu.related_lang ? { value: ngonNgu.related_lang, label: ngonNgu.related_lang } : { value: "Chọn ngôn ngữ liên quan", label: "Chọn ngôn ngữ liên quan" }}
                value={selectedOption}
                onChange={handleChangeOption}
                options={options}
                isMulti
                classNamePrefix="select"
            />
        )
    }

    const handleSubmit = () => {
        let arr = [{
            lang: ngonNgu.lang,
            related_lang: ngonNgu.related_lang,
        }]

        console.log(arr);

        ajaxCallPost(`save-language-by-id-cam/${current_id_cam}`, arr).then(rs => {
            handleGetLanguage();
            resetData()
            Const_Libs.TOAST.success("Thêm thành công")
        })
    }

    const resetData = () => {
        setNgonNgu({
            lang: '',
            related_lang: '',
        })
    }


    return (
        <>
            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#myModalAddNgonNgu" style={{ fontSize: '14px' }}>
                Thêm
            </button>
            <div>
                <div className="modal fade" id="myModalAddNgonNgu">
                    <div className="modal-dialog modal-dialog-centered" style={{ minWidth: '700px' }}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Thêm ngôn ngữ</h4>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" />
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="row">
                                        <div className="col">
                                            <label htmlFor="name-campaign" className="form-label fs-6 fw-bolder">Ngôn ngữ</label>
                                            <input type="text"
                                                className="form-control" id="name-language"
                                                placeholder="Nhập ngôn ngữ...."
                                                value={ngonNgu.lang}
                                                onChange={(e) => setNgonNgu({ ...ngonNgu, lang: e.target.value })}
                                            />
                                        </div>
                                        <div className="col">
                                            <label htmlFor="lang-campaign" className="form-label fs-6 fw-bolder">Ngôn ngữ liên quan</label>
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

export default ModalAddNgonNgu;