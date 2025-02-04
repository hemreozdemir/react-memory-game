import React, { useEffect, useState } from 'react';

import classnames from 'classnames';

import { allImgPaths } from '../utility/images';

import avatar1 from '../assets/images/avatar1.png';
import avatar2 from '../assets/images/avatar2.png';
import cardBack from '../assets/images/card-back.png';
import '../assets/scss/pages/play.scss';
import { getGameSettins } from '../utility/storage';
import Button from '../components/Button';
import { useHistory } from 'react-router-dom';
import { paths } from '../utility/paths';
import { isObjEmpty } from '../utility/collection';
import { hasMultiPlayer, isGridFour } from '../utility/game';

const avatarPaths = [avatar1, avatar2];

const Play = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [randomPics, setRandomPics] = useState([]);
  const [cardInfo, setCardInfo] = useState([]);
  const [openedCard, setOpenedCard] = useState(''); // temp opened card
  const [playerTurn, setPlayerTurn] = useState(1);
  const [totalMove, setTotalMove] = useState(0);
  const [cardMap, setCardMap] = useState({});
  const [freeze, setFreeze] = useState(false);
  const [playerInfo, setPlayerInfo] = useState({});
  const [gameSettings, setGameSettings] = useState({});
  const [timer, setTimer] = useState(JSON.parse(getGameSettins()).time * 60);

  const history = useHistory();

  useEffect(() => {
    handleGameSettings();
  }, []);

  useEffect(() => {
    if (!isObjEmpty(gameSettings)) {
      chooseInGamePics();
      handleInitPlayerScore();
      setIsLoading(false);
    }
  }, [gameSettings]);

  useEffect(() => {
    let interval = setInterval(() => {
      setTimer((prev) => (prev ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    handleTurnChange();
  }, [totalMove]);

  const shuffleArray = (array) => {
    const tempArr = [...array];
    for (let i = tempArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tempArr[i], tempArr[j]] = [tempArr[j], tempArr[i]];
    }
    return tempArr;
  };

  const handleGameSettings = () => {
    const settings = JSON.parse(getGameSettins());
    const gameSet = {
      player: settings.player,
      grid: settings.grid,
      time: 2,
    };
    setGameSettings(gameSet);
  };

  const handleInitPlayerScore = () => {
    let players = {};
    [...Array(gameSettings.player)].forEach((_, i) => {
      players[i + 1] = {
        score: 0,
        moves: 0,
      };
    });

    setPlayerInfo(players);
  };

  const chooseInGamePics = () => {
    const tempPaths = shuffleArray(allImgPaths.images);
    const selectedImages =
      gameSettings.grid === 4 ? tempPaths.slice(0, 8) : tempPaths;
    const shuffled = shuffleArray([...selectedImages, ...selectedImages]);
    // const pics = shuffled.map((p) => p.path);
    let picMap = {};
    shuffled.forEach((pic) => {
      if (picMap[pic.id]) {
        picMap[`${pic.id}Match`] = {
          id: pic.id,
          path: pic.path,
          open: false,
          found: false,
        };
      } else {
        picMap[pic.id] = {
          id: pic.id,
          path: pic.path,
          open: false,
          found: false,
        };
      }
    });
    const cardInfo = shuffled.map((p) => ({
      id: p.id.replace('.png', ''),
      open: false,
      found: false,
    }));
    setRandomPics(shuffled);
    setCardInfo(cardInfo);
    setCardMap(picMap);
  };

  const handleTurnChange = () => {
    if (totalMove > 0) {
      if (totalMove % 2 === 0) {
        setFreeze(true);
        setTimeout(() => {
          if (playerTurn === gameSettings.player) {
            setPlayerTurn(1);
          } else {
            setPlayerTurn((prev) => prev + 1);
          }
          setFreeze(false);
        }, 500);
        const tempInfo = { ...playerInfo };
        tempInfo[playerTurn].moves = tempInfo[playerTurn].moves + 1;
        setPlayerInfo({ ...tempInfo });
      }
    }
  };

  // const openCard = (index) => {
  //   const tempCardInfo = [...cardInfo];
  //   tempCardInfo[index].open = true;
  //   setCardInfo([...tempCardInfo]);
  //   setOpenedCard(tempCardInfo[index]);
  //   setTotalMove((prev) => prev + 1);
  //   if (totalMove % 2 === 1) {
  //     if (openedCard.id === tempCardInfo[index].id) {
  //       console.log('found one');
  //       tempCardInfo[index].open = true;
  //       tempCardInfo[index].found = true;
  //       findFirstCard(openedCard.id);
  //       // markAsFound();
  //     } else {
  //       console.log('close ulan');
  //       // closeCards();
  //     }
  //   }
  // };
  const openCard = (cardId) => {
    const tempCardInfo = { ...cardMap };
    tempCardInfo[cardId].open = true;
    if (totalMove % 2 === 1) {
      if (openedCard.includes(cardId) || cardId.includes(openedCard)) {
        tempCardInfo[cardId].open = true;
        tempCardInfo[cardId].found = true;
        tempCardInfo[openedCard].open = true;
        tempCardInfo[openedCard].found = true;
        setPlayerInfo((prev) => ({
          ...prev,
          [playerTurn]: {
            ...playerInfo[playerTurn],
            score: playerInfo[playerTurn].score + 1,
          },
        }));

        // markAsFound();
      } else {
        setFreeze(true);
        setTimeout(() => {
          tempCardInfo[cardId].open = false;
          tempCardInfo[openedCard].open = false;
          // setTotalMove((prev) => prev + 1);
          setCardInfo({ ...tempCardInfo });
          setOpenedCard(cardId);
          setFreeze(false);
        }, 500);
        // return;
        // closeCards();
      }
      // setOpenedCard(null)
    } else {
    }
    setTotalMove((prev) => prev + 1);
    setCardInfo(tempCardInfo);
    setOpenedCard(cardId);
  };

  const onClickCard = (index) => {
    const card = Object.values(cardMap)[index];
    if (!freeze && !card.open) {
      openCard(Object.keys(cardMap)[index]);
    }
  };

  const finishGame = () => {
    history.push(paths.entrance);
  };

  const getTime = () => {
    const minute = Math.floor(timer / 60);
    const second = (timer % 60).toLocaleString('en-US', {
      minimumIntegerDigits: 2,
    });

    return `${minute}:${second}`;
  };

  const getNextPlayerInfo = () => {
    if (playerTurn === Object.keys(playerInfo).length) {
      return {
        moves: playerInfo[1].moves,
        score: playerInfo[1].score,
        index: 1,
      };
    } else {
      return {
        moves: playerInfo[playerTurn + 1]?.moves,
        score: playerInfo[playerTurn + 1]?.score,
        index: playerTurn + 1,
      };
    }
  };

  console.log('getNextPlayerInfo', getNextPlayerInfo());

  //   const chooseRandomPic = () => {
  //     const randomAnimalFile = [];
  //     const addedFileIndex = [];
  //     for (let i = 0; i < dummySettings.grid; i++) {
  //       let randomIndex = randomInt(1, 16);
  //       while (addedFileIndex.includes(randomIndex)) {
  //         randomIndex = randomInt(1, 16);
  //       }
  //       const fileName = `animal${randomIndex}.png`;
  //       const randomPic = allImgPaths[fileName];
  //       randomAnimalFile.push(randomPic);
  //       addedFileIndex.push(randomIndex);
  //     }
  //     setRandomPics(randomAnimalFile);
  //   };
  return isLoading ? (
    <div>Loading</div>
  ) : (
    <div className="play-game-wrapper">
      <div className="players-info-wrapper">
        {[...Array(gameSettings.player)].map((_, i) => (
          <div
            key={i}
            className={classnames(
              'player-container',
              `player-container-player-count-${gameSettings.player}`,
              {
                'border-right': i !== gameSettings.player - 1,
                'passive-player': i + 1 !== playerTurn,

                reversed: i % 2,
              }
            )}
          >
            <div className="player-avatar-container">
              <img className="player-avatar" src={avatarPaths[i % 2]} alt="" />
            </div>
            <div className="player-info">
              <h4 className="player-name">{i === 0 ? 'Emre' : 'Asya'}</h4>
              <div className="player-game-info">
                <div className="player-moves">
                  Moves: {playerInfo[i + 1].moves}
                </div>
                <div className="player-score">
                  Score: {playerInfo[i + 1].score}
                </div>
              </div>
            </div>
            {hasMultiPlayer(gameSettings.player) ? (
              <div className="next-player-info">
                <h4 className="player-name next-player-header">
                  Player {getNextPlayerInfo().index}
                </h4>
                <div className="player-game-info">
                  <div className="player-moves">
                    Moves: {getNextPlayerInfo().moves}
                  </div>
                  <div className="player-score">
                    Score: {getNextPlayerInfo().score}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </div>
      {timer ? <h1>{getTime()}</h1> : null}

      <div
        className="playground-container"
        style={{
          gridTemplateColumns: `repeat(${gameSettings.grid}, minmax(auto,${
            isGridFour(gameSettings.grid) ? 100 : 80
          }px))`,
        }}
      >
        {randomPics.map((pic, i) => (
          <div
            key={i}
            className="image-card-container"
            onClick={() => onClickCard(i)}
          >
            {Object.values(cardMap)[i].open ? (
              <img
                className="game-card card-image"
                src={pic.path}
                alt=""
                // style={{
                //   width: windowWidth / gameSettings.grid,
                // }}
              />
            ) : (
              <img
                className="game-card closed-card-image"
                src={cardBack}
                alt=""
                // style={{
                //   width: windowWidth / gameSettings.grid,
                // }}
              />
            )}
          </div>
        ))}
      </div>
      {/* {[...Array(gameSettings.grid)].map((_, i) => (
          <div key={i} className="board-row">
            {randomPics
              .slice(
                i * gameSettings.grid,
                i * gameSettings.grid + gameSettings.grid
              )
              ?.map((pic, j) => (
                <div
                  key={`${i}${j}`}
                  className="image-card-container"
                  onClick={() => onClickCard(i * gameSettings.grid + j)}
                >
                  {Object.values(cardMap)[i * gameSettings.grid + j].open ? (
                    <img className="card-image" src={pic.path} alt="" />
                  ) : (
                    <img className="closed-card-image" src={cardBack} alt="" />
                  )}
                </div>
              ))}
          </div>
        ))} */}

      <div className="countdown-wrapper"></div>
      <Button text="FINISH" onClick={finishGame} />
    </div>
  );
};

export default Play;
