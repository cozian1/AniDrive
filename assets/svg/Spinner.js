import * as React from "react";
import Svg, { Defs, ClipPath, Path, G } from "react-native-svg";
export default function Spinner(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      
      <G>
        <Path
          fill="none"
          stroke="#5f4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={7}
          d="M-28.5 0c0-12.656 8.268-23.396 19.692-27.11"
          style={{
            display: "block",
          }}
          transform="matrix(1 0 0 1 250 250)"
        />
        <Path
          fill="none"
          stroke="#5f4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={7}
          d="M-28.5 0c0-12.656 8.268-23.396 19.692-27.11"
          style={{
            display: "block",
          }}
          transform="matrix(-1 0 0 -1 250 250)"
        />
      </G>
    </Svg>
  );
}