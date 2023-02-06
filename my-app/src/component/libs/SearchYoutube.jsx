import React, { useEffect, useState } from 'react'
import axios from 'axios'

// function SearchYoutube(props) {
//     const {search, soluong = 1} = props;
//     const [posts, setPosts] = useState([])
//     useEffect(() => {
//         axios({
//             "method": "GET",
//             "url": 'https://www.googleapis.com/youtube/v3/search',
//             "params": {
//                 'part': 'snippet',
//                 'maxResults': soluong,
//                 'order': 'viewCount',
//                 'key': 'AIzaSyApF-QjaMA24C0q41-Ff3zlgY45cm73Z9g',
//                 'q': search
//             }
//         })
//             .then((res) => {
//                 setPosts(res.data.items)
//             })
//             .catch((error) => {
//                 console.log(error)
//             })
//         console.log(posts);
//     }, [posts])

// }

// export default SearchYoutube