export type ApiResponseErrorOptions<P = unknown> = {
  message: string;
  /** 생략 시 500 */
  status?: number;
  /** 에러여도 함께 내려줄 부가 데이터(검증 필드, 코드 등) */
  payload?: P | null;
};

export interface ApiResponseDto<T = unknown> {
  error: {
    message: string;
    status: number;
  } | null;
  payload: T | null;
}

export class ApiResponseDto<T = unknown> implements ApiResponseDto<T> {
  error: { message: string; status: number } | null = null;

  payload: T | null;

  constructor(payload: T) {
    this.payload = payload;
  }

  /**
   * 에러 응답 본문(Swagger `example` 등). 런타임에서는 `HttpException`에 `payload`를 넣거나 전역 필터를 사용.
   */
  static error<P = null>(
    options: ApiResponseErrorOptions<P>,
  ): ApiResponseDto<P> {
    const dto = new ApiResponseDto<P>(null as P);
    dto.error = {
      message: options.message,
      status: options.status ?? 500,
    };
    dto.payload = options.payload ?? null;
    return dto;
  }
}
