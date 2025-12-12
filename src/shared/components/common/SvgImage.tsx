import React from "react";
import { SvgProps } from "react-native-svg";

interface SvgImageProps {
  SvgComponent: React.FC<SvgProps>;
  width?: number;
  height?: number;
  color?: string;
  style?: any;
}

const SvgImage: React.FC<SvgImageProps> = ({
  SvgComponent,
  width,
  height,
  color,
  style,
}) => {
  return (
    <SvgComponent width={width} height={height} color={color} style={style} />
  );
};

export default SvgImage;







