import React from "react";
import styled from "styled-components/native";
import { Dimensions } from "react-native";
import RoutineSvg from "../../../../assets/image/routine.svg";
import Routine2Svg from "../../../../assets/image/routine2.svg";
import Routine3Svg from "../../../../assets/image/routine3.svg";
import Routine4Svg from "../../../../assets/image/routine4.svg";
import Routine5Svg from "../../../../assets/image/routine5.svg";
import Routine6Svg from "../../../../assets/image/routine6.svg";

interface RoutineCardProps {
  id: string;
  imagePath: string;
  backgroundColor: string;
  onPress?: () => void;
}

const CardContainer = styled.TouchableOpacity<{ backgroundColor: string }>`
  width: ${() => (Dimensions.get("window").width - 44) / 2}px;
  height: 280px;
  align-items: center;
  justify-content: center;
`;

const CardImageContainer = styled.View`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`;

const getRoutineImage = (imagePath: string): React.FC<any> | null => {
  const imageMap: Record<string, React.FC<any>> = {
    "assets/image/routine.svg": RoutineSvg,
    "assets/image/routine2.svg": Routine2Svg,
    "assets/image/routine3.svg": Routine3Svg,
    "assets/image/routine4.svg": Routine4Svg,
    "assets/image/routine5.svg": Routine5Svg,
    "assets/image/routine6.svg": Routine6Svg,
  };
  return imageMap[imagePath] || null;
};

const RoutineCard: React.FC<RoutineCardProps> = ({
  id,
  imagePath,
  backgroundColor,
  onPress,
}) => {
  const RoutineImage = getRoutineImage(imagePath);

  return (
    <CardContainer
      backgroundColor={backgroundColor}
      onPress={onPress}
      activeOpacity={1}
    >
      <CardImageContainer>
        {RoutineImage &&
          React.createElement(RoutineImage, {
            width: "100%",
            height: "100%",
          })}
      </CardImageContainer>
    </CardContainer>
  );
};

export default RoutineCard;
