/* eslint-disable  */
import React, {useEffect,useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import {Icon} from '@material-ui/core';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import './TweetItem.css';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import CachedIcon from '@material-ui/icons/Cached';
import IconButton from '@material-ui/core/IconButton';
import {ReplyModal} from '../ReplyModal/ReplyModal';
import * as helper from '../../Utils/helper';
import {useHistory} from 'react-router-dom';
import Box from '@material-ui/core/Box';
import {Link} from 'react-router-dom';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import * as API from '../../Utils/API/index';
import * as Constants from '../../Utils/Constants.js';


const TweetItem = (props) => {
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [retweetCount, setRetweetCount] = useState(props.tweet?.retweet_count);
  const [isRetweeted, setIsRetweeted] = useState(props.tweet?.is_retweeted);
  const [retweetedId, setRetweetedId] = useState(props.tweet?.retweeted_id);
  const [likeCount, setLikeCount] = useState(props.tweet?.like_count);
  const [isLiked, setIsLiked] = useState(props.tweet?.is_liked);
  const [LikedId, setLikedId] = useState(props.tweet?.Liked_id);
  const [replyCount, setReplyCount] = useState(props.tweet?.reply_count);

  const userId = JSON.parse(
      localStorage.getItem(Constants.GENERAL_USER_INFO),
  )?.pk;

  const retweet = () => {
    API.createRetweet(props.tweet?.id, {'content': null}).then((res) => {
      setIsRetweeted(true);
      setRetweetCount(retweetCount+1);
      setRetweetedId(res.data.id);
    }).catch((error) => {
      console.log(error);
    });
  };

  const undoRetweet = () => {
    API.deleteTweet(retweetedId).then((res) => {
      setIsRetweeted(false);
      setRetweetCount(retweetCount-1);
    }).catch((error) => {
      console.log(error);
    });
  };

  const handleClickRetweetBtn = (event) => {
    setAnchorEl(event.currentTarget);
    setIsClosing(true);
  };

  const handleCloseRetweetBtn = () => {
    setAnchorEl(null);
  };

  const openReplyModal = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setIsClosing(true);
    setOpen(false);
  };

  const handleClickLikeBtn = (event) => {
    setlike(event.currentTarget);
    setIsClosing(true);
  };

  function like(){
    console.log(props.tweet.id,);

    API.like(props.tweet.id, {'content': null}).then((res) => {

      setIsLiked(true);
      setLikeCount(likedCount+1);
      setLikedId(res.data.id);
    }).catch((error) => {
      console.log(error);
    });
  };
  useEffect(()=>{
   
  }, [likeCount]);


  function dislike() {
    console.log('here');
    API.unlike(props.tweet.id).then((res) => {

      setIsLiked(false);
      setLikeCount(LikeCount-1);
    }).catch((error) => {
      console.log(error);
    });
  };
  const handleReply = () => {
    setReplyCount(replyCount+1);
  };

  const tweetClicked = (event) => {
    event.stopPropagation();
    const links = document.getElementsByTagName('a');
    const buttons = document.getElementsByTagName('button');
    for (let i=0; i<links.length; i++) {
      if (links[i].contains(event.target)) {
        return;
      }
    }
    for (let i=0; i<buttons.length; i++) {
      if (buttons[i].contains(event.target)) {
        return;
      }
    }
    if (open) {
      return;
    }
    if (isClosing) {
      setIsClosing(false);
      return;
    }
    history.push('/tweet/'+props.tweet?.id);
  };
  console.log(props.tweet.tweet);
  return (
    <div className={props.isInfoVisable ?'tsi-hover pointer':
    'border-1 retweet-hover br-5 pointer'}
    onClick={tweetClicked}>
      {props.tweet?.content == null &&
      <Box display="flex" alignItems="center"
        className="px-3 pt-3 b-600 mb--2 fs-14 color-gray ml-retweet-item">
        <CachedIcon fontSize="small" className="mr-2"/>
        {userId == props.tweet?.user?.id ? 'You' :
        props.tweet?.user?.first_name + ' ' +
        props.tweet?.user?.last_name} Retweeted</Box>}
      {props.tweet?.content !=null &&
      <Box
        className={props.isInfoVisable ? 'm-0 w-100 px-3 pt-3' :
         'm-0 w-100 p-3'}>
        <Box display="flex">
          <Link to={'/profile/' + props.tweet?.user?.id}>
            <Avatar className="tsi-avatar" alt="avatar"/>
          </Link>
          <Box className="ml-2">
            <Box display="flex" alignItems="center">
              <Link className="lh-0" to={'/profile/' + props.tweet?.user?.id}>
                <Tooltip
                  title={props.tweet?.user?.first_name +
                     ' ' + props.tweet?.user?.last_name}
                  placement="top-start">
                  <Typography className="tsi-name" >
                    {props.tweet?.user?.first_name +
                     ' ' + props.tweet?.user?.last_name}</Typography>
                </Tooltip>
              </Link>
              {!props.tweet?.user?.is_public &&
               <Icon className="tsi-lock-icon">lock</Icon>}
              <Typography className="tsi-date">
                <div className="tsi-dot"/>
                {helper.extractTime(props.tweet?.create_date)}
              </Typography>
            </Box>
            <Link to={'/profile/' + props.tweet?.user?.id}>
              <Tooltip title={'@'+props.tweet?.user?.username}
                placement="top-start">
                <Typography
                  className="tsi-username">@{props.tweet?.user?.username}
                </Typography>
              </Tooltip>
            </Link>
          </Box>
        </Box>
        <Typography className="mt-3 tsi-ml-avatar">
          {props.tweet?.content}
        </Typography>
      </Box>}
      {props.tweet?.retweet_from &&
      <Box className={props.tweet?.content ? 'px-3 pt-3 tsi-ml-avatar' :
       'p-0'}>
        <TweetItem isInfoVisable={props.tweet?.content ? false : true}
          tweet={props.tweet?.retweet_from}></TweetItem>
      </Box>}
      {(props.tweet?.content && props.isInfoVisable) &&
      <Box display="flex"
        justifyContent="space-around" className="px-3 py-1 fs-12">
        <div>
          <IconButton className="mr-1" >
            {isLiked && <FavoriteIcon name='dislike' color="secondary" onClick={dislike}/>}
            {!isLiked && <FavoriteBorderIcon name = 'like' onClick={like}></FavoriteBorderIcon>}
          </IconButton>
          {likeCount}
        </div>
        <div>
          <IconButton className="mr-1" onClick={openReplyModal}>
            <ChatBubbleOutlineIcon />
          </IconButton>
          {replyCount}
        </div>
        <div>
          <IconButton className="mr-1" >
            {isRetweeted && <CachedIcon color="primary" onClick={handleClickRetweetBtn}/>}
            {!isRetweeted && <CachedIcon/>}
          </IconButton>
          <Menu
            id="retweet-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleCloseRetweetBtn}
          >
            {!isRetweeted &&
             <MenuItem onClick={() => {
               handleCloseRetweetBtn();
               retweet();
             }}>Retweet</MenuItem>}
            {isRetweeted &&
             <MenuItem onClick={() => {
               handleCloseRetweetBtn();
               undoRetweet();
             }}>Undo Retweet</MenuItem>}
            <MenuItem onClick={() => {
              handleCloseRetweetBtn();
              openReplyModal();
            }}>Quote Retweet</MenuItem>
          </Menu>
          {retweetCount}
        </div>
      </Box>}
      <ReplyModal tweet={props.tweet} open={open}
        onClose={handleClose} onReply={handleReply} />
    </div>
  );
};

TweetItem.propTypes = {
  tweet: PropTypes.object,
  isInfoVisable: PropTypes.bool,
};

TweetItem.defaultProps = {
  isInfoVisable: true,
};

export default TweetItem;
