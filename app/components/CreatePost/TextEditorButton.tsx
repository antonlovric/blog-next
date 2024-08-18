'use client';

import React from 'react';

interface ITextEditorButton {
  iconName?: string;
  label?: string;
  tooltipText?: string;
  onClick: () => void;
  isActive?: boolean;
}

const TextEditorButton = (props: ITextEditorButton) => {
  return (
    <button
      onClick={props.onClick}
      className={
        props?.isActive
          ? 'text-secondary-blue transition-colors '
          : 'text-white transition-colors flex items-center justify-center'
      }
    >
      <span className="material-symbols-outlined">{props.iconName}</span>
    </button>
  );
};

export default TextEditorButton;
