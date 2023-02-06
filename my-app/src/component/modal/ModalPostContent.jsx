import React from 'react'
import { useSelector } from 'react-redux'
import useStateRef from 'react-usestateref'

export default function ModalPostContent (props) {
  const detailPost = useSelector(state => state.base.data_detail_post)
  return (
    <div
      className='modal fade'
      id='exampleModal'
      tabIndex={-1}
      aria-labelledby='exampleModalLabel'
      aria-hidden='true'
    >
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title' id='exampleModalLabel'>
              {detailPost.post_title}
            </h5>
            <button
              type='button'
              className='btn-close'
              data-bs-dismiss='modal'
              aria-label='Close'
            />
          </div>
          <div className='modal-body'>{detailPost.post_content}</div>
        </div>
      </div>
    </div>
  )
}
