import React from "react";
 
const Popup = props => {
  return (
    <div className="fixed flex bg-white60 w-screen h-screen top-0 left-0 justify-center items-center z-50">
      <div className="relative w-5/6 h-3/5 md:w-3/4 md:h-3/4 bg-white p-4 border-2 rounded-xl border-night overflow-auto z-30">
        <div className="absolute top-0 right-0">
        <button className="cursor-pointer flex justify-center items-center bg-night h-12 w-12 rounded-lg" onClick={props.handleClose}>
        <svg height="50%" viewBox="0 0 365.696 365.696" width="50%" xmlns="http://www.w3.org/2000/svg" style={{fill: '#FA9269'}} >
              <path d="m243.1875 182.859375 113.132812-113.132813c12.5-12.5 12.5-32.765624 0-45.246093l-15.082031-15.082031c-12.503906-12.503907-32.769531-12.503907-45.25 0l-113.128906 113.128906-113.132813-113.152344c-12.5-12.5-32.765624-12.5-45.246093 0l-15.105469 15.082031c-12.5 12.503907-12.5 32.769531 0 45.25l113.152344 113.152344-113.128906 113.128906c-12.503907 12.503907-12.503907 32.769531 0 45.25l15.082031 15.082031c12.5 12.5 32.765625 12.5 45.246093 0l113.132813-113.132812 113.128906 113.132812c12.503907 12.5 32.769531 12.5 45.25 0l15.082031-15.082031c12.5-12.503906 12.5-32.769531 0-45.25zm0 0"/>
            </svg>
        </button>
        </div>
        
        {props.content}
      </div>
    </div>
  );
};
 
export default Popup;