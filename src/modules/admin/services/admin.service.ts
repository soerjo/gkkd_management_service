import { BadRequestException, ForbiddenException, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { AdminRepository } from '../repository/admin.repository';
import { encryptPassword } from 'src/utils/hashing.util';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { RoleEnum } from 'src/common/constant/role.constant';
import { FilterDto } from '../dto/filter.dto';
import { UpdateAdminDto } from '../dto/update-admin.dto';
import { JemaatService } from 'src/modules/jemaat/services/jemaat.service';
import { IsNull } from 'typeorm';

@Injectable()
export class AdminService implements OnApplicationBootstrap {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly jemaatService: JemaatService,
  ) {}

  async onApplicationBootstrap() {
    const superadmin = await this.getByUsername('superadmin');
    if (!superadmin) {
      await this.create({
        name: 'superadmin',
        email: 'superadmin@mail.com',
        password: 'Asdf1234.',
        role: RoleEnum.SUPERADMIN,
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
      password: encryptPassword(createAdminDto.password),
      temp_password: '',
    });

    return this.adminRepository.save(newUser);
  }

  getAll(filter: FilterDto) {
    return this.adminRepository.getAll(filter);
  }

  findOne(id: number) {
    return this.adminRepository.findOne({
      where: { id: id ?? IsNull() },
      relations: { region: true },
    });
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) {
    const user = await this.findOne(id);
    if (!user) throw new BadRequestException({ message: 'admin is not found!' });
    if (user.name === 'superadmin') throw new ForbiddenException();

    const updateUser = await this.adminRepository.save({
      ...user,
      ...updateAdminDto,
      password: updateAdminDto.password ? encryptPassword(updateAdminDto.password) : user.password,
    });

    return updateUser.id;
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) throw new BadRequestException({ message: 'admin is not found!' });

    await this.adminRepository.softRemove(user);

    return user.id;
  }
}
