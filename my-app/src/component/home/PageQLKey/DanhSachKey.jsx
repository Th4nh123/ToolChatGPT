import React, { useEffect } from 'react'
import $ from 'jquery'
import { useDispatch, useSelector } from 'react-redux'

import { changeDataKey } from '../../reducer_action/BaseReducerAction'
import { ajaxCallGet } from '../../libs/base'


const DanhSachKey = () => {
  const dispatch = useDispatch()

  const data_current_id_cam = useSelector(state => state.base.current_id_cam)
  const dataKey = useSelector(state => state.base.data_key)

  useEffect(() => {
    if (data_current_id_cam) {
      handleGetKeyByIdCam(data_current_id_cam)
    }
    //  else {
    //   handleGetAllKey();
    // }

    $('#check-all-key').click(function () {
      if ($(this).prop('checked')) {
        $('.btn-delete-all-key').removeClass('d-none');
        $('.btn-delete-key').addClass('d-none');

        $('input[name="checkbox-key"').prop('checked', true)
      } else {
        $('.btn-delete-all-key').addClass('d-none');
        $('.btn-delete-key').removeClass('d-none');

        $('input[name="checkbox-key"').prop('checked', false)
      }
    })

  }, [])

  const handleGetKeyByIdCam = (id) => {
    ajaxCallGet('get-key-by-id-cam/' + id).then(rs => {
      console.log(rs);
      dispatch(changeDataKey([...rs]))
    }).catch(err => console.log(err))
  }

  // const handleGetAllKey = () => {
  //   ajaxCallGet('get-key').then(rs => {
  //     dispatch(changeDataKey([...rs]))
  //   }).catch(err => console.log(err))
  // }


  const findLikeKey = name_key => {
    if (name_key === '') {
      console.log(data_current_id_cam)
      if (data_current_id_cam) {
        console.log('co id')
        handleGetKeyByIdCam(data_current_id_cam)
      }
      //  else {
      //     console.log('k co id')
      //     handleGetAllKey()
      // }
    } else {
      if (data_current_id_cam) {
        ajaxCallGet('find-key/' + name_key).then(async rs => {
          let arr = await rs.filter((item) => {
            return item.id_cam === data_current_id_cam;
          })
          dispatch(changeDataKey([...arr]))
        }).catch(err => console.log(err))
      } else {
        ajaxCallGet('find-key/' + name_key).then(rs => {
          dispatch(changeDataKey([...rs]))
        }).catch(err => console.log(err))
      }

    }
  }


  return (
    <table className='table '>
      <thead>
        <tr>
          <th scope='col'>
            <input
              // className='form-check-input'
              type='checkbox'
              name='checkbox-all-key'
              id='check-all-key'
            />
          </th>
          <th
            scope='col'
            style={{backgroundColor: 'beige' }}
          >
            Tiền tố
          </th>
          <th
            scope='col'
            style={{ backgroundColor: 'beige' }}
          >
            Key cha
          </th>
          <th
            scope='col'
            style={{ backgroundColor: 'beige' }}
          >
            hậu tố
          </th>
        </tr>
      </thead>
      <tbody>
      {dataKey.length === 0 ? <tr><td style={{ width: '10%' }} colSpan="4">Không có key câu hỏi nào</td></tr> :
          (dataKey.map((item, index) => {
            return (
              <tr>
              <input
                className='form-check-input'
                type='checkbox'
                name='checkbox-key'
                data-id-key={item.id}
              />
              <td>{item.tien_to}</td>
              <td>{item.key_cha}</td>
              <td>{item.hau_to}</td>
            </tr>
            )
          }))
        }
      </tbody>
    </table>
  )
}

export default DanhSachKey