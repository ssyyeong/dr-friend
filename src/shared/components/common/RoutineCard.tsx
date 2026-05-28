import React, { useRef, useState } from "react";
import { Animated, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";

// =====================
// Constants
// =====================

const CARD_WIDTH = 160;
const CARD_HEIGHT = 200;

// =====================
// Styled Components
// =====================

const CardFace = styled.View<{ backgroundColor: string }>`
  width: ${CARD_WIDTH}px;
  height: ${CARD_HEIGHT}px;
  border-radius: 16px;
  padding: 16px;
  background-color: ${({ backgroundColor }) => backgroundColor};
  position: absolute;
  backface-visibility: hidden;
  justify-content: space-between;
`;

const CardBackFace = styled.View<{ backgroundColor: string }>`
  width: ${CARD_WIDTH}px;
  height: ${CARD_HEIGHT}px;
  border-radius: 16px;
  padding: 12px;
  background-color: ${({ backgroundColor }) => backgroundColor};
  position: absolute;
  backface-visibility: hidden;
  justify-content: flex-start;
  gap: 6px;
`;

const CardTop = styled.View`
  align-items: flex-start;
`;

const CardBottom = styled.View`
  align-items: flex-start;
`;

const IconImage = styled.Image`
  width: 52px;
  height: 52px;
`;

const CategoryLabel = styled.Text`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 4px;
`;

const CardTitle = styled.Text`
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
  line-height: 22px;
`;

// ✅ 뒷면 - 박스 유지, 텍스트 가운데 정렬
const ActionBox = styled.View`
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.25);
  border-radius: 8px;
  padding: 6px 8px;
  background-color: rgba(255, 255, 255, 0.08);
  align-items: center;
`;

const ActionText = styled.Text`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 16px;
  text-align: center;
`;

// =====================
// Types
// =====================

interface RoutineCardProps {
  id: string;
  category?: string;
  routineCardName?: string;
  title?: string;
  iconImageUrl?: string | null;
  themeColorCode?: string | null;
  actionList?: string[];
  imagePath?: string;
  backgroundColor?: string;
}

// =====================
// Helpers
// =====================

const resolveIconUrl = (iconImageUrl?: string | null): string | null => {
  if (!iconImageUrl) return null;
  const trimmed = iconImageUrl.trim();
  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : null;
    } catch {
      return iconImageUrl;
    }
  }
  return iconImageUrl;
};

// =====================
// Component
// =====================

const RoutineCard: React.FC<RoutineCardProps> = ({
  id,
  category,
  routineCardName,
  title,
  iconImageUrl,
  themeColorCode,
  actionList = [],
  backgroundColor,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;

  const bgColor = themeColorCode || backgroundColor || "#1E3A5F";
  const resolvedIconUrl = resolveIconUrl(iconImageUrl);

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  const handleFlip = () => {
    Animated.spring(flipAnim, {
      toValue: isFlipped ? 0 : 180,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
  };

  return (
    <TouchableOpacity
      onPress={handleFlip}
      activeOpacity={1}
      style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
    >
      <View style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}>
        {/* 앞면 */}
        <Animated.View
          style={{
            position: "absolute",
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
            backfaceVisibility: "hidden",
            transform: [{ rotateY: frontInterpolate }],
          }}
        >
          <CardFace backgroundColor={bgColor}>
            <CardTop>
              {resolvedIconUrl ? (
                <IconImage
                  source={{ uri: resolvedIconUrl }}
                  resizeMode="contain"
                />
              ) : (
                <View style={{ width: 52, height: 52 }} />
              )}
            </CardTop>
            <CardBottom>
              {routineCardName && (
                <CategoryLabel>{routineCardName}</CategoryLabel>
              )}
              {category && !routineCardName && (
                <CategoryLabel>{category}</CategoryLabel>
              )}
              <CardTitle>{title || ""}</CardTitle>
            </CardBottom>
          </CardFace>
        </Animated.View>

        {/* 뒷면 */}
        <Animated.View
          style={{
            position: "absolute",
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
            backfaceVisibility: "hidden",
            transform: [{ rotateY: backInterpolate }],
          }}
        >
          <CardBackFace backgroundColor={bgColor}>
            {actionList.map((action, idx) => (
              <ActionBox key={idx}>
                <ActionText>{action}</ActionText>
              </ActionBox>
            ))}
          </CardBackFace>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

export default RoutineCard;
