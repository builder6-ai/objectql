import { Injectable } from '@nestjs/common';

/**
 * Application Service
 * 
 * Provides application-level business logic.
 * Currently a placeholder for future application-wide functionality.
 * 
 * Following Rule #3: NestJS Native DI - marked as Injectable.
 */
@Injectable()
export class AppService {
  /**
   * Returns a hello message.
   * 
   * @returns Greeting string
   * @deprecated This is a placeholder method
   */
  getHello(): string {
    return 'Hello World!';
  }
}
