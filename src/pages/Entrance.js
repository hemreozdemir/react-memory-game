import React from 'react';

import { useHistory } from 'react-router-dom';

import Button from '../components/Button';

import { paths } from '../utility/paths';

// style
import '../assets/scss/pages/entrance.scss';

const Entrance = () => {
  const history = useHistory();
  const navigateToSettings = () => {
    history.push(paths.settings);
  };
  return (
    <div className="entrance-wrapper">
      <h2 className="entrance-header">MEMORY GAMES</h2>
      <div className="entrance-action-buttons">
        <Button text="SETTINGS" onClick={navigateToSettings} />
        <Button isGreen text="START" />
      </div>
    </div>
  );
};

export default Entrance;
