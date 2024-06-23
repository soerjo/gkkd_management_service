import { BadRequestException, ForbiddenException, Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { AdminRepository } from '../repository/admin.repository';
import { encryptPassword } from 'src/utils/hashing.util';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { RoleEnum } from 'src/common/constant/role.constant';
import { FilterDto } from '../dto/filter.dto';
import { UpdateAdminDto } from '../dto/update-admin.dto';
import { IsNull, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminEntity } from '../entities/admin.entity';

@Injectable()
export class AdminService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(AdminEntity)
    private defaultAdminRepo: Repository<AdminEntity>,

    private readonly configService: ConfigService,
    private readonly adminRepository: AdminRepository,
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

  async create(createAdminDto: CreateAdminDto) {
    const newUser = this.adminRepository.create({
      ...createAdminDto,
      temp_password: encryptPassword(this.configService.get('TEMP_PASSWORD')),
    });

    return this.adminRepository.save(newUser);
  }

  getAll(filter: FilterDto) {
    return this.adminRepository.getAll(filter);
  }

  findOne(id: number, region_id?: number) {
    return this.adminRepository.findOne({
      where: { id: id ?? IsNull(), region: { id: region_id } },
      relations: { region: true },
    });
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

  async resetPassword(id: number) {
    const user = await this.findOne(id);
    if (!user) throw new BadRequestException('admin is not found!');
    if (user.role === RoleEnum.ROLE_SYSTEMADMIN) throw new ForbiddenException();

    await this.adminRepository.save({
      ...user,
      password: null,
      temp_password: encryptPassword(this.configService.get('TEMP_PASSWORD')),
    });
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) {
    const user = await this.findOne(id);
    if (!user) throw new BadRequestException('admin is not found!');
    if (user.role === RoleEnum.ROLE_SYSTEMADMIN) throw new ForbiddenException();

    const updateUser = await this.adminRepository.save({
      ...user,
      ...updateAdminDto,
      password: updateAdminDto.password ? encryptPassword(updateAdminDto.password) : user.password,
    });

    return updateUser.id;
  }

  async remove(id: number, region_id?: number) {
    const user = await this.findOne(id);
    if (!user) throw new BadRequestException('admin is not found!');
    if (user.role === RoleEnum.ROLE_SYSTEMADMIN) throw new ForbiddenException();

    await this.adminRepository.softRemove(user);

    return user.id;
  }
}
