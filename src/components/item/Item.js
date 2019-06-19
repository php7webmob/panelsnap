import React, { Component } from "react";
import PropTypes from "prop-types";
import Observer from "react-intersection-observer";

import "./Item.scss";

export default class Item extends Component {
  static propTypes = {
    id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    onChange: PropTypes.func
  };

  changeItem = inView => {
    const { onChange } = this.props;

    if (inView) {
      onChange();
    }
  };

  render() {
    const { title, description, id } = this.props;

    return (
      <div className="item" id={id}>
        <div className="item__inner">
          <Observer tag="div" onChange={this.changeItem}>
            <h2 className="item__heading">{title}</h2>
            <p className="item__description">{description}</p>
          </Observer>
        </div>
      </div>
    );
  }
}
