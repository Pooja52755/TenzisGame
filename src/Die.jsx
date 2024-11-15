import React from "react";

export default function Die(props) {
  const styles = {
    backgroundColor: props.isHeld ? "#53E391" : "#0B2434",
    color: props.isHeld ? "black" : "white",
  };

  return (
    <button
      className="colorchange"
      style={styles}
      onClick={props.hold}
    >
      {props.value}
    </button>
  );
}
