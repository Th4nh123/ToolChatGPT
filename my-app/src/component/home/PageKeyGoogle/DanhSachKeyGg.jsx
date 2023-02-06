import React from 'react'
import $ from "jquery";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const DanhSachKeyGg = () => {

  const dataKeyGoogle = useSelector(state => state.base.data_key_google)

  useEffect(() => {
    $('#check-all-key-gg').click(function () {
      if ($(this).prop('checked')) {
        $('.btn-delete-all-key-gg').removeClass('d-none')
        $('.btn-delete-key-gg').addClass('d-none')

        $('input[name="checkbox-key-api"]').prop('checked', true);
      } else {
        $('.btn-delete-all-key-gg').addClass('d-none')
        $('.btn-delete-key-gg').removeClass('d-none')

        $('input[name="checkbox-key-api"]').prop('checked', false);
      }
    })

  })
  return (
    <table className='table '>
      <colgroup>
        <col style={{ width: '1%!important' }}></col>
        <col style={{ width: '5%!important' }}></col>
        <col style={{ width: '40%!important' }}></col>
      </colgroup>
      <thead>
        <tr>
          <th style={{ width: '10%' }}>
            <input type='checkbox' id='check-all-key-gg' />
          </th>
          <th style={{ width: '10%', textAlign: 'center', backgroundColor: 'beige' }}>STT</th>
          <th style={{ textAlign: 'center', backgroundColor: 'beige' }}>Key Api</th>
        </tr>
      </thead>
      <tbody>
        {dataKeyGoogle.length === 0 ? <tr><td style={{ width: '10%' }} colSpan="3">Không có Key nào</td></tr> :
          (dataKeyGoogle.map((item, index) => {
            let class_item = `api-item api-item-${item.id}`;
            return (
              <tr key={index} className={class_item}>
                <td>
                  <input
                    type='checkbox'
                    name='checkbox-key-api'
                    data-id-key-api={item.id}
                  />
                </td>
                <td
                >
                  {index + 1}
                </td>
                <td
                >
                  {item.key_api}
                </td>
              </tr>
            )
          }))
        }
      </tbody>
    </table>
  )
}

export default DanhSachKeyGg