import $ from 'jquery'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import useStateRef from 'react-usestateref'
import { ajaxCallGet, getItemLocalStorage, URL_API_WEB } from '../libs/base'
import { Const_Libs } from '../libs/Const_Libs'
import ModalGetDataKey from '../modal/ModalGetDataKey'


export default function Footer() {
  const [data_url_ref, set_data_url_ref, get_data_url_ref] = useStateRef('')
  const dataKey = useSelector(state => state.base.data_key)
  const dataUrl = useSelector(state => state.base.data_url)

  const idKey = useSelector(state => state.base.current_id_key)
  const dataCam = useSelector(state => state.base.data_cam)
  const data_current_id_cam = useSelector(state => state.base.current_id_cam)
  const [
    current_key_ref,
    set_current_key_ref,
    get_current_key_ref
  ] = useStateRef(null)
  const [
    check_url_ref,
    set_check_url_ref,
    get_check_url_ref
  ] = useStateRef(null)

  const [keyDaCao, setKeyDaCao] = useState(0)

  const handleGetLenght = () => {
    ajaxCallGet('get-key').then(rs => {
      let keyCao = rs.filter(item => {
        if (data_current_id_cam) {
          return (item.check === 1 && item.id_cam === data_current_id_cam)
        } else {
          return item.check === 1;
        }
      });
      setKeyDaCao(keyCao.length);
    }).catch(err => console.log(err))
  }


  useEffect(() => {
    set_data_url_ref(dataUrl)
  }, [dataUrl])

  useEffect(() => {
    let key = dataKey.filter(item => item.id == idKey)
    set_current_key_ref(key[0])
    handleGetLenght();
  }, [idKey, data_current_id_cam])


  return (
    <section
      id='footer'
      className='d-flex align-items-center position-fixed w-100 bg-white p-2 border shadow-sm justify-content-start'
      style={{ bottom: '0', left: '0', fontSize: '14px', minWidth: '1600px' }}
    >
      <div className='col-4 d-flex flex-start'>
        <div className='col-' style={{ width: 'auto' }}>
          <span className='footer-title fs-7 fw-bolder'>Tổng số key đã chạy: {keyDaCao}/{dataKey.length}</span>
        </div>
        <div className='progress col-7' style={{ marginLeft: '15px' }}>
          <div
            className='progress-bar'
            role='progressbar'
            style={{ width: `${keyDaCao / dataKey.length * 100}%`, backgroundColor: '#247e35' }}
            aria-valuenow={25}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      <div className='col-6 ps-3' style={{
        display: 'flex',
        alignItems: 'center',
        border: '1px solid #2357b4',
        borderRadius: '4px',
        marginLeft: '100px',
        padding: '8px 16px'
      }}>
        <span className='fs-7 fw-bolder'>Bài tập tổng hợp:</span>
        {get_data_url_ref.current.length <= 0 ? (
          <span className='ms-2'>Không có bài tổng hợp</span>
        ) : (
          ''
        )}
        {get_current_key_ref.current != null &&
          get_data_url_ref.current.length > 0 ? (
          <a
            className='link-exercise ms-2'
            target="_blank"
            href={
              URL_API_WEB +
              'top-list/wiki/' +
              get_current_key_ref.current.url_key_cha + '/' + idKey
            }>
            {URL_API_WEB +
              'top-list/wiki/' +
              get_current_key_ref.current.url_key_cha + '/' + idKey}
          </a>
        ) : (
          ''
        )}
      </div>
      {/* <div className='col-2 d-flex ' style={{ marginLeft: '32px' }}>
        <button style={{ padding: '8px 18px', background: '#28a722', color: '#fff', borderRadius: '5px' }} o>
          <a style={{ color: '#fff', textDecoration: 'none' }} target='_blank' href={URL_API_WEB + 'post/export'}>
            Xuất Excel
          </a>
        </button>
      </div> */}

      <div className='col-2 ' style={{ marginLeft: '32px', position: 'relative' }}>
        <ModalGetDataKey />
      </div>
      <div className='d-none container-modal' style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1040,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000',
        opacity: 0.5,
      }}></div>
    </section >
  )
}
