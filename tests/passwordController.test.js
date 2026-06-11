const mockFindById = jest.fn();
const mockPasswordHashing = jest.fn();

jest.mock('../src/models/user', () => ({
  findById: mockFindById,
  passwordHashing: mockPasswordHashing,
}));

const { changePasswordController } = require('../src/controllers/password');

describe('changePasswordController', () => {
  const createResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 400 if currentPassword or newPassword is missing', async () => {
    const req = { body: {}, user: { _id: 'user-id' } };
    const res = createResponse();

    await changePasswordController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Both currentPassword and newPassword are required' });
  });

  it('returns 400 when newPassword is weak', async () => {
    const req = {
      body: { currentPassword: 'OldPassword1!', newPassword: 'weakpass' },
      user: { _id: 'user-id' },
    };
    const res = createResponse();

    await changePasswordController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'New password must be at least 10 characters long and include uppercase, lowercase, number, and special character.',
    });
  });

  it('returns 404 when the user is not found', async () => {
    mockFindById.mockResolvedValue(null);
    const req = {
      body: { currentPassword: 'OldPassword1!', newPassword: 'StrongPass1!' },
      user: { _id: 'missing-user-id' },
    };
    const res = createResponse();

    await changePasswordController(req, res);

    expect(mockFindById).toHaveBeenCalledWith('missing-user-id');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Password change failed - User not found' });
  });

  it('returns 400 when current password is incorrect', async () => {
    const user = { isPasswordValid: jest.fn().mockResolvedValue(false) };
    mockFindById.mockResolvedValue(user);

    const req = {
      body: { currentPassword: 'WrongPassword1!', newPassword: 'StrongPass1!' },
      user: { _id: 'user-id' },
    };
    const res = createResponse();

    await changePasswordController(req, res);

    expect(user.isPasswordValid).toHaveBeenCalledWith('WrongPassword1!');
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Current password is incorrect' });
  });

  it('updates the password and returns success when input is valid', async () => {
    const user = {
      isPasswordValid: jest.fn().mockResolvedValue(true),
      save: jest.fn().mockResolvedValue(true),
    };
    mockFindById.mockResolvedValue(user);
    mockPasswordHashing.mockResolvedValue('hashedPassword');

    const req = {
      body: { currentPassword: 'OldPassword1!', newPassword: 'StrongPass1!' },
      user: { _id: 'user-id' },
    };
    const res = createResponse();

    await changePasswordController(req, res);

    expect(mockFindById).toHaveBeenCalledWith('user-id');
    expect(user.isPasswordValid).toHaveBeenCalledWith('OldPassword1!');
    expect(mockPasswordHashing).toHaveBeenCalledWith('StrongPass1!');
    expect(user.password).toBe('hashedPassword');
    expect(user.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Password changed successfully', data: undefined });
  });
});
