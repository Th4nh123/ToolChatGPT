import $ from 'jquery'
import React, { useEffect } from 'react'
import { useState } from 'react';
import { OutTable, ExcelRenderer } from 'react-excel-renderer';
import { useDispatch, useSelector } from 'react-redux';
import { ajaxCallGet, ajaxCallPost, getHostname2 } from '../libs/base';
import { Const_Libs } from '../libs/Const_Libs';
import { changeDataBlackList } from '../reducer_action/BaseReducerAction';
import Select from 'react-select'



const options = [
  { value: 'Blacklist Web', label: 'Blacklist Web' },
  { value: 'Blacklist Báo', label: 'Blacklist Báo' },
  { value: 'Blacklist Social', label: 'Blacklist Social' },
]

const ModalInputBlackKey = (props) => {

  const { handleGetBlackListByIdCam } = props;
  const current_id_cam = useSelector(state => state.base.current_id_cam)

  const [blackKey, setBlackKey] = useState({
    domain: '',
    loai: ''
  });

  const handleSubmit = () => {
    let arr = [{
      domain: blackKey.domain,
      loai: blackKey.loai
    }]


    ajaxCallPost(`save-black-list-by-id-cam/${current_id_cam}`, arr).then(rs => {
      handleGetBlackListByIdCam()
      resetData()
      Const_Libs.TOAST.success("Thêm thành công")
    })
  }

  const resetData = () => {
    setBlackKey({
      domain: '',
      loai: ''
    })
  }
  return (
    <>
      <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#myModalBlackList">
        Thêm
      </button>
      <div>
        <div className="modal fade" id="myModalBlackList">
          <div className="modal-dialog modal-dialog-centered" style={{ minWidth: '1000px' }}>
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Thêm Blacklist</h4>
                <button type="button" className="btn-close" data-bs-dismiss="modal" />
              </div>
              <div className="modal-body">
                <form>
                  <div className="row">
                    <div className="col">
                      <label htmlFor="black-key" className="form-label fs-6 fw-bolder">Black Key</label>
                      <input type="text"
                        className="form-control" id="black-key"
                        placeholder="Nhập domain (vd: facebook.com)"
                        value={blackKey.domain}
                        onChange={(e) => setBlackKey({ ...blackKey, domain: e.target.value })}
                      />
                    </div>
                    <div className="col">
                      <label htmlFor="black-type" className="form-label fs-6 fw-bolder">Black type</label>
                      <input type="text"
                        className="form-control" id="black-type"
                        placeholder="Nhập loại"
                        value={blackKey.loai}
                        onChange={(e) => setBlackKey({ ...blackKey, loai: e.target.value })}
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



export default function PageBlacklistDomain() {
  const dispatch = useDispatch()

  const dataBlackList = useSelector(state => state.base.data_black_list)
  const dataCam = useSelector(state => state.base.data_cam)
  const current_id_cam = useSelector(state => state.base.current_id_cam)
  const [isUploading, setUploading] = useState(false);


  const handleGetAllBlackList = () => {
    ajaxCallGet('get-black-list').then(rs => {
      dispatch(changeDataBlackList([...rs]))
    }).catch(err => console.log(err))
  }

  const handleGetBlackListByIdCam = () => {
    ajaxCallGet(`get-black-list-by-id-cam/${current_id_cam}`).then(rs => {
      dispatch(changeDataBlackList([...rs]))
    }).catch(err => console.log(err))
  }


  const fileHandler = event => {
    let fileObj = event.target.files[0]
    setUploading(true);

    ExcelRenderer(fileObj, (err, resp) => {
      resp.rows.splice(0, 1);
      let newRows = resp.rows.filter(item => item.length !== 0);
      let data_list = [...newRows];
      if (err) {
        setUploading(false);
        console.log(err)
      } else {
        let arr = [];
        data_list.map(item => {
          arr.push({
            domain: item[0],
            loai: item[1]
          })
        })
        if (current_id_cam) {
          ajaxCallPost(`save-black-list-by-id-cam/${current_id_cam}`, arr).then(rs => {
            handleGetBlackListByIdCam();
            Const_Libs.TOAST.success('Thêm danh sách blackList thành công.')
          })
        } else {
          Const_Libs.TOAST.error('Vui lòng chọn chiến dịch trước khi import.')
        }
      }
    })
  }

  useEffect(() => {
    if (current_id_cam) {
      handleGetBlackListByIdCam();
    } else {
      handleGetAllBlackList();
    }

    $('#checkbox-all-black').click(function () {
      if ($(this).prop('checked')) {
        $('.btn-delete-all-bl').removeClass('d-none')
        $('.btn-delete-bl').addClass('d-none')

        $('input[name="checkbox-black-key"]').prop('checked', true);
      } else {
        $('.btn-delete-all-bl').addClass('d-none')
        $('.btn-delete-bl').removeClass('d-none')

        $('input[name="checkbox-black-key"]').prop('checked', false);
      }
    })

  }, [current_id_cam])

  const deleteBlackKeyByCheckBox = async () => {
    for (const checkbox of document.querySelectorAll(
      'input[name="checkbox-black-key"]'
    )) {
      if (checkbox.checked) {
        await ajaxCallGet(
          'delete-black-list/' + checkbox.getAttribute('data-id-black-key')
        ).then(rs => {
          checkbox.checked = false;
        }).catch(err => console.log(err))
      }
    }
    handleGetBlackListByIdCam();
    $('#checkbox-all-black').prop('checked', false)
    Const_Libs.TOAST.success('Đã xóa thành công.')
  }

  const deleteAllBlackKeyByCheckBox = () => {
    ajaxCallGet(`delete-all-black-list/${current_id_cam}`).then(rs => {
      console.log(rs);
      $('#checkbox-all-black').prop('checked', false);
      $('.btn-delete-all-bl').addClass('d-none')
      $('.btn-delete-bl').removeClass('d-none')
      Const_Libs.TOAST.success('Đã xóa thành công.')
      handleGetBlackListByIdCam();
    }).catch(err => console.log(err))
  }

  return (
    // <section style={{ width: '70%', margin: 'auto' }}>
    //   <div className='p-1 row nav_sub justify-content-between align-items-center mb-2'>
    //     <div className='col-6 d-flex flex-start align-items-center'>
    //       <div className='col-3 col-md-4'>
    //         <h5 className='title fs-5 fw-bolder'>Blacklist domain</h5>
    //       </div>
    //       <div className='col-8'>
    //         <label htmlFor='inputList' style={{ marginRight: '10px' }}>
    //           <span className='btn btn-primary'>
    //             Nhập Excel
    //           </span>
    //           <input
    //             id='inputList'
    //             key={isUploading}
    //             type='file'
    //             onChange={e => fileHandler(e)}
    //             style={{ display: 'none' }}
    //           />
    //         </label>
    //         <button
    //           type='submit'
    //           className='btn-delete-bl btn btn-primary'
    //           style={{ marginRight: '10px' }}
    //           onClick={deleteBlackKeyByCheckBox}
    //         >
    //           Xóa
    //         </button>

    //         <button
    //           type='submit'
    //           className='btn-delete-all-bl btn btn-primary d-none'
    //           style={{ marginRight: '10px' }}
    //           onClick={deleteAllBlackKeyByCheckBox}
    //         >
    //           Xóa hết
    //         </button>
    //         <ModalInputBlackKey handleGetBlackListByIdCam={handleGetBlackListByIdCam} />
    //       </div>
    //     </div>
    //     <div className='col-3 name-domain d-flex align-items-center' style={{ marginLeft: '16px' }}>
    //       <label htmlFor className='col-4 text-start fs-7 fw-bolder'>
    //         Lọc loại:{' '}
    //       </label>
    //       <Select className="col-8" options={options} />
    //     </div>
    //   </div>
    //   <div className='row content m-0 ps-2 pe-2' style={{ height: '77vh', overflow: 'scroll' }}>
    //     <table className='table' style={{ width: '100%', height: '100px' }}>
    //       <thead>
    //         <tr>
    //           <th scope='col'>
    //             <input
    //               className='form-check-input'
    //               type='checkbox'
    //               name='checkbox-all-black'
    //               id='checkbox-all-black'
    //             />
    //           </th>
    //           <th scope='col'>Domain</th>
    //           <th scope='col'>Loại</th>
    //         </tr>
    //       </thead>
    //       <tbody>
    //         {
    //           dataBlackList.map((item, index) => {
    //             return (
    //               <tr key={index}>
    //                 <td>
    //                   <input
    //                     className='form-check-input'
    //                     type='checkbox'
    //                     name="checkbox-black-key"
    //                     data-id-black-key={item.id}
    //                   />
    //                 </td>
    //                 <td>{item.domain}</td>
    //                 <td>{item.loai}</td>
    //               </tr>
    //             )
    //           })
    //         }
    //       </tbody>
    //     </table>
    //   </div>
    // </section>
    <div style={{ height: '77vh', width: '70%', margin: 'auto', border: '1px solid #ccc', borderRadius: '5px', padding: '8px', overflow: 'auto' }}>
      <div className='right-container position-relative'>
        <div
          className='row px-4 d-flex align-items-center justify-content-between position-sticky'
          style={{ top: '0', padding: '10px', background: '#fff' }}
        >
          <div className='col-8'>
            <span className='fs-7 fw-bolder'>Danh sách blackList:  </span>
            <a href='#' className='mr-2'>

            </a>
          </div>
          <div className='col-4 d-flex flex-row justify-content-end'>
            <div className='col-4 delete'>
              <label htmlFor='inputList' style={{ marginRight: '10px' }}>
                <span className='btn btn-primary fw-bolder'>
                  Nhập Excel
                </span>
                <input
                  id='inputList'
                  key={isUploading}
                  type='file'
                  onChange={e => fileHandler(e)}
                  style={{ display: 'none' }}
                />
              </label>

            </div>
            <div className='col-4 delete'>
              <ModalInputBlackKey handleGetBlackListByIdCam={handleGetBlackListByIdCam} />
            </div>
            <div className='col-4 delete'>
              <button
                type='submit'
                className='btn-delete-bl btn btn-outline-danger fw-bolder'
                style={{ marginRight: '10px' }}
                onClick={deleteBlackKeyByCheckBox}
              >
                Xóa
              </button>

              <button
                type='submit'
                className='btn-delete-all-bl btn btn-outline-danger fw-bolder d-none '
                style={{ marginRight: '10px' }}
                onClick={deleteAllBlackKeyByCheckBox}
              >
                Xóa hết
              </button>

            </div>

          </div>
        </div>
        <div className='p-3'>
          <table className='table '>
            <thead>
              <tr>
                <th scope='col' style={{ textAlign: 'center' }}>
                  <input
                    className='form-check-input'
                    type='checkbox'
                    name='checkbox-all-black'
                    id='checkbox-all-black'
                  />
                </th>
                <th />
                <th scope='col' style={{ width: '150px', backgroundColor: 'beige' }}>Domain</th>
                <th scope='col' style={{ width: '150px', backgroundColor: 'beige' }}>Loại</th>
              </tr>
            </thead>
            <tbody>
              {dataBlackList.length === 0 ? <span>BlackList đang trống</span> : ''}
              {dataBlackList.map((item, index) => {
                return (
                  <tr key={index}>
                    <td style={{
                      maxHeight: '21px',
                      width: '5%',
                      textAlign: 'center'
                    }}>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        name="checkbox-black-key"
                        data-id-black-key={item.id}
                      />
                    </td>
                    <td style={{ width: '5%', textAlign: 'center', fontWeight: 'bolder' }}>{index + 1}</td>
                    <td style={{ width: '45%' }}>{item.domain}</td>
                    <td style={{ width: '45%' }}>{item.loai}</td>
                  </tr>
                )
              })
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
