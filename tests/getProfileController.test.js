const { getProfileDataController } = require('../src/controllers/getProfile');

describe('getProfileDataController', () => {
  const createResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  it('returns 200 and removes password from the user profile', async () => {
    const user = {
      _id: 'user-id',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'secret',
      toObject: function () {
        return { ...this };
      },
    };

    const req = { user };
    const res = createResponse();

    await getProfileDataController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'User profile data fetched successfully',
      data: expect.objectContaining({
        _id: 'user-id',
        firstName: 'John',
        email: 'john@example.com',
      }),
    });
    expect(res.json.mock.calls[0][0].data).not.toHaveProperty('password');
  });
});
