import { API1_URL } from "../../constants";
import {
  SurveyAnswersRequest,
  SurveyAnswersResponse,
  SurveyQuestionResponse,
} from "./types";

export const survey = {
  getQuestions: async (): Promise<SurveyQuestionResponse> => {
    const response = await fetch(`${API1_URL}/survey/questions`);
    return response.json();
  },

  submitAnswers: async (
    data: SurveyAnswersRequest
  ): Promise<SurveyAnswersResponse> => {
    const url = new URL(`${API1_URL}/survey/answers`);

    url.searchParams.append("user_id", data.user_id);
    url.searchParams.append("question_1", data.question_1);
    url.searchParams.append("question_2", data.question_2);
    url.searchParams.append("question_3", data.question_3);
    url.searchParams.append("question_4", data.question_4);
    url.searchParams.append("question_5", data.question_5);

    const response = await fetch(url.toString(), { method: "POST" });
    return response.json();
  },

  getAnswers: async (userId: string): Promise<SurveyAnswersResponse> => {
    const url = new URL(`${API1_URL}/survey/answers`);
    url.searchParams.append('user_id', userId);
    
    const response = await fetch(url.toString());
    return response.json();
  }
};
