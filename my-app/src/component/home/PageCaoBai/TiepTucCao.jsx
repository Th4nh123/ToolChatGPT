import React from 'react'

const TiepTucCao = () => {
    const handleCaoLai = async () => {
        let status = 1;
        handleUpdateCam(data_current_id_cam);
        set_value_stop_ref('pendding')

        for (let x = 0; x < checkedKey.length; x++) {
            await deletePostByIdKey(checkedKey[x]);

            let indexKey = document.querySelector(`.input-key-${checkedKey[x]}`).getAttribute('data-index-key');
            // if (dataKey[indexKey].check) continue // kiem tra key check = 1 thi bo qua
            await setTimeout(() => { }, 1000)
            let data = await handleGetUrlByKey(checkedKey[x])
            dispatch(changeDataUrl([...data]))
            $(`.label-key-${checkedKey[x]}`).addClass('pendding')
            let sl_bai_da_cao = 0
            for (let i = 0; i < data.length; i++) {
                if (get_value_stop_ref.current === 'stop') {
                    $(`.label-key-${checkedKey[x]}`).removeClass('pendding')
                    handleGetKeyByIdCam(data_current_id_cam)
                    return 0
                }
                // if (data[i].check) continue
                let body = {
                    id: data[i].id,
                    url: data[i].url,
                    id_key: data[i].id_key,
                    check: data[i].check
                }
                $('.sspinner')
                    .eq(i)
                    .removeClass('d-none')

                await setTimeout(() => { }, 1000)
                set_current_url_ref(data[i].url)
                await ajaxCallPost('tool-clone', body)
                    .then(rs => {
                        if (rs.code == 200) {
                            data[i].check = true
                            data[i].post_name = rs.post_name
                            sl_bai_da_cao += 1
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
                $('.sspinner')
                    .eq(i)
                    .addClass('d-none')
                set_data_url_ref(data)
            }
            $(`.label-key-${checkedKey[x]}`).removeClass('pendding')
            if (sl_bai_da_cao >= 0) {
                await ajaxCallGet('update-key/' + checkedKey[x]).catch(err => console.log(err))
                dataKey[indexKey].check = true
            }
            if (status === 1) continue;
        }
        setCheckedKey([]);
        status = 0;
        handleResetCam(data_current_id_cam);
        dispatch(changeDataKey([...dataKey]))
        Const_Libs.TOAST.success(
            'Các key đã được cào hết.'
        )
    }
    return (
        <div>TiepTucCao</div>
    )
}

export default TiepTucCao