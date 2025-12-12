import React, { useState } from "react";
import styled from "styled-components/native";
import Header from "../../../shared/components/common/Header";
import Button from "../../../shared/components/common/Button";
import { useNavigation } from "@react-navigation/native";

const Screen = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const ContentWrapper = styled.View`
  flex: 1;
  padding: 16px;
`;

const InputContainer = styled.View`
  margin-bottom: 16px;
`;

const TitleInput = styled.TextInput.attrs(({ theme }) => ({
  placeholderTextColor: theme.colors.gray500,
}))`
  height: 52px;
  background-color: ${({ theme }) => theme.colors.gray1000};
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: 0 20px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 18px;
`;

const ContentInputContainer = styled.View`
  background-color: ${({ theme }) => theme.colors.gray1000};
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: 16px;
  min-height: 400px;
  position: relative;
`;

const ContentInput = styled.TextInput.attrs(({ theme }) => ({
  placeholderTextColor: "transparent",
  multiline: true,
  textAlignVertical: "top",
}))`
  flex: 1;
  color: ${({ theme }) => theme.colors.text};
  font-size: 17px;
  min-height: 200px;
`;

const PlaceholderText = styled.Text<{ visible: boolean }>`
  position: absolute;
  top: 16px;
  left: 16px;
  right: 16px;
  color: ${({ theme }) => theme.colors.gray500};
  font-size: 17px;
  pointer-events: none;
  display: ${({ visible }) => (visible ? "flex" : "none")};
`;

const HelperText = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray500};
  margin-top: 8px;
  padding-left: 4px;
`;

const ButtonContainer = styled.View`
  width: 100%;
  margin-top: auto;
  padding-top: 24px;
`;

const QnaWriteScreen = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      // TODO: 유효성 검사 알림 추가
      return;
    }
    // TODO: 문의 제출 로직 구현
    console.log("제출:", { title, content });
    navigation.goBack();
  };

  return (
    <Screen>
      <Header title="문의작성" />
      <ContentWrapper>
        <InputContainer>
          <TitleInput
            placeholder="제목을 입력해주세요"
            value={title}
            onChangeText={setTitle}
          />
        </InputContainer>
        <InputContainer>
          <ContentInputContainer>
            <PlaceholderText visible={!content}>
              문의내용을 입력해주세요.{"\n"}확인 후 관리자가 답변 드립니다.
            </PlaceholderText>
            <ContentInput value={content} onChangeText={setContent} />
          </ContentInputContainer>
        </InputContainer>
        <ButtonContainer>
          <Button variant="primary" onPress={handleSubmit}>
            문의하기
          </Button>
        </ButtonContainer>
      </ContentWrapper>
    </Screen>
  );
};

export default QnaWriteScreen;
