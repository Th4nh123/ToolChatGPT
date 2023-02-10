import { useDispatch, useSelector } from "react-redux";

import DanhSachChienDich from '../home/PageChienDich/DanhSachChienDich';
import XoaChienDich from '../home/PageChienDich/XoaChienDich';
import ModalAddChienDich from "../modal/ModalAddCampaign";


const PageChienDichNew = () => {
    const dispatch = useDispatch();

    const dataKey = useSelector(state => state.base.data_key);

    return (
        <div style={{ height: '77vh', width: '900px', margin: 'auto', border: '1px solid #ccc', borderRadius: '5px', padding: '8px' }}>
            <div className='right-container position-relative'>
                <div
                    className='row px-4 d-flex align-items-center justify-content-between position-sticky'
                    style={{ top: '0', padding: '10px', background: '#fff' }}
                >
                    
                </div>
                <div className='p-3 table-responsive'>
                    
                </div>
            </div>
        </div>
    )
}

export default PageChienDichNew;
