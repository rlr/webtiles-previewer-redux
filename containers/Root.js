import React, { Component } from 'react';
import { Provider } from 'react-redux';
import configureStore from '../store/configureStore';
import WebtilesPreviewerApp from './WebtilesPreviewerApp';

const store = configureStore({
    selectedChannel: 'desktop',
    selectedLocale: null,
    selectedType: null,
    channels: {
        desktop: {
            name: 'Desktop',
            localeIndexUrl: 'https://tiles.cdn.mozilla.net/desktop_tile_index_v3.json',
            isFetching: false
        },
        prerelease: {
            name: 'Prerelease',
            localeIndexUrl: 'https://tiles.cdn.mozilla.net/desktop-prerelease_tile_index_v3.json',
            isFetching: false
        },
        android: {
            name: 'Android',
            localeIndexUrl: 'https://tiles.cdn.mozilla.net/android_tile_index_v3.json',
            isFetching: false
        }
    }
});

export default class Root extends Component {
  render() {
    return (
      <Provider store={store}>
        {() => <WebtilesPreviewerApp />}
      </Provider>
    );
  }
}
