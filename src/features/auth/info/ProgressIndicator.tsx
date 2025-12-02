import React from "react";
import styled from "styled-components/native";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps?: number;
}

const ProgressContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
`;

const ProgressLine = styled.View`
  flex: 1;
  height: 2px;
  background-color: ${({ theme }) => theme.colors.gray700};
`;

const ProgressLineActive = styled(ProgressLine)`
  background-color: ${({ theme }) => theme.colors.primary};
`;

const ProgressCircle = styled.View<{ active: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background-color: ${({ active, theme }) =>
    active ? theme.colors.primary : theme.colors.gray700};
  justify-content: center;
  align-items: center;
`;

const ProgressCircleText = styled.Text<{ active: boolean }>`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray0};
`;

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps = 4,
}) => {
  return (
    <ProgressContainer>
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber <= currentStep;
        const isLineActive = stepNumber < currentStep;

        return (
          <React.Fragment key={stepNumber}>
            <ProgressCircle active={isActive}>
              <ProgressCircleText active={isActive}>
                {stepNumber}
              </ProgressCircleText>
            </ProgressCircle>
            {index < totalSteps - 1 && (
              <>{isLineActive ? <ProgressLineActive /> : <ProgressLine />}</>
            )}
          </React.Fragment>
        );
      })}
    </ProgressContainer>
  );
};

export default ProgressIndicator;
