import React from "react";
import { SvgProps } from "react-native-svg";

interface SvgIconProps extends SvgProps {
  Component: React.FC<SvgProps>;
  fill?: string;
}

/**
 * SVG 아이콘 컴포넌트 wrapper
 * fill prop을 받아서 모든 하위 path 요소에 적용
 */
const SvgIcon: React.FC<SvgIconProps> = ({
  Component,
  fill,
  children,
  ...props
}) => {
  // fill이 제공되면 모든 children의 fill 속성을 변경
  const renderWithFill = (element: React.ReactElement): React.ReactElement => {
    if (!fill) return element;

    const elementProps = element.props as Record<string, any>;

    return React.cloneElement(
      element,
      {
        ...elementProps,
        fill: fill,
      } as any,
      React.Children.map(elementProps.children, (child) => {
        if (React.isValidElement(child)) {
          return renderWithFill(child);
        }
        return child;
      })
    );
  };

  return (
    <Component {...props}>
      {fill &&
        React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return renderWithFill(child);
          }
          return child;
        })}
      {!fill && children}
    </Component>
  );
};

export default SvgIcon;
