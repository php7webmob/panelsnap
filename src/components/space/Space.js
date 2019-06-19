import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import "./Space.scss";

export default class Space extends PureComponent {
  static propTypes = {
    children: PropTypes.node
  };

  static defaultProps = {
    children: undefined
  };

  render() {
    const { children } = this.props;
    return <div className="space">{children}</div>;
  }
}
