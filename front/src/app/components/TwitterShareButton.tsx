import React from 'react';
import TwitterIcon from '@mui/icons-material/Twitter';

const TwitterShareButton = ({ twitterUrl, postTitle } :any) => {
  const tweetText =`#PairDev 新規募集中 \n [${postTitle}]`
  const pageUrl =`${twitterUrl}`;

  return (
    <button className="icon"
      onClick={() => {
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(tweetText)}`,
          '_blank'
        );
      }}
    >
      <TwitterIcon />
    </button>
  );
};

export default TwitterShareButton;