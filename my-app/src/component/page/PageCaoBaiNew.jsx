import React, { useEffect } from 'react'
import useStateRef from 'react-usestateref'
import { useSelector } from 'react-redux'

import './../../css/style.css'
import ModalPostContent from '../modal/ModalPostContent'
import PageCaoBaiLeft from '../home/PageCaoBai/PageCaoBaiLeft'
import PageCaoBaiRight from '../home/PageCaoBai/PageCaoBaiRight'
import DetailGhiChu from '../home/PageCaoBai/DetailGhiChu'

export default function PageCaoBaiNew() {
    const [value_stop_ref, set_value_stop_ref, get_value_stop_ref] = useStateRef(
        'start'
    )

    return (
        <React.Fragment>
            <ModalPostContent />
            <section id='content'>
                <div className='top-content'>
                    <div className='row justify-content-end'>
                    </div>
                </div>
                <div className='bottom-content'>
                    <div className='row '>
                        <PageCaoBaiLeft value_stop_ref={value_stop_ref} set_value_stop_ref={set_value_stop_ref} get_value_stop_ref={get_value_stop_ref} />
                        <PageCaoBaiRight value_stop_ref={value_stop_ref} set_value_stop_ref={set_value_stop_ref} get_value_stop_ref={get_value_stop_ref} />
                    </div>
                    <DetailGhiChu />
                </div>
            </section>
        </React.Fragment>
    )
}

