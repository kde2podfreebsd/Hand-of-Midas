export type SurveyQuestionResponse = string[];

export interface SurveyAnswersRequest {
  user_id: string;
  question_1: string;
  question_2: string;
  question_3: string;
  question_4: string;
  question_5: string;
}

export interface SurveyAnswersResponse {
  user_id: string;
  answers: string[];
  summary: string;
}
