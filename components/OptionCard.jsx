import React from "react";

function OptionCard({ title, Icon, style, onClick, searchType, value }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-center space-x-6 opacity-70 cursor-pointer transition duration-100 
      transform hover:scale-125 hover:text-white active:text-red-500 tracking-widest uppercase ${
        searchType === value && "scale-125 opacity-100"
      }`}
    >
      <div>
        <h2 className="text-base lg:text-lg">{title}</h2>
      </div>
      <div>
        <Icon className={style} />
      </div>
    </div>
  );
}

export default OptionCard;
