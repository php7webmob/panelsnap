import "intersection-observer";

import React from "react";
import ReactDOM from "react-dom";

import Space from "./components/space";
import Section from "./components/section";
import Item from "./components/item";

function App() {
  return (
    <div className="App">
      <Space>Try to scroll down :)</Space>

      <Section>
        <Item
          id="itemA"
          title="Nulla"
          description="Nulla ac ultrices lectus. Nam lacinia elit sit
            amet turpis porttitor, in gravida purus consectetur. Praesent
            viverra nisl nec lobortis facilisis. Nunc nibh mi, tincidunt
            id tempor vel, aliquam eu urna."
          image={require("./images/2.png")}
        />
        <Item
          id="itemB"
          title="Etiam"
          description="Sed non eleifend orci. Etiam ut quam vitae ligula
            sagittis sagittis. Duis ac metus at elit convallis lobortis.
            In hac habitasse platea dictumst. Praesent vel ligula leo."
          image={require("./images/3.png")}
        />
      </Section>

      <Space>Space under</Space>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
