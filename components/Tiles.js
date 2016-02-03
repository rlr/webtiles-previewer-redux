import React, { PropTypes, Component } from 'react';

export default class Tiles extends Component {
  render() {
    var rows = [];
    this.props.tiles.forEach(function(webtile) {
      var thumbStyle = {
        backgroundColor: webtile.bgColor,
        backgroundImage: 'url(' + webtile.imageURI + ')'
      };
      var enhancedThumbStyle = {
        backgroundImage: 'url(' + webtile.enhancedImageURI + ')'
      };

      rows.push(
        <div key={webtile.directoryId} className="newtab-cell">
          <div className={'newtab-site directory'} type={webtile.type}>
            <a className="newtab-link" href={webtile.url} title={'ID: ' + webtile.directoryId}>
              <span className="newtab-thumbnail" style={thumbStyle}></span>
              <span className="newtab-thumbnail enhanced-content" style={enhancedThumbStyle}></span>
              <span className="newtab-title">{webtile.title}</span>
            </a>
            <span className="newtab-suggested">
              <span className="newtab-suggested-bounds">
                {webtile.explanation}
              </span>
            </span>
          </div>
        </div>
      );
    });

    return (
      <div id="newtab-grid">
        {rows}
      </div>
    );
  }
}

Tiles.propTypes = {
  tiles: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      imageURI: PropTypes.string.isRequired,
      enhancedImageURI: PropTypes.string,
      type: PropTypes.string,
      url: PropTypes.string.isRequired,
      frecent_sites: PropTypes.arrayOf(PropTypes.string),
      explanation: PropTypes.string
    })
  ).isRequired
};
