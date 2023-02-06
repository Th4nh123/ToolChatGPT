import React from 'react'
import {  useSelector } from 'react-redux';

const DanhSachSpin = () => {
  const dataSpin = useSelector(state => state.base.data_spin_word)
  return (
    <table className="table">
      <thead>
        <tr>
          <th />
          <th>Key 1</th>
          <th>Key 2</th>
          <th>Key 3</th>
          <th>Key 4</th>
          <th>Key 5</th>
          <th>Key 6</th>
          <th>Key 7</th>
          <th>Key 8</th>
          <th>Key 9</th>
          <th>Key 10</th>
          <th>Key 11</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>{dataSpin.length === 0 ? "Không có dữ liệu" : ''}</td></tr>
        {dataSpin.map((item, index) => {
          return (
            <tr key={index}>
              <td>
                <input
                  className='form-check-input'
                  type="checkbox"
                  name="checkbox-spin"
                  data-id-spin={item.id}
                />
              </td>
              <td>{item.key_1}</td>
              <td>{item.key_2}</td>
              <td>{item.key_3}</td>
              <td>{item.key_4}</td>
              <td>{item.key_5}</td>
              <td>{item.key_6}</td>
              <td>{item.key_7}</td>
              <td>{item.key_8}</td>
              <td>{item.key_9}</td>
              <td>{item.key_10}</td>
              <td>{item.key_11}</td>
            </tr>
          )
        })}

      </tbody>
    </table>
  )
}

export default DanhSachSpin