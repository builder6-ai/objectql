import { Controller, Get, Render, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class ViewsController {
  @Get()
  root(@Res() res: Response) {
    return res.redirect('/object/projects/PROJ-001');
  }

  @Get('login')
  @Render('login')
  login() {
    return { title: 'Sign In - ObjectQL' };
  }

  @Get(['object/*', 'settings'])
  @Render('dashboard')
  dashboard() {
    return { title: 'ObjectQL' };
  }
}
