import {
  utilities,
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

// Nest/Node 실행 시점에 NODE_ENV가 항상 주입되는 것은 아니어서 기본값을 둡니다.
const nodeEnv = process.env.NODE_ENV ?? 'development';

export const winstonOptions = new winston.transports.Console({
  level: nodeEnv === 'production' ? 'http' : 'silly',
  format: winston.format.combine(
    winston.format.timestamp(),
    nestWinstonModuleUtilities.format.nestLike('ChatNode', {
      prettyPrint: true,
    }),
  ),
});

export const dailyOption = new winston.transports.DailyRotateFile({
  level: nodeEnv === 'production' ? 'info' : 'silly',
  datePattern: 'YYYY-MM-DD',
  dirname: `./logs/${nodeEnv}`, // 폴더 경로
  filename: `%DATE%.log`, // 파일 이름
  maxFiles: 30, // 최대 생성하는 파일의 개수 ( 넘기면 이전 파일 자동 삭제 )
  zippedArchive: true,
  format: winston.format.combine(
    winston.format.timestamp(),
    utilities.format.nestLike('ChatNode', {
      colors: false,
      prettyPrint: true,
    }),
  ),
});

export const winstonLogger = WinstonModule.createLogger({
  transports: [winstonOptions, dailyOption],
});
