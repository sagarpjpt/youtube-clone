import React, { useEffect, useState } from "react";
import "./PlayVideo.css";
import video1 from "../../assets/video.mp4";
import like from "../../assets/like.png";
import dislike from "../../assets/dislike.png";
import share from "../../assets/share.png";
import save from "../../assets/save.png";
import jack from "../../assets/jack.png";
import user_profile from "../../assets/user_profile.jpg";
import { formatViews } from "../../utils/formatViews";
import moment from "moment";
import { useParams } from "react-router-dom";

const PlayVideo = () => {

    const {videoId} = useParams()

  const [apiData, setApiData] = useState(null);
  const [channelData, setChannelData] = useState(null);
  const [commentData, setCommentData] = useState([]);

  const fetchChannelData = async () => {
  try {
    // Fetch channel details
    const url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&id=${apiData?.snippet?.channelId}&key=${import.meta.env.VITE_YT_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data?.items?.length > 0) {
      setChannelData(data.items[0]);
    } else {
      console.warn("No channel data found for ID:", apiData?.snippet?.channelId);
      setChannelData(null);
    }

    // Fetch comments
    const comment_url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet,replies&maxResults=50&videoId=${videoId}&key=${import.meta.env.VITE_YT_API_KEY}`;
    const commentRes = await fetch(comment_url);
    const commentDataJson = await commentRes.json();

    if (commentDataJson?.items?.length > 0) {
      setCommentData(commentDataJson.items);
    } else {
      console.warn("No comments found for video:", videoId);
      setCommentData([]);
    }

  } catch (error) {
    console.error("Error fetching channel or comment data:", error);
    setChannelData(null);
    setCommentData([]);
  }
};

const fetchVideoData = async () => {
  try {
    const videoDetails_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${import.meta.env.VITE_YT_API_KEY}`;
    const res = await fetch(videoDetails_url);
    const data = await res.json();

    if (data?.items?.length > 0) {
      setApiData(data.items[0]);
    } else {
      console.warn("No video data found for ID:", videoId);
      setApiData(null);
    }

    console.log("Fetched video data:", data);

  } catch (error) {
    console.error("Error fetching video data:", error);
    setApiData(null);
  }
};


  useEffect(() => {
    fetchVideoData();
  }, [videoId]); //executed only once when that component is rendered

  useEffect(() => {
    fetchChannelData();
  }, [apiData]);

  return (
    <div className="play-video">
      {/* <video src={video1} controls autoPlay muted></video> */}
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        title=""
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>

      <h3>{apiData ? apiData?.snippet?.title : "Title here"}</h3>

      <div className="play-video-info">
        <p>
          {apiData ? formatViews(apiData?.statistics?.viewCount) : "16K"} Views
          &middot;{" "}
          {apiData ? moment(apiData?.snippet?.publishedAt).fromNow() : ""}
        </p>
        <div>
          <span>
            <img src={like} alt="" />{" "}
            {apiData ? formatViews(apiData?.statistics.likeCount) : "155"}
          </span>
          <span>
            <img src={dislike} alt="" />
          </span>
          <span>
            <img src={share} alt="" /> Share
          </span>
          <span>
            <img src={save} alt="" /> Save
          </span>
        </div>
      </div>

      <hr />

      <div className="publisher">
        <img
          src={channelData ? channelData.snippet.thumbnails.default.url : {user_profile}}
          alt=""
        />
        <div>
          <p>{apiData ? apiData.snippet.channelTitle : ""}</p>
          <span>
            {channelData
              ? formatViews(channelData.statistics.subscriberCount)
              : ""}{" "}
            Subscriber
          </span>
        </div>
        <button>Subscribe</button>
      </div>

      <div className="vid-description">
        <p>
          {apiData
            ? apiData.snippet.description.slice(0, 300) + "..."
            : "Description here"}
        </p>
        <hr />
        <h4>
          {apiData ? formatViews(apiData.statistics.commentCount) : 102}{" "}
          Comments
        </h4>
        {commentData.map((comment, index) => {
          return (
            <div className="comment" key={index}>
              <img src={comment?comment.snippet.topLevelComment.snippet.authorProfileImageUrl:user_profile} alt="" />
              <div>
                <h3>
                  {comment.snippet.topLevelComment.snippet.authorDisplayName} <span>1 Day ago</span>
                </h3>
                <p>
                  {comment.snippet.topLevelComment.snippet.textDisplay}
                </p>
                <div className="comment-action">
                  <img src={like} alt="" />
                  <span>{formatViews(comment.snippet.topLevelComment.snippet.likeCount)}</span>
                  <img src={dislike} alt="" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlayVideo;
