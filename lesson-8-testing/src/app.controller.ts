import { Controller, Get, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { AppService } from './app.service';
import { Roles, ROLES_KEY } from './auth/decorators/roles.decorator';
import { RolesGuard } from './auth/guards/roles/roles.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  getHello(): string {
    return this.appService.getHello();
  }
}
