import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { selectChannel, selectLocale, fetchLocalesIfNeeded, fetchTilesIfNeeded } from '../actions';
import Picker from '../components/Picker';
import Tiles from '../components/Tiles';

class WebtilesPreviewerApp extends Component {
  constructor(props) {
    super(props);
    this.handleChannelChange = this.handleChannelChange.bind(this);
    this.handleLocaleChange = this.handleLocaleChange.bind(this);
    this.handleDistributionChange = this.handleDistributionChange.bind(this);
  }

  componentDidMount() {
    const { dispatch, selectedChannel } = this.props;
    dispatch(fetchLocalesIfNeeded(selectedChannel));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedChannel !== this.props.selectedChannel) {
      const { dispatch, selectedChannel } = nextProps;
      dispatch(fetchLocalesIfNeeded(selectedChannel));
    } else if (nextProps.selectedLocale !== this.props.selectedLocale) {
      const { dispatch, selectedChannel, selectedLocale } = nextProps;
      dispatch(fetchTilesIfNeeded(selectedChannel, selectedLocale));
    }
  }

  handleChannelChange(nextChannel) {
    this.props.dispatch(selectChannel(nextChannel));
    this.props.dispatch(selectLocale(null));
  }

  handleLocaleChange(nextLocale) {
    this.props.dispatch(selectLocale(nextLocale));
  }

  handleDistributionChange(nextDistribution) {
    // this.props.dispatch(selectDistribution(nextDistribution));
  }

  render() {
    const {
      selectedChannel,
      selectedLocale,
      channels,
      locales,
      distributions,
      tiles
    } = this.props;

    return (
      <div>
        <div id="pickers">
          <Picker title="Channel" value={selectedChannel}
                  onChange={this.handleChannelChange}
                  options={Object.keys(channels)} />

          {locales && selectedLocale &&
            <Picker title="Country/Locale" value={selectedLocale}
                    onChange={this.handleLocaleChange}
                    options={Object.keys(locales)} />
          }

          {false && distributions && selectedLocale &&
            <Picker title="Distribution" value=""
                    onChange={this.handleDistributionChange}
                    options={Object.keys(distributions)} />
          }

          {tiles &&
            tiles.length + ' tiles'
          }

          {!tiles &&
            'Loading...'
          }
        </div>

        {tiles && tiles.length > 0 &&
          <Tiles tiles={tiles} />
        }

      </div>
    );
  }
}

WebtilesPreviewerApp.propTypes = {
  selectedChannel: PropTypes.string.isRequired,
  selectedLocale: PropTypes.string,
  channels: PropTypes.object.isRequired,
  locales: PropTypes.object,
  distributions: PropTypes.array,
  tiles: PropTypes.array,
  dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  const { selectedChannel, selectedLocale, channels } = state;
  const { locales } = channels[selectedChannel];
  let distributions = [];
  let tiles = [];

  if (selectedChannel && selectedLocale && locales) {
    distributions = locales[selectedLocale].tileIndexUrl;
    tiles = locales[selectedLocale]['directoryTiles'];
  }

  return {
    selectedChannel,
    selectedLocale,
    channels,
    locales,
    distributions,
    tiles
  };
}

export default connect(mapStateToProps)(WebtilesPreviewerApp);
