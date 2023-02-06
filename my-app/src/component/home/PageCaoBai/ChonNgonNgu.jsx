import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import Select from 'react-select'

export default function ChonNgonNgu() {

  const dataLang = useSelector(state => state.base.data_lang)

  const [selectedOption, setSelectedOption] = useState({});

  const options = [
    { value: 'Vietnamese', label: 'Vietnamese' },
    { value: 'English', label: 'English' },
  ];

  const handleChangeOption = () => {
    //Check logic nếu đồng ý thì cho thay đổi 
    return setSelectedOption;
    //nêu không đồng ý thì không làm gì cả, hiện ra thông báo
  }

  return (
    <Select className={`col-8 o-languages`}
      value={dataLang}
      onChange={handleChangeOption()}
      options={options} />
  )
}