import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { isDevelopmentEnviroment } from 'src/utils/environment';

/**
 * A service that extends PrismaClient for database operations and includes custom logging.
 *
 * @extends {PrismaClient<Prisma.PrismaClientOptions, 'query' | 'error' | 'debug' | 'info'>}
 * @implements {OnModuleInit}
 *
 * @description
 * This service extends PrismaClient to provide database interaction capabilities.
 * It is configured with custom logging for queries, errors, and additional info.
 * The service initializes a connection to the database on module initialization.
 */
@Injectable()
export class PrismaService
  extends PrismaClient<
    Prisma.PrismaClientOptions,
    'query' | 'error' | 'debug' | 'info'
  >
  implements OnModuleInit
{
  private readonly logger = new Logger(PrismaService.name);

  private readonly debug = isDevelopmentEnviroment();

  // To show query set the boolean to true
  private readonly showQuery = false && isDevelopmentEnviroment();

  /**
   * Initializes the PrismaService with custom configuration.
   *
   * @description
   * The constructor sets up the Prisma client with logging options and initializes
   * custom logging based on the environment. It logs queries and their execution time
   * in development environments. It also outputs the Prisma client version on initialization.
   */
  constructor() {
    super({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'stdout',
          level: 'error',
        },
        {
          emit: 'stdout',
          level: 'info',
        },
        {
          emit: 'stdout',
          level: 'warn',
        },
      ],
    });

    this.logger.log(`Prisma v${Prisma.prismaVersion.client}`);

    if (this.debug) {
      if (this.showQuery) {
        this.$on('query', (e) => {
          console.log('Query: ' + e.query);
          console.log('Params: ' + e.params);
          console.log('Duration: ' + e.duration + 'ms');
        });
      }

      this.$use(async (params, next) => {
        const before = Date.now();

        const result = await next(params);

        const after = Date.now();

        this.logger.debug(
          `Query ${params.model}.${params.action} took ${after - before}ms`,
        );

        return result;
      });
    }
  }

  /**
   * Initializes the Prisma client connection when the module is loaded.
   *
   * @returns {Promise<void>} A promise that resolves when the database connection is established.
   *
   * @description
   * This lifecycle hook method ensures that the Prisma client is connected to the database
   * when the module containing this service is initialized.
   */
  async onModuleInit(): Promise<void> {
    let connected = false;
    let countRetry = 0;

    while (!connected) {
      try {
        this.logger.log('Connecting to database...');
        await this.$connect();
        connected = true;
      } catch (error) {
        countRetry++;

        if (countRetry === 3) {
          this.logger.error('Maximum retries exceeded. Exiting...');
          process.exit(1);
        }

        this.logger.error('Error trying to connect to database:', error);
        this.logger.debug('Trying again in 5 seconds...');
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  }
}
