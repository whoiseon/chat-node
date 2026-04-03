import { Logger } from '@/common/configs';
import { env } from '@/common/utils';

import { Bootstrap } from './bootstrap';

class Main {
  private logger = new Logger('MainClass');

  public async start() {
    const bootstrap = new Bootstrap();

    bootstrap.listen(env.PORT, () => {
      this.logger.info(`environment path: .env.${env.NODE_ENV}`);
      this.logger.info(`Server is running on port ${env.PORT}`);
    });
  }
}

const main = new Main();
main.start().catch((error) => {
  console.error(error);
  process.exit(1);
});
