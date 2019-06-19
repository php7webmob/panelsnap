import React, { Component } from "react";
import PropTypes from "prop-types";
import { TimelineLite, TweenLite } from "gsap";
import _debounce from "lodash/debounce";
import classnames from "classnames";

import "./Section.scss";

export default class Section extends Component {
  static propTypes = {
    children: PropTypes.node
  };

  state = {
    activeItem: this.props.children[0].props.id
  };

  images = [];
  scrollUp = undefined;
  isScrolling = false;
  isAnimating = false;

  section = React.createRef();

  componentDidMount() {
    const { activeItem } = this.state;
    const t = new TimelineLite();

    // sets the right image visible when the copmonent mounts
    t.set(this.images[activeItem], { zIndex: 1 });

    window.addEventListener("mousewheel", this.onMouseWheel);
    window.addEventListener(
      "scroll",
      (this.scrollRef = _debounce(this.onScroll, 100))
    );
  }

  componentWillUnmount() {
    clearTimeout(this.scrollTimer);

    window.removeEventListener("mousewheel", this.onMouseWheel);
    window.removeEventListener("scroll", this.scrollRef);
  }

  // Find out scroll direction
  onMouseWheel = ({ deltaY }) => {
    this.scrollUp = deltaY < -0.01;
  };

  // On scroll function handles item position
  onScroll = () => {
    clearTimeout(this.scrollTimer);

    this.scrollTimer = setTimeout(() => {
      this.positionItem();
    }, 500);
  };

  // Positioning the item content
  positionItem = () => {
    const section = this.section.current;
    const child = section.querySelector(`#${this.state.activeItem}`);
    const scrollTop = window.pageYOffset || window.scrollY;
    const { top, bottom } = section.getBoundingClientRect();
    const childTop = child.getBoundingClientRect().top;
    const scrollTo = Math.round(childTop + scrollTop);
    const threshold = window.innerHeight / 3;

    // Not positioning if not active child or is scrolling
    if (!child || this.isScrolling) {
      return;
    }

    // Not positioning first item until scrolled 1/3 of screen height
    if (top > threshold) {
      return;
    }

    // Not positioning when scrolled through last item
    if (bottom + threshold < window.innerHeight) {
      return;
    }

    clearTimeout(this.scrollTimer);

    this.isScrolling = true;

    const t = new TimelineLite();

    // Positioning the item content with gsap scroll to plugin
    t.to(window, 0.8, {
      scrollTo: scrollTo,
      ease: "Power4.easeInOut"
    }).call(() => {
      this.isScrolling = false;
    });
  };

  // Sets active item and animates the right image in
  onItemChange = id => {
    if (id === this.state.activeItem) return false;

    this.setState({ activeItem: id });

    const t = new TimelineLite();
    const section = this.section.current;
    const activeImage = this.images[id];
    const allImages = section.querySelectorAll(".section__image");
    const imageOverlay = section.querySelector(
      ".section__imageOverlayAnimation"
    );

    if (!this.isAnimating) {
      this.isAnimating = true;
      t.set(imageOverlay, {
        y: this.scrollUp ? "-100%" : "100%"
      }).fromTo(
        imageOverlay,
        0.6,
        { y: this.scrollUp ? "-100%" : "100%" },
        {
          y: "0%",
          ease: "Power4.easeInOut"
        }
      );

      t.set(allImages, { zIndex: 0 }).set(activeImage, { zIndex: 1 });

      t.to(imageOverlay, 0.6, {
        y: this.scrollUp ? "100%" : "-100%",
        ease: "Power4.easeInOut"
      }).call(() => {
        this.isAnimating = false;
      });
    }
  };

  // Scroll to element used in navigation
  scrollToElement = id => {
    TweenLite.to(window, 1, {
      ease: "Power4.easeInOut",
      scrollTo: id
    });
  };

  // Render Buttons
  renderNavigationItem = item => (
    <button
      key={`button-${item.props.id}`}
      className={classnames("section__button", {
        isActive: item.props.id === this.state.activeItem
      })}
      onClick={() => this.scrollToElement(`#${item.props.id}`)}
    >
      {item.props.title}
    </button>
  );

  // Render Images
  renderImages = item => (
    <div
      key={`image-${item.props.id}`}
      className="section__image"
      ref={c => {
        this.images[item.props.id] = c;
      }}
    >
      <img src={item.props.image} className="section__imageSource" alt="" />
    </div>
  );

  render() {
    const { children } = this.props;

    return (
      <section className="section" ref={this.section}>
        <section className="section__container">
          {/* Navigation */}
          <div className="section__navigation">
            <div className="section__buttons">
              {children.map(this.renderNavigationItem)}
            </div>
          </div>

          <div className="section__row">
            <div className="section__colLeft">
              {/* Images */}
              <div className="section__imageOffset">
                <div className="section__images">
                  <div className="section__imageOverlayAnimation" />
                  {children.map(this.renderImages)}
                </div>
              </div>
            </div>

            {/* Text content */}
            <div className="section__colRight">
              {children.map(child =>
                React.cloneElement(child, {
                  key: child.props.id,
                  onChange: () => this.onItemChange(child.props.id)
                })
              )}
            </div>
          </div>
        </section>
      </section>
    );
  }
}
