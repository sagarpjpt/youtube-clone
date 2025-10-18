import React, { useEffect, useState } from 'react'
import './Recommended.css'
import { formatViews } from '../../utils/formatViews';
import { Link } from 'react-router-dom';

const Recommended = ({categoryId}) => {

    const [apiData, setApiData] = useState([])

    const fetchData = async () => {
        const relatedVidUrl = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=50&regionCode=IN&videoCategoryId=${categoryId}&key=${import.meta.env.VITE_YT_API_KEY}`

        try{
            const res = await fetch(relatedVidUrl)
            const data = await res.json()
            // console.log(data)
            setApiData(data.items)
            console.log(apiData)
        } catch(e) {
            console.log(error)
            setApiData([])
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

  return (
    <div className='recommended'>
        {apiData.map((item, index) => {
            return (
                <Link to={`/video/${item.snippet.categoryId}/${item.id}`} className="side-video-list" key={index}>
                    <img src={item?.snippet?.thumbnails?.medium.url} alt="" />
                    <div className="vid-info">
                        <h4>{item.snippet.title}</h4>
                        <p>{item.snippet.channelTitle}</p>
                        <p>{formatViews(item.statistics.viewCount)} Views</p>
                    </div>
                </Link>
            )
        })}
    </div>
  )
}

export default Recommended