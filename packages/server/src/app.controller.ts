import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';

/**
 * Application Controller
 * 
 * Provides basic application-level endpoints.
 * Following Rule #3: NestJS Native DI - uses constructor injection.
 * Following Rule #1: The Dependency Wall - server layer handles HTTP, not data access.
 */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Health Check Endpoint
   * 
   * Returns the health status of the server.
   * Used by load balancers and monitoring systems to verify service availability.
   * 
   * @returns Health status object
   * 
   * @example
   * GET /api/health
   * Response: { status: 'ok' }
   */
  @Get('api/health')
  health() {
    return { status: 'ok' };
  }
}
