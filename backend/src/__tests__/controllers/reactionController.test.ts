import { Request, Response } from 'express';
import reactionController from '../../controllers/reactionController';
import ReactionService from '../../services/reactionService';
import { sendResponse } from '../../utils/response';

jest.mock('../../services/reactionService');
jest.mock('../../utils/response');

describe('Reaction Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockReactionService: jest.Mocked<ReactionService>;

  beforeEach(() => {
    mockRequest = { body: {} };
    mockResponse = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    mockReactionService = new ReactionService() as jest.Mocked<ReactionService>;
    (ReactionService as jest.Mock).mockImplementation(() => mockReactionService);
  });

  it('should handle addOrRemoveReaction', async () => {
    await reactionController.addOrRemoveReaction(mockRequest as Request, mockResponse as Response);
    expect(sendResponse).toHaveBeenCalled();
  });

  it('should handle errors in addOrRemoveReaction', async () => {
    mockReactionService.addOrRemoveReaction.mockRejectedValue(new Error('Test error'));
    await reactionController.addOrRemoveReaction(mockRequest as Request, mockResponse as Response);
    expect(sendResponse).toHaveBeenCalled();
  });
});