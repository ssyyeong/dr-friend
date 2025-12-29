type AnswersMap = Record<number, number>; // { [questionNo]: choiceNo(1~5) }

type LevelCode =
  | "EXCELLENT"
  | "GOOD_MINOR"
  | "CAUTION"
  | "PROBLEMATIC"
  | "SEVERE";

type FlagType =
  | "OSA_RISK"
  | "RLS_RISK"
  | "SLEEP_MED_RISK"
  | "DAYTIME_SLEEPY_RISK"
  | "CHRONIC_MANAGE_POOR";

export interface SleepSurveyResultPayload {
  TOTAL_SHT: number;
  LEVEL_CODE: LevelCode;
  LEVEL_LABEL_KO: string;
  LEVEL_LABEL_EN: string;

  SUB_SLEEP_QUALITY: number;
  SUB_DAYTIME_SLEEPINESS: number;
  SUB_INSOMNIA: number;
  SUB_STRESS: number;

  FLAGS_JSON: Array<{ type: FlagType; questionNo: number; choiceNo: number }>;

  CHRONIC_COUNT_CHOICE_NO?: number;
  CHRONIC_MANAGE_CHOICE_NO?: number;

  RESULT_TEXT_KEY?: string;
}

const sumByQuestions = (answers: AnswersMap, questionNos: number[]) => {
  return questionNos.reduce((acc, qNo) => {
    const choiceNo = answers[qNo];
    if (!choiceNo) return acc; // 미응답이면 0으로 처리(또는 throw 해도 됨)
    const score = choiceNo - 1; // 1~5 -> 0~4
    return acc + score;
  }, 0);
};

const getLevel = (
  totalSht: number
): { code: LevelCode; ko: string; en: string; textKey: string } => {
  if (totalSht <= 16)
    return {
      code: "EXCELLENT",
      ko: "매우 양호",
      en: "Excellent",
      textKey: "SHT_EXCELLENT",
    };
  if (totalSht <= 39)
    return {
      code: "GOOD_MINOR",
      ko: "양호·소견 있음",
      en: "Good minor concerns",
      textKey: "SHT_GOOD_MINOR",
    };
  if (totalSht <= 62)
    return {
      code: "CAUTION",
      ko: "주의",
      en: "Caution",
      textKey: "SHT_CAUTION",
    };
  if (totalSht <= 84)
    return {
      code: "PROBLEMATIC",
      ko: "문제성",
      en: "Problematic",
      textKey: "SHT_PROBLEMATIC",
    };
  return { code: "SEVERE", ko: "심각", en: "Severe", textKey: "SHT_SEVERE" };
};

export const calcSleepSurveyResult = (
  answers: AnswersMap
): SleepSurveyResultPayload => {
  // 총점(1~28)
  const totalQuestions = Array.from({ length: 28 }, (_, i) => i + 1);
  const TOTAL_SHT = sumByQuestions(answers, totalQuestions);

  // 서브스코어
  const SUB_SLEEP_QUALITY = sumByQuestions(
    answers,
    [1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 13, 14]
  );
  const SUB_DAYTIME_SLEEPINESS = sumByQuestions(
    answers,
    [15, 16, 17, 18, 19, 20, 21]
  );
  const SUB_INSOMNIA = sumByQuestions(answers, [2, 3, 7, 22, 23, 24]);
  const SUB_STRESS = sumByQuestions(answers, [25, 26, 27, 28]);

  // 레벨
  const level = getLevel(TOTAL_SHT);

  // 플래그
  const FLAGS_JSON: Array<{
    type: FlagType;
    questionNo: number;
    choiceNo: number;
  }> = [];

  const pushFlag = (type: FlagType, questionNo: number) => {
    const choiceNo = answers[questionNo];
    if (!choiceNo) return;
    FLAGS_JSON.push({ type, questionNo, choiceNo });
  };

  // ④·⑤는 choiceNo 4~5
  if ((answers[12] ?? 0) >= 4) pushFlag("OSA_RISK", 12);
  if ((answers[13] ?? 0) >= 4) pushFlag("RLS_RISK", 13);
  if ((answers[14] ?? 0) >= 4) pushFlag("SLEEP_MED_RISK", 14);

  // 16~21 중 하나라도 4 이상이면 대표로 가장 높은 항목 하나만 넣기(원하면 전부 넣어도 됨)
  const daytimeQs = [16, 17, 18, 19, 20, 21];
  let maxQ = 0;
  let maxChoice = 0;
  for (const q of daytimeQs) {
    const c = answers[q] ?? 0;
    if (c > maxChoice) {
      maxChoice = c;
      maxQ = q;
    }
  }
  if (maxChoice >= 4) {
    FLAGS_JSON.push({
      type: "DAYTIME_SLEEPY_RISK",
      questionNo: maxQ,
      choiceNo: maxChoice,
    });
  }

  // 만성질환 플래그 (29>=②(2) AND 30>=④(4))
  const chronicCount = answers[29];
  const chronicManage = answers[30];
  if ((chronicCount ?? 0) >= 2 && (chronicManage ?? 0) >= 4) {
    FLAGS_JSON.push({
      type: "CHRONIC_MANAGE_POOR",
      questionNo: 30,
      choiceNo: chronicManage!,
    });
  }

  return {
    TOTAL_SHT,
    LEVEL_CODE: level.code,
    LEVEL_LABEL_KO: level.ko,
    LEVEL_LABEL_EN: level.en,

    SUB_SLEEP_QUALITY,
    SUB_DAYTIME_SLEEPINESS,
    SUB_INSOMNIA,
    SUB_STRESS,

    FLAGS_JSON,

    CHRONIC_COUNT_CHOICE_NO: chronicCount,
    CHRONIC_MANAGE_CHOICE_NO: chronicManage,

    RESULT_TEXT_KEY: level.textKey,
  };
};
