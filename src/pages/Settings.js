import React, { useState } from 'react';

import classnames from 'classnames';
import { useHistory } from 'react-router-dom';

import arrow from '../assets/images/icon-arrow.png';

//styles
import '../assets/scss/pages/settings.scss';
import Button from '../components/Button';
import { saveGameSettings } from '../utility/storage';
import { paths } from '../utility/paths';

const Settings = () => {
  const [playerCount, setPlayerCount] = useState(1);
  const [gridSize, setGridSize] = useState(4);
  const [roundTime, setRoundTime] = useState(0);

  const history = useHistory();

  const playerCounts = [1, 2, 3, 4];
  const gridSizes = [4, 6];

  const onSelectPlayerCount = (count) => {
    setPlayerCount(count);
  };

  const handleRoundTime = (increase) => {
    if (increase) {
      setRoundTime((prev) => prev + 1);
    } else {
      if (roundTime !== 0) {
        setRoundTime((prev) => prev - 1);
      }
    }
  };

  const onCancelSettings = () => {
    history.push(paths.entrance);
  };
  const onStartGame = () => {
    const gameSettings = {
      player: playerCount,
      grid: gridSize,
      time: roundTime,
    };
    saveGameSettings(gameSettings);
    history.push(paths.play);
  };

  return (
    <div className="settings-wrapper">
      <div className="adjust-settings-wrapper">
        <h2 className="settings-header">SETTINGS</h2>
        <div className="player-numbers-container">
          <div className="player-number-label">Number Of Players</div>
          <div className="player-number-selection">
            {playerCounts.map((count, i) => (
              <div
                key={i}
                className={classnames('player-number', {
                  'is-active': playerCount === count,
                })}
                onClick={() => onSelectPlayerCount(count)}
              >
                {count}
              </div>
            ))}
          </div>
        </div>
        <div className="grid-size-container">
          <div className="grid-size-label">Grid Size</div>
          <div className="grid-size-selection">
            {gridSizes.map((grid, i) => (
              <div
                key={i}
                className={classnames('grid-size', {
                  'is-active': gridSize === grid,
                  left: i === 0,
                  right: i === 1,
                })}
                onClick={() => setGridSize(grid)}
              >
                {grid}
              </div>
            ))}
          </div>
        </div>
        <div className="round-time-container">
          <div className="round-time-label">Round Time (Minutes)</div>
          <div className="round-time-selection">
            <div
              className="round-time-button left"
              onClick={() => handleRoundTime()}
            >
              <img className="round-time-input-icon" src={arrow} alt="arrow" />
            </div>
            <div className="round-time-display">{roundTime}</div>
            <div
              className="round-time-button right"
              onClick={() => handleRoundTime(true)}
            >
              <img
                className="round-time-input-icon right"
                src={arrow}
                alt="arrow"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="settings-action-buttons-wrapper">
        <Button
          className="cancel-setting-button"
          text="CANCEL"
          onClick={onCancelSettings}
        />
        <Button
          className="start-game-button"
          isGreen
          text="START"
          onClick={onStartGame}
        />
      </div>
    </div>
  );
};

export default Settings;
