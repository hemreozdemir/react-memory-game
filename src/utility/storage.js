export const saveGameSettings = (settings) => {
  localStorage.setItem('settings', JSON.stringify(settings));
};

export const getGameSettins = () => {
  return localStorage.getItem('settings');
};
