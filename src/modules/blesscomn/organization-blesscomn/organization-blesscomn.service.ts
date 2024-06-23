import { Injectable } from '@nestjs/common';
import { CreateOrganizationBlesscomnDto } from './dto/create-organization-blesscomn.dto';
import { UpdateOrganizationBlesscomnDto } from './dto/update-organization-blesscomn.dto';

@Injectable()
export class OrganizationBlesscomnService {
  create(createOrganizationBlesscomnDto: CreateOrganizationBlesscomnDto) {
    return 'This action adds a new organizationBlesscomn';
  }

  findAll() {
    return `This action returns all organizationBlesscomn`;
  }

  findOne(id: number) {
    return `This action returns a #${id} organizationBlesscomn`;
  }

  update(id: number, updateOrganizationBlesscomnDto: UpdateOrganizationBlesscomnDto) {
    return `This action updates a #${id} organizationBlesscomn`;
  }

  remove(id: number) {
    return `This action removes a #${id} organizationBlesscomn`;
  }
}
