import Joi from 'joi';
import { LoginDTO } from '../../dtos/auth/login.dto';

export const LoginSchema = Joi.object<LoginDTO>({
  signature: Joi.string().required(),
  message: Joi.string().required()
});
