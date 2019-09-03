import * as React from 'react';
import './footer.scss';
// @ts-ignore
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// @ts-ignore
import { faSearchPlus, faArrowsAlt } from '@fortawesome/free-solid-svg-icons';

export interface FooterProps {}

export interface FooterState {}

class Footer extends React.Component<FooterProps, FooterState> {
  state = {};
  render() {
    return (
      <div className="footer">
        <div id="pan" className="footer-element">
          <FontAwesomeIcon icon={faArrowsAlt} className="icon" /> Click and drag
          to pan
        </div>
        <div id="zoom" className="footer-element">
          <FontAwesomeIcon icon={faSearchPlus} className="icon" /> Scroll on the
          drawing to zoom in / out
        </div>
        {/* <div id="scale">Scale: </div> */}
      </div>
    );
  }
}

export default Footer;
