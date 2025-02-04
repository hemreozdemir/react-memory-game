import React from 'react';
import classnames from 'classnames';

import '../assets/scss/components/action-button.scss';

const Button = ({ text, isGreen, ...props }) => {
  return (
    <button
      {...props}
      className={classnames('game-action-button', props.className, {
        green: isGreen,
      })}
    >
      {text}
    </button>
  );
};

export default Button;
