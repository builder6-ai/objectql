import { Controller, Get, Param, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { ObjectQL } from '@objectql/core';

@Controller('api/v6/metadata')
export class MetadataController {
    
    constructor(@Inject(ObjectQL) private objectql: ObjectQL) {}

    @Get(':type/:name')
    async getMetadata(@Param('type') type: string, @Param('name') name: string) {
        
    }

}
