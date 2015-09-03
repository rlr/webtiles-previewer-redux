import React, { PropTypes, Component } from 'react';

export default class Tiles extends Component {
  render() {
    var rows = [];
    var tilesType = this.props.tilesType;
    this.props.tiles.forEach(function(webtile) {
      var thumbStyle = {
        backgroundImage: 'url(' + webtile.imageURI + ')'
      };
      var enhancedThumbStyle = {
        backgroundImage: 'url(' + webtile.enhancedImageURI + ')'
      };
      var frecent = [];
      if (tilesType === 'suggested') {
        webtile.frecent_sites.forEach(function(url){
          frecent.push(
            <li>{url}</li>
          );
        });
      }
      rows.push(
        <div className="newtab-cell">
          <div className={'newtab-site ' + tilesType} type={webtile.type}>
            <a className="newtab-link" href={webtile.url} title={webtile.title}>
              <img src={webtile.imageURI} />
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
          {tilesType === 'suggested' &&
            <div className="frecent-sites">
              Frecent Sites:
              <ul>
                {frecent}
              </ul>
            </div>
          }
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
  tiles: PropTypes.array.isRequired,
  tilesType: PropTypes.string
};
