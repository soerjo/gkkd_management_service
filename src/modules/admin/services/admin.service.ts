import { BadRequestException, ForbiddenException, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { AdminRepository } from '../repository/admin.repository';
import { encryptPassword } from 'src/utils/hashing.util';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { RoleEnum } from 'src/common/constant/role.constant';
import { FilterDto } from '../dto/filter.dto';
import { UpdateAdminDto } from '../dto/update-admin.dto';
import { JemaatService } from 'src/modules/jemaat/services/jemaat.service';

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
    return this.adminRepository.findOneBy({ name });
  }

  getByEmail(email: string) {
    return this.adminRepository.findOneBy({ email });
  }

  getByUsernameOrEmail(usernameOrEmail: string) {
    return this.adminRepository.findOne({
      where: [{ name: usernameOrEmail }, { email: usernameOrEmail }],
    });
  }

  async create(createAdminDto: CreateAdminDto) {
    const jemaat = await this.jemaatService.findOne(createAdminDto.jemaat_id);
    createAdminDto.jemaat = jemaat;

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

  findOne(id: string) {
    return this.adminRepository.findOne({
      where: { id },
      relations: { regions: true },
    });
  }

  async update(id: string, updateAdminDto: UpdateAdminDto) {
    const user = await this.findOne(id);
    if (!user) throw new BadRequestException({ message: 'admin is not found!' });
    if (user.name === 'superadmin') throw new ForbiddenException();

    if (updateAdminDto.jemaat_id) {
      const jemaat = await this.jemaatService.findOne(updateAdminDto.jemaat_id);
      updateAdminDto.jemaat = jemaat;
    }

    const updateUser = await this.adminRepository.save({
      ...user,
      ...updateAdminDto,
      password: updateAdminDto.password ? encryptPassword(updateAdminDto.password) : user.password,
    });

    return updateUser.id;
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    if (!user) throw new BadRequestException({ message: 'admin is not found!' });

    await this.adminRepository.softRemove(user);

    return user.id;
  }
}
