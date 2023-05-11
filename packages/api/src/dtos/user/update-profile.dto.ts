import { UpdateFreelanceProfileDTO } from './update-freelance.dto';
import { UpdateEmployerProfileDTO } from './update-employer.dto';
import { UserDTO } from './user.dto';
import {UserTypeEnum} from "../../../../utils/src/index";

export class UpdateProfileDTO extends UserDTO {
  currentUserType: UserTypeEnum;
  freelanceProfile?: UpdateFreelanceProfileDTO;
  employerProfile?: UpdateEmployerProfileDTO;
}
