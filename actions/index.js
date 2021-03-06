import fetch from 'isomorphic-fetch';

export const REQUEST_LOCALES = 'REQUEST_LOCALES';
export const RECEIVE_LOCALES = 'RECEIVE_LOCALES';
export const REQUEST_TILES = 'REQUEST_TILES';
export const RECEIVE_TILES = 'RECEIVE_TILES';
export const SELECT_CHANNEL = 'SELECT_CHANNEL';
export const SELECT_LOCALE = 'SELECT_LOCALE';

export function selectChannel(channel) {
  return {
    type: SELECT_CHANNEL,
    channel
  };
}

export function selectLocale(locale) {
  return {
    type: SELECT_LOCALE,
    locale
  };
}

function requestLocales(channel) {
  return {
    type: REQUEST_LOCALES,
    channel
  };
}

function requestTiles(channel, locale) {
  return {
    type: REQUEST_TILES,
    channel,
    locale
  };
}

function receiveLocales(channel, json) {
  // Massage the json results into what we want.
  var locales = {};
  Object.keys(json).map(function(value, index) {
    if (value === '__ver__') return;
    locales[value] = {
      tileIndexUrl: json[value].ag,
      isFetching: false
    };
  });
  return {
    type: RECEIVE_LOCALES,
    channel: channel,
    locales: locales,
    receivedAt: Date.now()
  };
}

function receiveTiles(channel, locale, json) {
  return {
    type: RECEIVE_TILES,
    channel: channel,
    locale: locale,
    directoryTiles: json.directory,
    suggestedTiles: json.suggested,
    receivedAt: Date.now()
  };
}

function fetchLocales(state, channel) {
  return dispatch => {
    dispatch(requestLocales(channel));
    let url = state.channels[channel].localeIndexUrl +
              '?_cachebust=' + new Date().toISOString();
    return fetch(url)
      .then(response => response.json())
      .then(json => dispatch(receiveLocales(channel, json)));
  };
}

function fetchTiles(state, channel, locale) {
  return dispatch => {
    dispatch(requestTiles(channel, locale));
    // TODO: Fix array index thingy below.
    let url = state.channels[channel].locales[locale].tileIndexUrl[0] +
      '?_cachebust=' + new Date().toISOString();
    return fetch(url)
      .then(response => response.json())
      .then(json => dispatch(receiveTiles(channel, locale, json)));
  };
}

function shouldFetchLocales(state, channel) {
  const channelObj = state.channels[channel];
  if (!channelObj.locales && !channelObj.isFetching) {
    return true;
  }
  return false;
}

function shouldFetchTiles(state, channel, locale) {
  const localeObj = state.channels[channel].locales[locale];
  if (localeObj && !localeObj.directoryTiles && !localeObj.isFetching) {
    return true;
  }
  return false;
}

export function fetchLocalesIfNeeded(channel) {
  return (dispatch, getState) => {
    if (shouldFetchLocales(getState(), channel)) {
      return dispatch(fetchLocales(getState(), channel));
    } else {
      return dispatch(selectLocale(Object.keys(getState().channels[channel].locales)[0]));
    }
  };
}

export function fetchTilesIfNeeded(channel, locale) {
  return (dispatch, getState) => {
    if (shouldFetchTiles(getState(), channel, locale)) {
      return dispatch(fetchTiles(getState(), channel, locale));
    }
  };
}
