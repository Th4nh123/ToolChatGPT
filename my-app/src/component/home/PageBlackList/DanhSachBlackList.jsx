import React, { useEffect } from 'react'
import $ from 'jquery'
import { useDispatch, useSelector } from 'react-redux';
import { ajaxCallGet } from '../../libs/base';
import { changeDataBlackList } from '../../reducer_action/BaseReducerAction';


const DanhSachBlackList = () => {
  const dispatch = useDispatch();
  const dataBlackList = useSelector(state => state.base.data_black_list)
  const current_id_cam = useSelector(state => state.base.current_id_cam)

  const handleGetBlackListByIdCam = () => {
    ajaxCallGet(`get-black-list-by-id-cam/${current_id_cam}`).then(rs => {
      dispatch(changeDataBlackList([...rs]))
    }).catch(err => console.log(err))
  }

  useEffect(() => {
    if (current_id_cam) {
      handleGetBlackListByIdCam();
    } else {
      dispatch(changeDataBlackList([]))
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

  return (
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
        {dataBlackList.length === 0 ? <tr><td>BlackList đang trống</td></tr> : ''}
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
  )
}

export default DanhSachBlackList