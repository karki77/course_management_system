import { IRegisterSchema } from './validation';

export interface IUserService {
  register(data: IRegisterSchema): Promise<IRegisterSchema>;
}
