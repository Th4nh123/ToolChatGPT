import React, { useEffect, useState } from 'react'
import $ from 'jquery'
import PageBlackListNew from '../page/PageBlackListNew'
import PageCaoBaiNew from '../page/PageCaoBaiNew'
import PageFastContent from '../page/PageFastContent'
import PageNgonNgu from "../page/PageNgonNgu";
import Footer from './Footer'
import '../../css/style.css'
import { useDispatch, useSelector } from 'react-redux'
import PageChienDichNew from '../page/PageChienDichNew'
import { ajaxCallGet, getItemLocalStorage } from '../libs/base'
import { changeDataCam, changeDataKeyGoogle, changeDataKeyYoutube, changeKeyGoogle, changeTrangThaiCam , changeCurrentToken , changeTemperture  } from '../reducer_action/BaseReducerAction'
import ChonChienDich from '../home/PageCaoBai/ChonChienDich'
import ChonNgonNgu from '../home/PageCaoBai/ChonNgonNgu'
import PageQLKeyNew from '../page/PageQLKeyNew'
import PageQlKeyGoogle from '../page/PageQlKeyGoogle'
import PageQlKeyYoutube from '../page/PageQlKeyYoutube'




export default function Main() {

  // const data_current_id_cam = useSelector(state => state.base.current_id_cam)
  // let id_cam = getItemLocalStorage('id_cam')[0];

  // 
  const dataToken = useSelector(state => state.base.data_token)
    const dataTemperture = useSelector(state => state.base.data_temperture)
  const dispatch = useDispatch();
  const dataCam = useSelector(state => state.base.data_cam);
  const data_current_id_cam = useSelector(state => state.base.current_id_cam);
  const [currentCam, setCurrentCam] = useState([]);
  const [tab, setTab] = useState();

  // useEffect(() => {
  window.onbeforeunload = function async(event) {
    event = event || window.event;

    var confirmClose = 'Are you sure?';
    console.log(event.returnValue)

    // For IE and Firefox prior to version 4
    if (event) {
      ajaxCallGet(`reset-cam/${data_current_id_cam}`).then(async rs => {
        console.log('thanh cong')
        await dispatch(changeTrangThaiCam(false))
      }).catch(err => console.log(err))
      event.returnValue = confirmClose;
    }

    // For Safari
    return confirmClose;
  }

  // }, [])

  const handleGetCampaign = () => {
    let current_cam = dataCam.filter(item => {
      return item.id === data_current_id_cam;
    })

    if (current_cam.length !== 0) {
      document.title = current_cam[0].label;
    }
  }

  useEffect(() => {
    handleGetCampaign();
  }, [data_current_id_cam])

  function handleChangeTemperature(event) {
    dispatch(changeTemperture(event.target.value))
  }

  function handleChangeToken(event) {
    console.log(event.target.value);
    dispatch(changeCurrentToken(event.target.value))
  }
  return (
    <React.Fragment>
      <div className='d-flex justify-content-between align-items-center' style={{ borderBottom: '1px solid #ccc', marginBottom: '20px' }}>
        <ul
          className='col-6 nav-pills mt-2 mb-2 nav nav-content'
          id='tabs'
          role='tablist'
        >
          <li className='nav-item ms-4' role='presentation'>
            <button
              className='nav-link active'
              id='pills-home-tab'
              data-bs-toggle='pill'
              data-bs-target='#pills-home'
              type='button'
              role='tab'
              aria-controls='pills-home'
              aria-selected='true'
              onClick={() => setTab('tab1')}
            >
              Lấy Bài viết
            </button>
          </li>
          <li className='nav-item' role='presentation'>
            <button
              className='nav-link'
              id='pills-campaign-tab'
              data-bs-toggle='pill'
              data-bs-target='#pills-campaign'
              type='button'
              role='tab'
              aria-controls='pills-campaign'
              aria-selected='false'
              onClick={() => setTab('tab2')}
            >
              Chiến dịch
            </button>
          </li>
          <li className='nav-item' role='presentation'>
            <button
              className='nav-link'
              id='pills-profile-tab'
              data-bs-toggle='pill'
              data-bs-target='#pills-profile'
              type='button'
              role='tab'
              aria-controls='pills-profile'
              aria-selected='false'
              onClick={() => setTab('tab3')}
            >
              Quản lý câu hỏi
            </button>
          </li>
          <li className='nav-item' role='presentation'>
            <button
              className='nav-link'
              id='pills-keygg-tab'
              data-bs-toggle='pill'
              data-bs-target='#pills-keygg'
              type='button'
              role='tab'
              aria-controls='pills-keygg'
              aria-selected='false'
              onClick={() => setTab('tab4')}
            >
              Key Api
            </button>
          </li>
          <li className='nav-item' role='presentation'>
            <button
              className='nav-link'
              id='pills-fast-tab'
              data-bs-toggle='pill'
              data-bs-target='#pills-fast'
              type='button'
              role='tab'
              aria-controls='pills-fast'
              aria-selected='false'
              onClick={() => setTab('tab5')}
            >
              Chat Tool
            </button>
          </li>
        </ul>

        <button type="button" className="btn btn-primary fw-bolder" data-bs-toggle="modal" data-bs-target="#myModalsetting" style={{ fontSize: '14px' }}>
          Cài đặt
        </button>
        <div>
          <div className="modal fade" id="myModalsetting">
            <div className="modal-dialog modal-dialog-centered" style={{ minWidth: '700px' }}>
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title">Cài đật</h4>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" />
                </div>
                <div className="modal-body">
                  <form>
                    <div className="row">
                      <div className='col-12 px-1 d-flex align-items-center justify-content-between name-campaign mb-3'>
                        <label className='col-4 text-start fs-7 fw-bolder'>
                          Tên chiến dịch:
                        </label>
                        <ChonChienDich />

                      </div>
                      <div className='col-12 px-1 d-flex align-items-center justify-content-between name-campaign mb-3'>
                        <label className='col-4 text-start fs-7 fw-bolder'>
                          Ngôn ngữ:{' '}
                        </label>

                        <ChonNgonNgu />
                      </div>
                      <div className='col-12 px-1 d-flex align-items-center justify-content-between name-campaign mb-3'>
                        <label className='col-4 text-start fs-7 fw-bolder'>
                          Temperature:{' '}
                        </label>
                        <input type="number"
                          className="form-control" id="name-campaign"
                          placeholder="Nhập temperature...."
                          onChange={handleChangeTemperature}
                          value={dataTemperture}
                          name="temperature"
                        />
                      </div>
                      <div className='col-12 px-1 d-flex align-items-center justify-content-between name-campaign mb-3'>
                        <label className='col-4 text-start fs-7 fw-bolder'>
                          ToKen:{' '}
                        </label>

                        <input type="number"
                          className="form-control" id="name-campaign"
                          placeholder="Nhập token...."
                          onChange={handleChangeToken}
                          value={dataToken}
                          name="token"
                        />
                      </div>
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-success" data-bs-dismiss="modal">Submit</button>
                  <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className='tab-content' id='pills-tabContent'>
        <div
          className='tab-pane fade show active'
          id='pills-home'
          role='tabpanel'
          aria-labelledby='pills-home-tab'
        >
          <PageCaoBaiNew />
        </div>
        <div
          className='tab-pane fade'
          id='pills-campaign'
          role='tabpanel'
          aria-labelledby='pills-campaign-tab'
        >
          <PageChienDichNew />
        </div>
        <div
          className='tab-pane fade'
          id='pills-profile'
          role='tabpanel'
          aria-labelledby='pills-profile-tab'
        >
          <PageQLKeyNew />
        </div>
        <div
          className='tab-pane fade'
          id='pills-keygg'
          role='tabpanel'
          aria-labelledby='pills-keygg-tab'
        >
          <PageQlKeyGoogle />
        </div>

        <div
          className='tab-pane fade'
          id='pills-fast'
          role='tabpanel'
          aria-labelledby='pills-fast-tab'
        >
          <PageFastContent />
        </div>
      </div>
      <Footer />
    </React.Fragment >
  )
}