import { BadRequestException, ForbiddenException, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { AdminRepository } from '../repository/admin.repository';
import { encryptPassword } from '../../../utils/hashing.util';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { RoleEnum } from '../../../common/constant/role.constant';
import { FilterDto } from '../dto/filter.dto';
import { UpdateAdminDto } from '../dto/update-admin.dto';
import { IsNull, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminEntity } from '../entities/admin.entity';
import { RegionService } from '../../../modules/region/services/region.service';
import { BlesscomnService } from '../../blesscomn/blesscomn/services/blesscomn.service';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class AdminService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(AdminEntity)
    private defaultAdminRepo: Repository<AdminEntity>,

    private readonly configService: ConfigService,
    private readonly regionService: RegionService,
    private readonly adminRepository: AdminRepository,
    private readonly blesscomnService: BlesscomnService,
  ) {}

  async onApplicationBootstrap() {
    const ROLE_SUPERADMIN = await this.getByUsername('superadmin');
    if (!ROLE_SUPERADMIN) {
      this.defaultAdminRepo.save({
        name: 'superadmin',
        email: 'superadmin@mail.com',
        password: encryptPassword('Asdf1234.'),
        role: RoleEnum.ROLE_SYSTEMADMIN,
      });
    }
  }

  getByUsername(name: string) {
    return this.adminRepository.findOneBy({ name: name ?? IsNull() });
  }

  getByEmail(email: string) {
    return this.adminRepository.findOneBy({ email: email ?? IsNull() });
  }

  getByUsernameOrEmail(usernameOrEmail: string) {
    return this.adminRepository.findOne({
      where: [{ name: usernameOrEmail }, { email: usernameOrEmail }],
      relations: { region: true },
    });
  }

  async create(dto: CreateAdminDto) {
    const newUser = this.adminRepository.create({
      ...dto,
      name: dto.name.toLowerCase(),
      email: dto.email?.toLowerCase(),
      temp_password: encryptPassword(this.configService.get('TEMP_PASSWORD')),
    });

    return this.adminRepository.save(newUser);
  }

  async getAll(filter: FilterDto) {
    const regions = await this.regionService.getByHierarchy({ region_id: filter?.region_tree_id });
    filter.region_ids = regions.map((data) => data.id);
    filter.region_ids.push(filter.region_tree_id);

    return this.adminRepository.getAll(filter);
  }

  findOne(id: number, region_id?: number) {
    return this.adminRepository.getOne(id);
  }

  async updatePassword(id: number, password: string) {
    const user = await this.findOne(id);
    if (!user) throw new BadRequestException('admin is not found!');
    if (user.role === RoleEnum.ROLE_SYSTEMADMIN) throw new ForbiddenException();

    await this.adminRepository.save({
      ...user,
      password: encryptPassword(password),
      temp_password: null,
    });
  }

  async resetPassword(id: number, user_region_id: number) {
    const user = await this.findOne(id);
    if (!user) throw new BadRequestException('admin is not found!');
    if (user.role === RoleEnum.ROLE_SYSTEMADMIN) throw new ForbiddenException();

    let region_ids: number[] = [];
    const regions = await this.regionService.getByHierarchy({ region_id: user_region_id });
    region_ids = regions.map((data) => data.id);
    region_ids.push(user_region_id);

    const isInParent = user.region_id === user_region_id;
    const isInHeiracy = region_ids.includes(user.region_id);
    if (!isInParent && !isInHeiracy) throw new ForbiddenException();

    await this.adminRepository.save({
      ...user,
      password: null,
      temp_password: encryptPassword(this.configService.get('TEMP_PASSWORD')),
    });
  }

  @Transactional()
  async update(id: number, dto: UpdateAdminDto, user_region_id: number) {
    const user = await this.findOne(id);
    if (!user) throw new BadRequestException('admin is not found!');
    if (user.role === RoleEnum.ROLE_SYSTEMADMIN) throw new ForbiddenException();

    const regions = await this.regionService.getByHierarchy({ region_id: user_region_id });
    dto.region_ids = regions.map((data) => data.id);
    dto.region_ids.push(user_region_id);

    const isInParent = user.region_id === user_region_id;
    const isInHeiracy = dto.region_ids.includes(user.region_id);
    if (!isInParent && !isInHeiracy) throw new ForbiddenException();

    delete user.region;

    const updateUser = await this.adminRepository.save({
      ...user,
      ...dto,
      name: dto.name.toLowerCase() ?? user.name.toLowerCase(),
      email: dto.email.toLowerCase() ?? user.email.toLowerCase(),
      password: user.password,
    });

    this.blesscomnService.createAdminBlesscomn({
      admin_id: user.id,
      blesscomn_ids: dto.blesscomn_ids,
      region_id: user_region_id,
    });

    return updateUser.id;
  }

  async remove(id: number, user_region_id?: number) {
    const user = await this.findOne(id);
    if (!user) throw new BadRequestException('admin is not found!');
    if (user.role === RoleEnum.ROLE_SYSTEMADMIN) throw new ForbiddenException();

    let region_ids: number[] = [];
    const regions = await this.regionService.getByHierarchy({ region_id: user_region_id });
    region_ids = regions.map((data) => data.id);
    region_ids.push(user_region_id);

    const isInParent = user.region_id === user_region_id;
    const isInHeiracy = region_ids.includes(user.region_id);
    if (!isInParent && !isInHeiracy) throw new ForbiddenException();

    await this.adminRepository.softRemove(user);

    return user.id;
  }

  async restore(id: number) {
    const user = await this.findOne(id);
    if (!user) throw new BadRequestException('regions is not found');
    await this.adminRepository.recover(user);

    return user.id;
  }
}
