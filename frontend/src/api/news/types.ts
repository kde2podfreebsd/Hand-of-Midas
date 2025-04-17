// types.ts

// Ответ для пагинированного списка новостей
export interface PaginatedPostsResponse {
  posts: PostResponse[];
  page: number;
}

// Ответ с тегами новостей
export interface NewsTags {
  tags: string[];
}

// Структура отдельной новости
export interface PostResponse {
  text: string;
  date: string;
  source: string;
  views: number;
  link: string;
  tags: string[];
}

// Ответ с аналитической сводкой
export interface SummaryResponse {
  summary: string;
}

// Общий тип для ошибок валидации (если еще не объявлен)
export interface HTTPValidationError {
  detail: ValidationError[];
}

interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

// Дополнительные типы для параметров запросов (опционально)
export interface GetNewsParams {
  page?: number;
}

export interface GetNewsByTagParams {
  tags?: string[];
  page?: number;
}

export interface GetSummaryByTagParams {
  tags?: string[];
}