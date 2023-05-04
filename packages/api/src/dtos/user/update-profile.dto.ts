import { UpdateFreelanceProfileDTO } from './update-freelance.dto';
import { UpdateEmployerProfileDTO } from './update-employer.dto';
import { UserDTO } from './user.dto';

export class UpdateProfileDTO extends UserDTO {
  currentUserType: 'freelance' | 'company';
  freelanceProfile?: UpdateFreelanceProfileDTO;
  employerProfile?: UpdateEmployerProfileDTO;
}
