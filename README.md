# 🌙 Dr. Friend — 수면 건강 앱

React Native 기반의 수면 건강 관리 앱입니다.  
Fitbit 웨어러블 디바이스와 연동해 수면 데이터를 수집·분석하고, 사용자의 수면 패턴 개선을 돕습니다.

---

## 📱 주요 기능

- **수면 기록** — 수면 시작/종료 시간 및 수면 일지 작성
- **수면 통계** — 수면 단계별(REM, Deep, Light, Awake) 데이터 시각화
- **케어 서비스** — 수면 패턴 분석 기반 맞춤 케어 제공
- **Fitbit 연동** — 웨어러블 디바이스에서 실시간 수면 데이터 수신

---

## 🛠 기술 스택

| 분류 | 기술 |
|------|------|
| Frontend / App | React Native, TypeScript |
| Backend | Node.js |
| 외부 연동 | Fitbit Web API (OAuth 2.0) |
| 개발 환경 | Expo |

---

## 🔐 Fitbit OAuth 2.0 직접 구현

이 프로젝트에서 가장 도전적인 부분은 **Fitbit Web API 인증 플로우를 서드파티 라이브러리 없이 직접 설계·구현**한 것입니다.

### 구현 흐름

```
1. 앱 내 WebView로 Fitbit 인증 페이지 진입
2. 사용자 로그인 및 권한 동의
3. Authorization Code 수신
4. 서버에서 Access Token / Refresh Token 교환
5. Token 만료 시 자동 갱신 처리
```

### 해결한 문제들

- **Redirect URI 처리** — 앱 딥링크와 WebView 간 콜백 흐름 설계
- **Token 갱신 로직** — Access Token 만료 시 Refresh Token으로 자동 재발급, 재발급 실패 시 재인증 유도
- **수면 데이터 파싱** — Fitbit API 응답의 수면 단계 데이터(stages)를 앱 UI에 맞게 가공하는 로직 직접 설계

---

## 🏗 프로젝트 구조

```
src/
├── @types/               # 타입 선언 (fitbit.d.ts, styled.d.ts, svg.d.ts)
├── app/
│   └── navigation/       # RootNavigator — 앱 전체 라우팅
├── features/             # 도메인별 기능 모듈
│   ├── auth/             # 로그인 및 Fitbit OAuth 인증
│   ├── care/             # 케어 서비스
│   ├── diary/            # 수면 일지
│   ├── profile/          # 프로필
│   ├── sleep/            # 수면 기록
│   └── stats/            # 수면 통계
└── services/             # 공통 서비스 레이어
    ├── AppMemberController.ts
    ├── SleepRecordController.ts
    ├── authService.ts
    └── controller.ts
```

---

## 👤 개발 참여 인원

- 1인 개발 (서버 + 앱 전체)
- 기획 제외 설계·개발·배포 전 과정 단독 수행

---

## 📌 개발 특이사항

- Fitbit Web API는 공식 React Native SDK가 없어 **OAuth 플로우를 처음부터 직접 설계**
- 수면 단계 데이터(REM / Deep / Light / Awake)의 응답 구조가 날짜별로 상이해 **파싱 로직을 직접 설계**
- 외부 디바이스 연동 특성상 네트워크 오류 및 토큰 만료 케이스에 대한 **예외 처리 전략 수립**
