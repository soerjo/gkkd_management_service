import * as bcrypt from 'bcrypt';

export const encryptPassword = (password: string) => {
  const salt = bcrypt.genSaltSync(10);
  const encryptedPassword = bcrypt.hashSync(password, salt);

  return encryptedPassword;
};

export const validatePassword = (
  password: string,
  encryptedPassword: string,
) => {
  return bcrypt.compareSync(password, encryptedPassword);
};
