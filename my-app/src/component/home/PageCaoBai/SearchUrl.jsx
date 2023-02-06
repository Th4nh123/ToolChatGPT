import React from 'react'

const SearchUrl = () => {
    /**
* Tìm kiếm theo tiêu đề bài post để lấy ra url
*
* @param name: post_title của bài viết
* @author XHieu
*/

    const findByNameUrl = name => {
        if (name === '') {
            handleGetUrlByKey(get_current_id_key.current)
        } else {
            ajaxCallGet('find-like-url/' + name).then(rs => {
                for (let i = 0; i < rs.length; i++) {
                    rs[i].state = 'create'
                }
                dispatch(changeDataUrl([...rs]))
            }).catch(err => console.log(err))
        }
    }
    return (
        <div>SearchUrl</div>
    )
}

export default SearchUrl