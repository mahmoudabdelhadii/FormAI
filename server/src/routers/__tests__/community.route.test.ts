import request from 'supertest';
import express from 'express';
import router from '../community.route';
import { getCommunity, getCommunities } from '../../controllers/community.controller';
import { getCommunityModerators, addModerator } from '../../controllers/admin.controller';

// Mock the controller functions
jest.mock('../../controllers/community.controller', () => ({
  getCommunity: jest.fn((req, res) => res.status(200).json({ id: req.params.communityId, name: 'Test Community' })),
  getCommunities: jest.fn((req, res) => res.status(200).json([{ id: '1', name: 'Test Community 1' }, { id: '2', name: 'Test Community 2' }])),
}));

jest.mock('../../controllers/admin.controller', () => ({
  getCommunityModerators: jest.fn((req, res) => res.status(200).json([{ id: '1', name: 'Moderator 1' }, { id: '2', name: 'Moderator 2' }])),
  addModerator: jest.fn((req, res) => res.status(200).json({ id: req.body.communityId, name: 'Updated Community', moderators: [{ id: req.body.userId, name: 'New Moderator' }] })),
}));

const app = express();
app.use(express.json()); // For parsing application/json
app.use('/community', router);

describe('Community Routes', () => {
  it('should return a list of communities for /communities', async () => {
    const response = await request(app).get('/community/communities');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: '1', name: 'Test Community 1' }, { id: '2', name: 'Test Community 2' }]);
  });

  it('should return a specific community for /:communityId', async () => {
    const response = await request(app).get('/community/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: '1', name: 'Test Community' });
  });

  it('should return a list of moderators for /moderators/:communityId', async () => {
    const response = await request(app).get('/community/moderators/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: '1', name: 'Moderator 1' }, { id: '2', name: 'Moderator 2' }]);
  });

  it('should add a moderator for /add-moderators', async () => {
    const response = await request(app)
      .patch('/community/add-moderators')
      .send({ communityId: '1', userId: '3' });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: '1', name: 'Updated Community', moderators: [{ id: '3', name: 'New Moderator' }] });
  });
});
