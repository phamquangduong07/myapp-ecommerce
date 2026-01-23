import { IsString, IsNotEmpty, IsPhoneNumber, IsDate } from 'class-validator';

export class RegisterDTO {
  @IsPhoneNumber('VN')
  phone_number: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  retype_password: string;

  @IsString()
  fullname: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  isAccepted: boolean;

  @IsDate()
  date_of_birth: Date;
  facebook_account_id: number;
  google_account_id: number;
  role_id: number;

  constructor(data: any) {
    this.phone_number = data.phone_number;
    this.password = data.password;
    this.retype_password = data.retype_password;
    this.fullname = data.fullname;
    this.address = data.address;
    this.isAccepted = data.isAccepted;
    this.date_of_birth = data.date_of_birth;
    this.facebook_account_id = data.facebook_account_id;
    this.google_account_id = data.google_account_id;
    this.role_id = data.role_id;
  }
}
