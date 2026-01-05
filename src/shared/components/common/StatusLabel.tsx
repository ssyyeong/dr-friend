import React from "react";
import styled from "styled-components/native";

interface StatusLabelProps {
  ko: string;
  en: string;
  color: string;
  fontSize?: number;
  marginBottom?: number;
}

const StatusContainer = styled.View<{ marginBottom?: number }>`
  flex-direction: row;
  align-items: center;
  ${({ marginBottom }) =>
    marginBottom !== undefined ? `margin-bottom: ${marginBottom}px;` : ""}
`;

const StatusText = styled.Text<{ color: string; fontSize?: number }>`
  font-size: ${({ fontSize }) => fontSize || 16}px;
  font-weight: 500;
  color: ${({ color }) => color};
`;

const StatusDivider = styled.View`
  width: 1px;
  height: 12px;
  background-color: ${({ theme }) => theme.colors.gray500};
  margin: 0 12px;
`;

const StatusLabel: React.FC<StatusLabelProps> = ({
  ko,
  en,
  color,
  fontSize = 16,
  marginBottom,
}) => {
  return (
    <StatusContainer marginBottom={marginBottom}>
      <StatusText color={color} fontSize={fontSize}>
        {ko}
      </StatusText>
      <StatusDivider />
      <StatusText color={color} fontSize={fontSize}>
        {en}
      </StatusText>
    </StatusContainer>
  );
};

export default StatusLabel;
