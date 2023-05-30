import { CreateCompany, JobKey, Visibility, WorkAvailability, WorkDuration } from '../../../../utils/src/index';

export interface CreateJobBackend extends JobKey {
  title: string;
  location: string;
  availability: WorkAvailability;
  duration: WorkDuration;
  jobMission: string;
  responsibilities: string;
  requirements: string;
  tags: string;
  visibility: Visibility;
  createdAt: string;
  companyUuid: string;
  company?: CreateCompany;
}
