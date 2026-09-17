import React, { useState } from "react";
import { ScrollView } from "react-native";
import styled from "styled-components/native";
import Header from "../../shared/components/common/Header";
import FilterTabs from "../../shared/components/common/FilterTabs";

const Screen = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const TabContainer = styled.View`
  padding: 16px;
  padding-bottom: 0;
`;

const ContentContainer = styled.ScrollView`
  flex: 1;
  padding: 16px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-top: 20px;
  margin-bottom: 12px;
`;

const Paragraph = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray200};
  line-height: 22px;
  margin-bottom: 12px;
`;

const SubSection = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray200};
  line-height: 22px;
  margin-bottom: 8px;
  padding-left: 8px;
`;

const CompanyInfo = styled.View`
  background-color: ${({ theme }) => theme.colors.gray700};
  border-radius: ${({ theme }) => theme.radius.md}px;
  padding: 16px;
  margin-top: 20px;
  margin-bottom: 40px;
`;

const CompanyInfoText = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray300};
  line-height: 22px;
`;

const TermsPolicyScreen = () => {
  const [selectedTab, setSelectedTab] = useState("이용약관");

  return (
    <Screen>
      <Header title="약관 및 정책" showBackButton={true} />
      <TabContainer>
        <FilterTabs
          tabs={["이용약관", "개인정보 정책"]}
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
        />
      </TabContainer>

      <ContentContainer showsVerticalScrollIndicator={false}>
        {selectedTab === "이용약관" ? (
          <>
            <SectionTitle>닥터프렌드 케어 플러스 서비스 이용약관</SectionTitle>
            <Paragraph>운영자: 주식회사 디에프월드</Paragraph>

            <SectionTitle>제1조 (목적)</SectionTitle>
            <Paragraph>
              이 약관은 주식회사 디에프월드(이하 "회사")가 제공하는 닥터프렌드 케어 플러스 애플리케이션과 이에 부수하는 서비스(이하 "서비스")의 이용에 관하여 회사와 회원 사이의 권리·의무, 책임사항 및 이용 조건을 정함을 목적으로 합니다.
            </Paragraph>

            <SectionTitle>제2조 (용어의 정의)</SectionTitle>
            <SubSection>• "회원"이란 이 약관에 동의하고 회사가 정한 절차에 따라 가입하여 서비스를 이용하는 사람을 말합니다.</SubSection>
            <SubSection>• "계정"이란 회원의 식별과 서비스 이용을 위하여 생성되는 로그인 정보와 이에 연결된 서비스 이용 단위를 말합니다.</SubSection>
            <SubSection>• "연동기기"란 서비스와 연결하여 수면·활동·생체 관련 정보를 전송하는 웨어러블 기기, 센서 또는 그 밖에 회사가 지원하는 기기를 말합니다.</SubSection>
            <SubSection>• "측정정보"란 연동기기, 외부 플랫폼 또는 회원의 입력을 통해 생성되어 서비스가 처리하는 수면·활동·생체 관련 정보를 말합니다.</SubSection>
            <SubSection>• "분석정보"란 측정정보와 이용기록을 바탕으로 서비스가 제공하는 수면 기록, 점수, 추세, 통계, 코칭 또는 이에 준하는 정보를 말합니다.</SubSection>
            <SubSection>• "수면상태 자가점검"이란 회원이 수면, 졸림, 생활습관, 스트레스 또는 건강관리 상태에 관한 질문에 답하면 회사가 정한 방식으로 참고용 결과와 관리 정보를 제공하는 기능을 말합니다.</SubSection>
            <SubSection>• "회원기록"이란 회원이 수면일지, 목표, 메모, 설문 또는 그 밖의 입력 기능을 통해 직접 작성하거나 저장한 정보를 말합니다.</SubSection>
            <SubSection>• "콘텐츠"란 회사가 서비스에서 제공하는 건강관리 정보, 코칭, 제품 정보, 문구, 이미지, 영상 및 그 밖의 자료를 말합니다.</SubSection>

            <SectionTitle>제3조 (약관의 게시, 효력 및 개정)</SectionTitle>
            <SubSection>① 회사는 회원이 이 약관을 쉽게 확인할 수 있도록 가입 화면, 서비스 내 설정 또는 연결 화면 등에 게시합니다.</SubSection>
            <SubSection>② 회사는 관계 법령을 위반하지 않는 범위에서 이 약관을 개정할 수 있습니다.</SubSection>
            <SubSection>③ 회사가 약관을 개정하는 경우 적용일과 개정 사유를 명시하여 원칙적으로 적용일 7일 전부터 공지합니다. 회원에게 불리하거나 중요한 사항을 변경하는 경우에는 원칙적으로 적용일 30일 전부터 공지하고, 전자우편·문자메시지·앱 알림 등 가능한 방법으로 개별 안내합니다.</SubSection>
            <SubSection>④ 회원이 개정 약관에 동의하지 않는 경우 이용계약을 해지할 수 있습니다. 법령상 별도 동의가 필요한 변경은 회사가 회원의 동의를 받습니다.</SubSection>
            <SubSection>⑤ 회사는 약관 동의를 개인정보 처리 동의로 갈음하지 않으며, 관계 법령상 필요한 개인정보 동의를 구분하여 받습니다.</SubSection>

            <SectionTitle>제4조 (운영정책)</SectionTitle>
            <SubSection>① 회사는 서비스 운영에 필요한 세부 사항을 운영정책, 기기 이용안내, 기능별 안내 또는 서비스 화면에서 정할 수 있습니다.</SubSection>
            <SubSection>② 운영정책은 이 약관의 내용을 부당하게 제한하거나 회원에게 예상하기 어려운 불이익을 주는 방식으로 적용되지 않습니다.</SubSection>
            <SubSection>③ 유료 구독, 의료기기 기능, 보험 또는 의료기관 연계 등 별도 규율이 필요한 기능을 도입하는 경우 회사는 필요한 약관과 동의 절차를 마련합니다.</SubSection>

            <SectionTitle>제5조 (이용계약의 성립)</SectionTitle>
            <SubSection>① 이용계약은 서비스를 이용하려는 사람이 이 약관과 필요한 개인정보 처리 사항을 확인하고 동의한 후 가입을 신청하고, 회사가 이를 승인함으로써 성립합니다.</SubSection>
            <SubSection>② 회사는 휴대전화, 전자우편 또는 소셜 계정 등을 이용한 인증 절차를 제공하거나 요구할 수 있습니다.</SubSection>
            <SubSection>③ 회사는 타인의 정보를 사용한 경우, 허위 또는 누락된 정보를 제공한 경우, 기술상·운영상 승인이 어려운 경우, 법령 또는 이 약관을 위반할 우려가 명백한 경우 가입을 거절하거나 승인을 보류할 수 있습니다.</SubSection>
            <SubSection>④ 회사가 가입을 거절하거나 보류하는 경우 특별한 사정이 없는 한 그 사유를 신청자에게 안내합니다.</SubSection>

            <SectionTitle>제6조 (이용 연령과 미성년자)</SectionTitle>
            <SubSection>① 서비스에는 만 14세 이상인 사람만 가입할 수 있습니다.</SubSection>
            <SubSection>② 회사가 향후 만 14세 미만 아동에게 서비스를 제공하는 경우에는 법정대리인의 동의를 받고 동의 여부를 확인하는 절차와 아동이 이해하기 쉬운 개인정보 안내를 별도로 마련합니다.</SubSection>
            <SubSection>③ 미성년자가 유료 거래를 이용하는 경우에는 관계 법령에 따라 법정대리인의 동의가 필요할 수 있습니다.</SubSection>

            <SectionTitle>제7조 (회원정보와 계정 관리)</SectionTitle>
            <SubSection>① 회원은 정확한 정보를 제공하고, 변경된 정보가 있는 경우 지체 없이 수정해야 합니다.</SubSection>
            <SubSection>② 회원은 자신의 계정과 인증수단을 안전하게 관리해야 하며 이를 제3자에게 양도·대여하거나 공동으로 사용하게 해서는 안 됩니다.</SubSection>
            <SubSection>③ 회원은 계정 도용이나 무단 사용을 알게 된 경우 즉시 인증수단을 변경하고 회사에 알려야 합니다.</SubSection>
            <SubSection>④ 회원의 고의 또는 과실로 계정정보가 유출되어 손해가 발생한 경우 회원이 그 책임을 부담할 수 있습니다. 다만 회사의 고의 또는 과실이 있는 경우에는 그러하지 않습니다.</SubSection>

            <SectionTitle>제8조 (서비스의 내용)</SectionTitle>
            <SubSection>① 회사는 회원가입과 계정 관리, 수면상태 자가점검, 연동기기 연결 및 데이터 동기화, 수면·활동 기록, 분석과 코칭, 수면일지와 목표, 알람과 알림, 음성 기록, 제품 정보 등 서비스 화면에서 제공되는 기능의 전부 또는 일부를 제공합니다.</SubSection>
            <SubSection>② 실제 이용 가능한 기능과 측정 항목은 앱 버전, 운영체제, 연동기기, 외부 플랫폼, 회원의 권한 설정 및 회사의 운영정책에 따라 달라질 수 있습니다.</SubSection>
            <SubSection>③ 회사는 특정 기능의 이용 조건, 지원 기기, 제공 기간 및 제한 사항을 서비스 화면 또는 별도 안내에서 회원이 알기 쉽게 표시합니다.</SubSection>

            <SectionTitle>제9조 (부가 기능과 회원별 이용 범위)</SectionTitle>
            <SubSection>① 회사는 제품 구매·등록, 연동기기 등록, 프로모션 참여 또는 그 밖에 사전에 안내한 요건을 충족한 회원에게 추가 분석, 점수·추세, 장기 리포트 또는 그 밖의 부가 기능을 제공할 수 있습니다.</SubSection>
            <SubSection>② 회사는 부가 기능을 제공하기 전에 대상, 제공 기능, 이용기간, 자격 유지·종료 조건 및 비용 유무를 서비스 화면, 제품 판매조건 또는 별도 안내에서 명확히 표시합니다.</SubSection>
            <SubSection>③ 제품의 환불·양도·등록 해제, 연동기기의 변경 또는 안내된 자격 요건의 소멸에 따라 부가 기능의 이용 범위가 변경될 수 있습니다.</SubSection>
            <SubSection>④ 월 구독 등 유료서비스를 도입하는 경우 회사는 가격, 결제주기, 자동결제, 해지, 청약철회 및 환불 조건을 포함한 별도 약관 또는 안내를 마련합니다.</SubSection>

            <SectionTitle>제10조 (연동기기와 외부 플랫폼)</SectionTitle>
            <SubSection>① 회원은 회사가 지원하는 연동기기와 외부 계정을 직접 준비하고 각 제조사 또는 외부 플랫폼의 이용조건과 안전수칙을 준수해야 합니다.</SubSection>
            <SubSection>② 연동기기의 센서, 펌웨어, 블루투스, 배터리, 네트워크 또는 외부 사업자의 API·SDK 정책에 따라 데이터가 늦게 전송되거나 일부 항목이 제공되지 않을 수 있습니다.</SubSection>
            <SubSection>③ 서비스는 실시간 동기화를 보장하지 않습니다. 실제 동기화 주기와 예상 지연은 지원 기기별 안내에서 확인할 수 있습니다.</SubSection>
            <SubSection>④ 회사는 외부 사업자의 정책 변경, 서비스 중단 또는 호환성 변경 등 회사가 합리적으로 통제하기 어려운 사유로 연동 범위를 변경할 수 있으며 중요한 변경은 가능한 범위에서 사전에 안내합니다.</SubSection>
            <SubSection>⑤ 회원은 기기의 착용·충전·보관 및 사용상 주의사항을 따라야 하며, 기기 이상이나 신체 불편이 있는 경우 사용을 중단하고 제조사 또는 전문가의 안내를 확인해야 합니다.</SubSection>

            <SectionTitle>제11조 (측정정보와 분석정보의 특성)</SectionTitle>
            <SubSection>① 측정정보와 분석정보는 센서 성능, 착용 위치와 상태, 움직임, 피부 상태, 주변 환경, 배터리, 통신 상태 및 데이터 처리 방식 등에 따라 실제 상태와 차이가 날 수 있습니다.</SubSection>
            <SubSection>② 수면 시작·종료, 수면 단계, 회복 상태, 점수와 추세 등은 기기와 분석 방식에 따른 추정치일 수 있으며 정확성·완전성·연속성이 항상 보장되는 것은 아닙니다.</SubSection>
            <SubSection>③ 회원은 값이 표시되지 않거나 비정상적인 값이 반복되는 경우 기기 연결, 착용 상태, 권한 설정과 동기화 상태를 확인하고 필요한 경우 고객지원에 문의할 수 있습니다.</SubSection>

            <SectionTitle>제12조 (수면상태 자가점검)</SectionTitle>
            <SubSection>① 수면상태 자가점검은 회원의 응답을 바탕으로 현재 상태를 스스로 살펴보고 생활습관 관리에 참고할 수 있는 정보와 안내를 제공하는 기능입니다.</SubSection>
            <SubSection>② 설문, 점수, 구간과 권고 로직은 의학적 확정 진단 기준이 아니며 질병의 진단·치료·예방 또는 의료인의 전문적인 판단을 대신하지 않습니다.</SubSection>
            <SubSection>③ 회원의 응답이 부정확하거나 불완전한 경우 결과도 달라질 수 있으며, 회사는 서비스 화면에서 결과의 의미와 한계를 함께 안내합니다.</SubSection>
            <SubSection>④ 주간 졸림으로 운전이나 고위험 작업이 위험한 경우, 수면무호흡이 의심되는 경우, 심각한 불면·정신적 고통 또는 만성질환 관리 이상 등 안전이나 건강에 중대한 우려가 있는 경우 회원은 서비스 결과에만 의존하지 말고 적절한 의료기관 또는 전문가의 도움을 받아야 합니다.</SubSection>

            <SectionTitle>제13조 (건강관리 정보와 의료적 한계)</SectionTitle>
            <SubSection>① 서비스의 분석, 코칭과 콘텐츠는 일상적인 건강관리와 생활습관 개선을 돕기 위한 참고 정보입니다.</SubSection>
            <SubSection>② 서비스는 질병의 진단·치료·예방, 의약품 처방, 응급상황 판단 또는 의료인의 전문적인 판단을 대신하지 않습니다.</SubSection>
            <SubSection>③ 회원은 중요한 건강 결정을 서비스 정보에만 의존해서는 안 되며 이상 증상이나 건강상 우려가 있는 경우 의료기관 등 적절한 전문가에게 상담해야 합니다.</SubSection>
            <SubSection>④ 회사가 관계 기관의 허가·인증을 받은 특정 의료기기 기능을 별도로 제공하는 경우에는 해당 기능에 관한 허가 범위와 별도 안내가 우선합니다.</SubSection>
            <SubSection>⑤ 서비스는 응급 신고 또는 의료기관 연결을 보장하는 응급대응 서비스가 아닙니다.</SubSection>

            <SectionTitle>제14조 (알람, 알림과 음성 기록)</SectionTitle>
            <SubSection>① 알람과 푸시 알림은 회원의 편의를 위한 보조 기능입니다. 운영체제 설정, 방해금지 모드, 음량, 전원, 네트워크, 앱 종료 또는 기기 오류 등에 따라 늦게 제공되거나 제공되지 않을 수 있습니다.</SubSection>
            <SubSection>② 회원은 중요한 일정, 복약, 안전관리 또는 응급상황을 서비스의 알람이나 알림에만 의존해서는 안 됩니다.</SubSection>
            <SubSection>③ 코골이 등 음성 기록 기능이 제공되는 경우 회사는 녹음 시작 전 필요한 기기 접근권한, 저장 위치, 처리 목적과 보유기간을 관련 화면과 개인정보처리방침에서 안내합니다.</SubSection>
            <SubSection>④ 회원은 제3자의 대화나 음성을 동의 없이 녹음·저장·공유하여 타인의 권리나 법령을 침해해서는 안 됩니다.</SubSection>

            <SectionTitle>제15조 (회원기록)</SectionTitle>
            <SubSection>① 회원은 수면일지, 목표와 메모에 적법한 내용을 입력해야 하며 제3자의 개인정보 또는 권리를 침해하는 내용을 입력해서는 안 됩니다.</SubSection>
            <SubSection>② 회원기록에 대한 권리는 회원에게 있습니다. 회사는 서비스 제공, 저장·동기화, 오류 복구와 회원이 요청한 기능 수행에 필요한 범위에서 이를 처리합니다.</SubSection>
            <SubSection>③ 회원은 저장·수정·취소 등 화면의 동작을 확인하고 중요한 기록은 필요한 경우 별도로 보관할 수 있습니다.</SubSection>

            <SectionTitle>제16조 (개인정보와 건강 관련 정보의 보호)</SectionTitle>
            <SubSection>① 회사는 개인정보 보호 관계 법령에 따라 회원의 개인정보를 보호하며 구체적인 처리 항목, 목적, 보유기간, 위탁, 제3자 제공, 국외이전, 파기 및 권리행사 방법은 개인정보처리방침에서 정합니다.</SubSection>
            <SubSection>② 측정정보, 음성 기록, 수면상태 자가점검 응답 또는 회원기록이 개인의 건강에 관한 정보 등 민감정보에 해당하는 경우 회사는 관계 법령에 따른 요건을 갖추고, 필요한 경우 다른 개인정보 동의와 구분하여 별도 동의를 받습니다.</SubSection>
            <SubSection>③ 회사는 앱 접근권한이 필요한 경우 필수·선택 권한을 구분하고 접근할 정보 또는 기능, 접근이 필요한 이유와 권한 거부 시 영향을 회원이 명확하게 알 수 있도록 안내합니다.</SubSection>
            <SubSection>④ 회사는 개인정보를 국외로 이전하는 경우 관계 법령상 요건을 갖추고 이전받는 자, 이전 국가, 항목, 목적, 방법, 시기와 보유기간 등을 개인정보처리방침 또는 별도 안내에서 알립니다.</SubSection>
            <SubSection>⑤ 회원은 관계 법령과 개인정보처리방침에 따라 자신의 개인정보에 대한 열람, 정정·삭제, 처리정지, 동의 철회 등 권리를 행사할 수 있습니다.</SubSection>

            <SectionTitle>제17조 (회사의 의무)</SectionTitle>
            <SubSection>① 회사는 관계 법령과 이 약관을 준수하고 서비스를 안정적으로 제공하기 위하여 합리적인 노력을 합니다.</SubSection>
            <SubSection>② 회사는 개인정보와 측정정보를 보호하기 위하여 기술적·관리적·물리적 안전조치를 마련하고 점검합니다.</SubSection>
            <SubSection>③ 회사는 회원의 정당한 의견이나 불만을 처리할 수 있는 고객지원 방법을 제공하고 처리 과정 또는 결과를 안내하기 위해 노력합니다.</SubSection>
            <SubSection>④ 회사는 확인된 중대한 오류, 보안 문제 또는 데이터 처리 이상을 합리적인 범위에서 조사하고 필요한 조치를 합니다.</SubSection>

            <SectionTitle>제18조 (회원의 의무와 금지행위)</SectionTitle>
            <SubSection>① 회원은 관계 법령, 이 약관, 운영정책과 서비스 화면의 안내를 준수해야 합니다.</SubSection>
            <SubSection>② 회원은 허위정보 입력 또는 타인의 정보 도용, 계정 양도·대여·공동사용, 서비스 운영 방해, 비정상적 자동화 접근·해킹·악성코드 유포, 회사 또는 제3자의 지식재산권·개인정보·영업비밀 침해, 불법·유해 정보의 입력, 서비스 결과를 의료적 확정 진단이나 회사의 보증인 것처럼 왜곡하는 행위를 해서는 안 됩니다.</SubSection>
            <SubSection>③ 회원은 회사의 사전 동의 없이 서비스나 콘텐츠를 복제·수정·배포·판매하거나 역설계해서는 안 됩니다. 다만 관계 법령상 허용되는 경우는 제외합니다.</SubSection>

            <SectionTitle>제19조 (지식재산권)</SectionTitle>
            <SubSection>① 서비스, 소프트웨어, 분석 방식, 상표, 디자인과 콘텐츠에 관한 저작권 및 그 밖의 지식재산권은 회사 또는 정당한 권리자에게 있습니다.</SubSection>
            <SubSection>② 회사는 회원에게 개인적이고 비상업적인 서비스 이용 범위에서 콘텐츠를 이용할 수 있는 제한적이고 비독점적인 권한을 부여합니다.</SubSection>
            <SubSection>③ 회원이 서비스에 의견, 제안 또는 오류 제보를 제공하는 경우 회사는 회원을 식별할 수 없는 범위에서 서비스 개선에 이를 활용할 수 있습니다.</SubSection>

            <SectionTitle>제20조 (서비스의 변경)</SectionTitle>
            <SubSection>① 회사는 서비스 개선, 기기·플랫폼 호환성, 보안, 법령·정책 변화 또는 운영상 필요에 따라 서비스의 전부 또는 일부를 변경할 수 있습니다.</SubSection>
            <SubSection>② 회원의 이용에 중대한 영향을 미치는 변경은 적용일과 변경 내용을 사전에 안내합니다. 다만 긴급한 오류 수정, 보안 조치 또는 외부 플랫폼의 즉시 변경 등 사전 안내가 어려운 경우에는 사후 지체 없이 안내할 수 있습니다.</SubSection>
            <SubSection>③ 회사는 기존 기기나 운영체제의 지원을 종료할 수 있으며 가능한 경우 종료 일정과 대체 방법을 사전에 안내합니다.</SubSection>

            <SectionTitle>제21조 (서비스의 중단)</SectionTitle>
            <SubSection>① 회사는 서버·통신설비 점검, 장애, 보안 사고, 외부 플랫폼 중단, 천재지변, 국가비상사태 또는 그 밖의 불가항력적 사유가 있는 경우 서비스의 전부 또는 일부를 일시 중단할 수 있습니다.</SubSection>
            <SubSection>② 예정된 점검은 사전에 안내하고, 긴급한 사유로 사전 안내가 어려운 경우에는 사후 가능한 한 신속히 안내합니다.</SubSection>
            <SubSection>③ 회사의 고의 또는 과실로 회원에게 손해가 발생한 경우 회사는 관계 법령에 따라 책임을 부담합니다.</SubSection>

            <SectionTitle>제22조 (이용 제한)</SectionTitle>
            <SubSection>① 회사는 회원이 관계 법령, 이 약관 또는 운영정책을 위반한 경우 위반의 정도와 반복 여부를 고려하여 경고, 기능 제한, 계정 정지 또는 이용계약 해지 조치를 할 수 있습니다.</SubSection>
            <SubSection>② 회사는 원칙적으로 조치의 사유와 기간을 사전에 알리고 소명 기회를 제공합니다. 다만 계정 도용, 보안 침해, 개인정보 유출 위험 또는 중대한 법령 위반 등 긴급한 사유가 있는 경우 우선 조치한 후 통지할 수 있습니다.</SubSection>
            <SubSection>③ 회원은 회사가 안내한 방법으로 이용 제한에 이의를 제기할 수 있으며 회사는 이를 검토하여 결과를 안내합니다.</SubSection>

            <SectionTitle>제23조 (회원의 탈퇴와 이용계약 해지)</SectionTitle>
            <SubSection>① 회원은 서비스 내 계정 관리 또는 회사가 안내한 방법으로 언제든지 탈퇴를 요청할 수 있으며 회사는 특별한 사정이 없는 한 지체 없이 처리합니다.</SubSection>
            <SubSection>② 탈퇴 시 개인정보, 측정정보, 분석정보와 회원기록은 개인정보처리방침 및 관계 법령에 따라 처리합니다.</SubSection>
            <SubSection>③ 기기 연결 해제는 계정 탈퇴와 다르며, 연결 해제 전 이미 전송된 정보의 삭제 여부는 개인정보처리방침과 서비스 화면의 안내에 따릅니다.</SubSection>
            <SubSection>④ 회사가 데이터 내려받기 기능을 제공하는 경우 회원은 탈퇴 전에 필요한 기록을 내려받을 수 있습니다.</SubSection>

            <SectionTitle>제24조 (제품 정보와 외부 링크)</SectionTitle>
            <SubSection>① 서비스에 표시되는 닥터프렌드 제품 정보와 보유 제품 내역은 회원의 편의를 위한 정보입니다.</SubSection>
            <SubSection>② 제품의 구매, 교환·환불, 품질보증, 렌탈 또는 사후서비스는 해당 거래에 적용되는 판매조건과 관계 법령에 따릅니다.</SubSection>
            <SubSection>③ 서비스가 제3자의 웹사이트, 영상, 콘텐츠 또는 플랫폼으로 연결되는 경우 해당 외부 서비스의 약관과 개인정보처리방침이 적용될 수 있습니다.</SubSection>

            <SectionTitle>제25조 (책임의 범위)</SectionTitle>
            <SubSection>① 회사는 측정정보와 분석정보의 정확성·완전성 향상을 위해 노력하지만 센서, 착용환경, 통신과 외부 플랫폼의 특성상 모든 값의 정확성, 실시간성 또는 연속성을 보장하지는 않습니다.</SubSection>
            <SubSection>② 회사는 서비스가 의료적 진단·처방·치료 또는 응급대응을 대신하지 않음을 안내합니다.</SubSection>
            <SubSection>③ 회원의 귀책사유, 제3자 서비스의 장애 또는 회사가 합리적으로 통제하기 어려운 불가항력으로 손해가 발생한 경우 회사의 책임은 관계 법령이 허용하는 범위에서 제한될 수 있습니다.</SubSection>
            <SubSection>④ 이 조는 회사의 고의 또는 과실로 발생한 책임을 부당하게 면제하거나 관계 법령에 따라 회원에게 인정되는 권리를 제한하는 것으로 해석되지 않습니다.</SubSection>

            <SectionTitle>제26조 (회원에 대한 통지)</SectionTitle>
            <SubSection>① 회사는 서비스 내 공지사항, 앱 알림, 전자우편, 문자메시지 또는 회원이 제공한 연락처를 이용하여 통지할 수 있습니다.</SubSection>
            <SubSection>② 전체 회원에게 공통으로 적용되는 사항은 서비스 내 공지사항에 7일 이상 게시하는 방법으로 개별 통지를 대신할 수 있습니다.</SubSection>
            <SubSection>③ 회원은 정확한 연락처를 유지하고 알림 수신 환경을 관리해야 합니다.</SubSection>

            <SectionTitle>제27조 (서비스 종료)</SectionTitle>
            <SubSection>① 회사는 사업상 또는 운영상 중대한 사유가 있는 경우 서비스를 종료할 수 있습니다.</SubSection>
            <SubSection>② 회사는 원칙적으로 종료일 30일 전까지 종료 사유, 일정과 회원 데이터 처리 방법을 안내합니다.</SubSection>
            <SubSection>③ 유료서비스가 도입된 이후 서비스를 종료하는 경우 환불 등은 해당 유료서비스의 약관과 관계 법령에 따릅니다.</SubSection>

            <SectionTitle>제28조 (준거법과 분쟁 해결)</SectionTitle>
            <SubSection>① 이 약관의 해석과 서비스 이용에 관해서는 대한민국 법령을 적용합니다.</SubSection>
            <SubSection>② 회사와 회원은 서비스 이용과 관련한 분쟁을 원만하게 해결하기 위하여 성실히 협의합니다.</SubSection>
            <SubSection>③ 협의로 해결되지 않는 분쟁은 「민사소송법」 등 관계 법령에서 정한 관할 법원에 제기할 수 있습니다.</SubSection>

            <SectionTitle>부칙</SectionTitle>
            <SubSection>1. 이 약관은 2025년 1월 1일부터 시행합니다.</SubSection>

            <CompanyInfo>
              <CompanyInfoText>상호: 주식회사 디에프월드</CompanyInfoText>
              <CompanyInfoText>대표자: 김용석</CompanyInfoText>
              <CompanyInfoText>주소: 서울시 종로구 새문안로 5길 19</CompanyInfoText>
              <CompanyInfoText>사업자등록번호: 172-88-02688</CompanyInfoText>
              <CompanyInfoText>고객 문의: dr.friend@worldhomedr.com / 1588-9753 / 09:00-18:00</CompanyInfoText>
            </CompanyInfo>
          </>
        ) : (
          <>
            <SectionTitle>개인정보처리방침</SectionTitle>
            <Paragraph>
              주식회사 디에프월드(이하 "회사")는 개인정보 보호법 등 관련 법령에 따라 이용자의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 다음과 같이 개인정보처리방침을 수립·공개합니다.
            </Paragraph>

            <SectionTitle>1. 개인정보의 처리 목적</SectionTitle>
            <Paragraph>
              회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
            </Paragraph>
            <SubSection>• 회원 가입 및 관리: 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리, 서비스 부정이용 방지 등</SubSection>
            <SubSection>• 서비스 제공: 수면 측정, 분석, 코칭 등 서비스 제공 및 맞춤형 서비스 제공</SubSection>
            <SubSection>• 고객 문의 대응: 민원인의 신원 확인, 민원사항 확인, 사실조사를 위한 연락·통지, 처리결과 통보</SubSection>

            <SectionTitle>2. 처리하는 개인정보 항목</SectionTitle>
            <SubSection>• 필수항목: 이메일 주소, 비밀번호, 휴대전화번호</SubSection>
            <SubSection>• 선택항목: 생년월일, 성별, 신장, 체중</SubSection>
            <SubSection>• 자동 수집 항목: 서비스 이용 기록, 접속 로그, 기기 정보</SubSection>
            <SubSection>• 건강정보: 수면 데이터, 활동량 데이터 (연동기기 이용 시)</SubSection>

            <SectionTitle>3. 개인정보의 처리 및 보유 기간</SectionTitle>
            <Paragraph>
              회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
            </Paragraph>
            <SubSection>• 회원 정보: 회원 탈퇴 시까지 (단, 관계 법령에 따라 보존이 필요한 경우 해당 기간)</SubSection>
            <SubSection>• 건강정보: 수집일로부터 1년 (또는 회원 탈퇴 시)</SubSection>

            <SectionTitle>4. 개인정보의 제3자 제공</SectionTitle>
            <Paragraph>
              회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음의 경우에는 예외로 합니다.
            </Paragraph>
            <SubSection>• 이용자가 사전에 동의한 경우</SubSection>
            <SubSection>• 법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</SubSection>

            <SectionTitle>5. 개인정보의 파기</SectionTitle>
            <Paragraph>
              회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
            </Paragraph>

            <SectionTitle>6. 정보주체의 권리·의무 및 행사방법</SectionTitle>
            <Paragraph>
              이용자는 개인정보주체로서 다음과 같은 권리를 행사할 수 있습니다.
            </Paragraph>
            <SubSection>• 개인정보 열람 요구</SubSection>
            <SubSection>• 오류 등이 있을 경우 정정 요구</SubSection>
            <SubSection>• 삭제 요구</SubSection>
            <SubSection>• 처리정지 요구</SubSection>

            <SectionTitle>7. 개인정보 보호책임자</SectionTitle>
            <SubSection>• 성명: 김용석</SubSection>
            <SubSection>• 직책: 대표이사</SubSection>
            <SubSection>• 연락처: dr.friend@worldhomedr.com / 1588-9753</SubSection>

            <CompanyInfo>
              <CompanyInfoText>이 개인정보처리방침은 2025년 1월 1일부터 적용됩니다.</CompanyInfoText>
            </CompanyInfo>
          </>
        )}
      </ContentContainer>
    </Screen>
  );
};

export default TermsPolicyScreen;
