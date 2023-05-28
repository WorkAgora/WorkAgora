import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { CompanyKey, CreateCompany } from '@workagora/utils';
import { CreateCompanyDTO } from '../../dtos/company/create-company.dto';
import { v4 as uuidv4 } from 'uuid';
import { DeleteCompanyDTO } from '../../dtos/company/delete-company.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel('Company')
    private readonly model: Model<CreateCompany, CompanyKey>
  ) {}

  /**
   * Create a new company
   * @param wallet The employer's wallet
   * @param createCompanyDto The company metadata
   * @returns The company metadata
   * @throws UnprocessableEntityException
   */
  async createCompany(wallet: string, createCompanyDto: CreateCompanyDTO): Promise<CreateCompany> {
    try {
      const company: CreateCompany = {
        uuid: uuidv4(),
        companyWallet: wallet,
        createdAt: new Date().toISOString(),
        ...createCompanyDto
      };

      return await this.model.create(company);
    } catch (error) {
      throw new UnprocessableEntityException('createCompany: ' + error.message);
    }
  }

  /**
   * Get a company by its uuid
   * @param uuid The company uuid
   * @returns The company metadata
   * @throws UnprocessableEntityException
   * @throws NotFoundException
   */
  async getCompany(uuid: string): Promise<CreateCompanyDTO> {
    try {
      const company = await this.model.query('uuid').eq(uuid).exec();
      return company[0];
    } catch (error) {
      throw new UnprocessableEntityException('getCompany: ' + error.message);
    }
  }

  /**
   * Get all companies created by the current user
   * @param wallet The employer's wallet
   * @returns The company metadata
   * @throws UnprocessableEntityException
   */
  async getMyCompanies(wallet: string): Promise<CreateCompanyDTO[]> {
    try {
      const companies = await this.model.scan({ companyWallet: { eq: wallet } }).exec();
      if (!companies) {
        return [];
      }
      return companies;
    } catch (error) {
      throw new UnprocessableEntityException('getMyCompanies: ' + error.message);
    }
  }

  /**
   * Delete a company by its uuid
   * @param wallet The employer's wallet
   * @param deleteCompanyDTO
   * @returns The company metadata
   */
  async deleteCompany(
    wallet: string,
    deleteCompanyDTO: DeleteCompanyDTO
  ): Promise<{
    deleted: boolean;
    message: string;
  }> {
    try {
      // Delete the job
      await this.model.delete({ uuid: deleteCompanyDTO.uuid, companyWallet: wallet });

      // Log the reason for deletion if provided
      if (deleteCompanyDTO.reason) {
        console.log(
          `Company ${deleteCompanyDTO.uuid} deleted by ${wallet} with reason: ${deleteCompanyDTO.reason}`
        );
      }

      return { message: 'Company deleted successfully', deleted: true };
    } catch (error) {
      throw new UnprocessableEntityException('Error while deleting the job', error.message);
    }
  }

  /**
   * Update a company by its uuid
   * @param wallet The employer's wallet
   * @param companyUuid
   * @param updateCompanyDto The company metadata
   * @returns The company metadata
   * @throws UnprocessableEntityException
   */
  async updateCompany(
    wallet: string,
    companyUuid: string,
    updateCompanyDto: CreateCompanyDTO
  ): Promise<CreateCompany> {
    try {
      // Check if the company exists
      const company = await this.model.query('uuid').eq(companyUuid).exec();
      if (!company) {
        throw new Error('Company not found');
      }

      return await this.model.update(
        { uuid: companyUuid, companyWallet: wallet },
        {
          ...updateCompanyDto
        }
      );
    } catch (error) {
      throw new UnprocessableEntityException('updateCompany: ' + error.message);
    }
  }
}
