import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { SyncIbadahDto } from '../dto/sync-ibadah.dto';
import { ConfigService } from '@nestjs/config';
import { SyncBlesscomnDto } from '../dto/sync-blesscomn.dto';
import { SyncDescipleDto } from '../dto/sync-desciple.dto';

@Injectable()
export class GkkdServiceService {
  private readonly logging: Logger = new Logger(GkkdServiceService.name);
  private readonly axiosInstance: AxiosInstance;

  constructor(
    private readonly configService: ConfigService
  ) {
    this.axiosInstance = axios.create({
      baseURL: process.env.GKKD_SERVICE,
    });
  }

  async syncIbadah(dto: SyncIbadahDto): Promise<any> {
    this.logging.log('============== SYNC IBADAH =============');
    this.logging.log({dto});

    // const formData = new FormData();
    // for (const key in dto) {
    //   formData.append(key, '1');
    // }

    try {
      const response = await this.axiosInstance.post('/app/f?id=31', {
          _csrf: this.configService.get<string>('GKKD_SERVICE_CSRF'),
          date_1: dto.tanggal,
          "selectlist_1": dto.ibadah,
          "selectlist_4": dto.pelayanan,
          "number_2": dto.onsite_pria,
          "number_5": dto.onsite_wanita,
          "number_3": dto.onsite_total,
          "number_7": dto.online_pria,
          "number_6": dto.online_wanita,
          "number_8": dto.online_total,
          "number_4": dto.orba_pria,
          "number_1": dto.orba_wanita,
          "selectlist_2": "True",
          "button_1": null,
          "_email": null,
      });
      this.logging.log('============== RESPONSE IBADAH =============');
      this.logging.log({response: response.data});

      return response.data;
    } catch (error) {
      this.logging.error(error);
      throw new Error(`Error fetching data: ${error.message}`);
    }
  }

  async syncBlesscomn(dto: SyncBlesscomnDto): Promise<any> {
    this.logging.log('============== SYNC BLESSCOMN =============');
    this.logging.log({dto});

    try {
      const response = await this.axiosInstance.post('/app/f?id=50', {
        _csrf: this.configService.get<string>('GKKD_SERVICE_CSRF'),
        date_1: dto.tanggal,
        "selectlist_2": dto.wilayah,
        "selectlist_4": dto.pelayanan,
        "selectlist_1": dto.blesscomn,
        "number_2": dto.hadir_pria,
        "number_3": dto.hadir_wanita,
        "number_4": dto.hadir_total,
        "number_5": dto.orba_pria,
        "number_1": dto.orba_wanita,
        "button_1": null,
        "_email": null,
      });
      this.logging.log('============== RESPONSE BLESSCOMN =============');
      this.logging.log({response: response.data});

      return response.data;
    } catch (error) {
      this.logging.error(error);
      throw new Error(`Error fetching data: ${error.message}`);
    }
  }

  async syncDisciple(dto: SyncDescipleDto): Promise<any> {
    this.logging.log('============== SYNC DISCIPLES =============');
    this.logging.log({dto});

    try {
      const response = await this.axiosInstance.post('/app/f?id=55', {
        _csrf: this.configService.get<string>('GKKD_SERVICE_CSRF'),
        date_1: dto.tanggal,
        "selectlist_7": dto.wilayah,
        "selectlist_4": dto.pelayanan,
        "selectlist_1": dto.nama_pembimbing,
        "selectlist_5": dto.nama_anak_pa,
        "selectlist_3": dto.buku_pa,
        "text_2": dto.lain_lain,
        "selectlist_6": dto.bab,
        "button_1": null,
        "_email": null,
      });
      this.logging.log('============== RESPONSE DISCIPLES =============');
      this.logging.log({response: response.data});

      return response.data;
    } catch (error) {
      this.logging.error(error);
      throw new Error(`Error fetching data: ${error.message}`);
    }
  }
}
