import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ajaxCallGet, CX_SEARCH, LINK_SEARCH } from '../../libs/base';
import { changeCurrentIdCam, changeDataKey, changeDataLang } from '../../reducer_action/BaseReducerAction';
import Select from 'react-select'

export default function ChonChienDich() {
  const dispatch = useDispatch()

  const [selectedOption, setSelectedOption] = useState({});
  const dataCam = useSelector(state => state.base.data_cam);
  const data_current_id_cam = useSelector(state => state.base.current_id_cam)

  const handleGetKeyByIdCam = (id) => {
    if (id === -1) {
      ajaxCallGet(`get-key`).then(rs => {
        dispatch(changeDataKey([...rs]));
      }).catch(err => console.log(err))
    } else {
      ajaxCallGet(`get-key-by-id-cam/` + id).then(rs => {
        dispatch(changeDataKey([...rs]));
      }).catch(err => console.log(err))
    }
  }

  const handleChangeOption = () => {

    return setSelectedOption;
  }

  useEffect(() => {
    if (selectedOption.id) {
      dispatch(changeCurrentIdCam(selectedOption.id))
      const { id, value, label } = selectedOption;

      let data_lang = { value: selectedOption.language, label: selectedOption.language }
      dispatch(changeDataLang([data_lang]))
      // setItemLocalStorage('id_cam', [id]);
      handleGetKeyByIdCam(id)

    }

  }, [selectedOption])


  return (
    <Select className='col-8 o-campaigns'
      defaultValue={dataCam.filter((item) => item.id === data_current_id_cam)}
      value={dataCam.filter((item) => item.id === data_current_id_cam)}
      onChange={handleChangeOption()}
      options={dataCam} />
  )

}