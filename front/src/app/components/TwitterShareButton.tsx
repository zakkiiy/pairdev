import React from 'react';
import TwitterIcon from '@mui/icons-material/Twitter';

const TwitterShareButton = ({ twitterUrl } :any) => {
  const tweetText =`PairDev 新規募集中 \n`
  const pageUrl =`${twitterUrl}`;

  return (
    <button className="icon"
      onClick={() => {
        window.open(
          `https://twitter.com/share?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(tweetText)}`,
          '_blank'
        );
      }}
    >
      <TwitterIcon />
    </button>
  );
};

export default TwitterShareButton;