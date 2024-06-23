import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrganizationBlesscomnService } from './organization-blesscomn.service';
import { CreateOrganizationBlesscomnDto } from './dto/create-organization-blesscomn.dto';
import { UpdateOrganizationBlesscomnDto } from './dto/update-organization-blesscomn.dto';

@Controller('organization-blesscomn')
export class OrganizationBlesscomnController {
  constructor(private readonly organizationBlesscomnService: OrganizationBlesscomnService) {}

  @Post()
  create(@Body() createOrganizationBlesscomnDto: CreateOrganizationBlesscomnDto) {
    return this.organizationBlesscomnService.create(createOrganizationBlesscomnDto);
  }

  @Get()
  findAll() {
    return this.organizationBlesscomnService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationBlesscomnService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrganizationBlesscomnDto: UpdateOrganizationBlesscomnDto) {
    return this.organizationBlesscomnService.update(+id, updateOrganizationBlesscomnDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organizationBlesscomnService.remove(+id);
  }
}
