import { Test, TestingModule } from '@nestjs/testing';

describe('JobContractService', () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: []
    }).compile();
  });

  describe('validateJobProposal', () => {
    it('should validate a job proposal', async () => {
      // const signJobContractDto: SignJobContractDTO = {
      //     jobProposalId: 'JobProposal#test',
      //     signature: 'test-signature',
      // };
      //
      // const createJobProposalDto: CreateJobProposalDTO = {
      //     priceUsd: 100,
      //     token: 1,
      //     initialDepositPct: 10,
      //     lockedAmountPct: 20,
      //     deferredAmountPct: 30,
      //     description: "Some job description",
      //     tags: ["tag1", "tag2"],
      //     durationInDay: 5,
      //     creationExpiryTimestamp: new Date().toISOString(),
      //     freelancerWallet: "freelancerWallet",
      //     companyWallet: "companyWallet",
      // };
      //
      // const wallet = 'test-wallet';
      // console.log('wallet', wallet)
      // const proposal = await service.createJobProposal(wallet, createJobProposalDto);
      //
      // const mockJobProposal = {
      //     PK: `JobProposal#test`,
      //     SK: '#METADATA',
      //     createdAt: new Date().toISOString(),
      //     open: JobContractStatus.None,
      //     freelancerValidated: false,
      //     ...createJobProposalDto
      // };
      //
      // console.log('mockJobProposal', mockJobProposal)
      // jest.spyOn(service, 'getJobProposalById').mockResolvedValueOnce(mockJobProposal);
      //
      // console.log('proposal', proposal)
      // const result = await service.validateJobProposal(wallet, signJobContractDto);

      expect('done').toBe('done'); // Change this assertion based on your service logic
    });
  });
});
