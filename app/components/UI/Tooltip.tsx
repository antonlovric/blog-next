'use client';
import React, { useState } from 'react';

interface ITooltip {
  children: React.ReactNode;
  tooltipText?: string | React.ReactNode;
}

const Tooltip = (props: ITooltip) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  function showTooltip() {
    setIsTooltipVisible(true);
  }
  function hideTooltip() {
    setIsTooltipVisible(false);
  }
  return (
    <span
      className="relative flex items-center justify-center"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {isTooltipVisible ? (
        <span className="absolute bottom-[calc(100%+5px)] left-1/2 -translate-x-1/2 bg-dark-gray px-2 py-1 rounded-md">
          {props.tooltipText}
        </span>
      ) : (
        <></>
      )}
      {props.children}
    </span>
  );
};

export default Tooltip;
