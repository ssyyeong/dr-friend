const serverSettings: { config: { apiUrl: string } } = {
  config: {
    // 예: "http://localhost:4021" 또는 도메인명
    // 안드로이드 에뮬레이터: "http://10.0.2.2:4021"
    // iOS 시뮬레이터: "http://localhost:4021"
    // 실제 디바이스: "http://[로컬IP]:4021"
    // apiUrl: "http://13.125.110.225:4021", // 안드로이드 에뮬레이터용 로컬 서버 API URL
    apiUrl: "http://10.0.2.2:4021", // 안드로이드 에뮬레이터용 로컬 서버 API URL
  },
};

export default serverSettings;
