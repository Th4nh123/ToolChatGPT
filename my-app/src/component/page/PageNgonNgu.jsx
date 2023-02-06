import $ from 'jquery'
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ajaxCallGet } from "../libs/base";
import { changeNgonNgu } from "../reducer_action/BaseReducerAction";
import ModalAddNgonNgu from "../modal/ModalAddLanguage";
import { Const_Libs } from "../libs/Const_Libs";

const PageNgonNgu = () => {
    const dispatch = useDispatch()
    const current_id_cam = useSelector(state => state.base.current_id_cam)
    const dataCam = useSelector(state => state.base.data_ngon_ngu);

    const handleGetLanguage = () => {
        ajaxCallGet(`get-language-by-id-cam/${current_id_cam}`).then(rs => {
                dispatch(changeNgonNgu([...rs]))
        })
    }

    useEffect(() => {
        if (current_id_cam) {
            handleGetLanguage();
        } 
    
        $('#checkbox-all-key').click(function () {
          if ($(this).prop('checked')) {
            $('.btn-delete-all-bl').removeClass('d-none')
            $('.btn-delete-bl').addClass('d-none')
    
            $('input[name="checkbox-language"]').prop('checked', true);
          } else {
            $('.btn-delete-all-bl').addClass('d-none')
            $('.btn-delete-bl').removeClass('d-none')
    
            $('input[name="checkbox-language"]').prop('checked', false);
          }
        })
    
      }, [current_id_cam])

    const deleteLanguageByCheckBox = async () => {
        for (const checkbox of document.querySelectorAll(
          'input[name="checkbox-language"]'
        )) {
          if (checkbox.checked) {
            await ajaxCallGet(
              'delete-language-by-id-cam/' + checkbox.getAttribute('data-id-lang')
            ).then(rs => {
              checkbox.checked = false;
            })
          }
        }
        handleGetLanguage();
        $('#checkbox-all-key').prop('checked', false)
        Const_Libs.TOAST.success('Đã xóa thành công.')
      }
    
      const deleteAllLanguageByCheckBox = () => {
        ajaxCallGet(`delete-all-language/${current_id_cam}`).then(rs => {
          console.log(rs);
          $('#checkbox-all-key').prop('checked', false);
          $('.btn-delete-all-bl').addClass('d-none')
          $('.btn-delete-bl').removeClass('d-none')
          Const_Libs.TOAST.success('Đã xóa thành công.')
          handleGetLanguage();
        })
      }

    return (
        <div style={{ height: '77vh', width: '900px', margin: 'auto', border: '1px solid #ccc', borderRadius: '5px', padding: '8px' }}>
            <div className='right-container position-relative'>
                <div
                    className='row px-4 d-flex align-items-center justify-content-between position-sticky'
                    style={{ top: '0', padding: '10px', background: '#fff' }}
                >
                    <div className='col-9'>
                        <span className='fs-7 fw-bolder'>Danh sách Ngôn ngữ: </span>
                        <a href='#' className='mr-2'>

                        </a>
                    </div>
                    <div className='col-3 d-flex flex-row justify-content-end'>
                        <div className='col-4 delete'>
                            <ModalAddNgonNgu handleGetLanguage={handleGetLanguage} />
                        </div>
                        <div className='col-6 delete'>
                            <button
                                type='submit'
                                className='btn-delete-bl btn btn-outline-danger fw-bolder'
                                style={{ marginRight: '10px' }}
                                onClick={deleteLanguageByCheckBox}
                            >
                                Xóa
                            </button>

                            <button
                                type='submit'
                                className='btn-delete-all-bl btn btn-outline-danger fw-bolder d-none '
                                style={{ marginRight: '10px' }}
                                onClick={deleteAllLanguageByCheckBox}
                            >
                                Xóa hết
                            </button>

                        </div>
                    </div>
                </div>
                <div className='p-3 table-responsive'>
                    <table className='table '>
                        <colgroup>
                            <col style={{ width: '5%!important' }}></col>
                            <col style={{ width: '5%!important' }}></col>
                            <col style={{ width: '40%!important' }}></col>
                            <col style={{ width: '40%!important' }}></col>
                            <col style={{ width: '10%!important' }}></col>
                            <col style={{ width: '10%!important' }}></col>
                        </colgroup>
                        <thead>
                            <tr>
                                <th>
                                <input
                                    className='form-check-input'
                                    type='checkbox'
                                    name='checkbox-all-key'
                                    id='checkbox-all-key'
                                />
                                </th>
                                <th />
                                <th>Ngôn ngữ</th>
                                <th>Ngôn ngữ liên quan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataCam.length === 0 ? <tr><td>Không có Ngôn ngữ nào</td></tr> :
                                (dataCam.map((item, index) => {
                                    return (
                                        <tr >
                                            <td style={{ maxHeight: '21px', width: '5%' }}>
                                                <input
                                                    type='checkbox'
                                                    name='checkbox-language'
                                                    data-id-lang={item.id}
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
                                                    width: '40%',
                                                    maxWidth: '300px'
                                                }}
                                            >
                                                {item.language}
                                            </td>
                                            <td
                                                style={{
                                                    maxHeight: '21px',
                                                    width: '20%',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                {
                                                    item.related_language
                                                }
                                            </td>
                                        </tr>
                                    )
                                }
                                ))
                            }

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default PageNgonNgu;