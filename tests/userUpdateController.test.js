const mockFindByIdAndUpdate = jest.fn();
const mockPasswordHashing = jest.fn();

jest.mock('../src/models/user', () => ({
  findByIdAndUpdate: mockFindByIdAndUpdate,
  passwordHashing: mockPasswordHashing,
}));

const { updateController } = require('../src/controllers/userUpdate');

describe('updateController', () => {
  const createResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 400 when password update is weak', async () => {
    const req = {
      user: { _id: 'user-id' },
      body: { password: 'weakpass' },
    };
    const res = createResponse();

    await updateController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Password must be at least 10 characters long and include uppercase, lowercase, number, and special character.',
    });
  });

  it('returns 400 when the user is not found during update', async () => {
    mockFindByIdAndUpdate.mockReturnValue({ select: jest.fn().mockResolvedValue(null) });

    const req = {
      user: { _id: 'user-id' },
      body: { firstName: 'John' },
    };
    const res = createResponse();

    await updateController(req, res);

    expect(mockFindByIdAndUpdate).toHaveBeenCalledWith('user-id', { firstName: 'John' }, { returnDocument: 'after', runValidators: true });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'User update failed -User not found' });
  });

  it('updates the user and returns 200 when data is valid', async () => {
    const updatedUser = { _id: 'user-id', firstName: 'John', email: 'john@example.com' };
    const selectMock = jest.fn().mockResolvedValue(updatedUser);
    mockFindByIdAndUpdate.mockReturnValue({ select: selectMock });

    const req = {
      user: { _id: 'user-id' },
      body: { firstName: 'John' },
    };
    const res = createResponse();

    await updateController(req, res);

    expect(mockFindByIdAndUpdate).toHaveBeenCalledWith('user-id', { firstName: 'John' }, { returnDocument: 'after', runValidators: true });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
    });
  });

  it('hashes the password when password is included in update', async () => {
    mockPasswordHashing.mockResolvedValue('newHashedPassword');
    const updatedUser = { _id: 'user-id', firstName: 'John', email: 'john@example.com' };
    const selectMock = jest.fn().mockResolvedValue(updatedUser);
    mockFindByIdAndUpdate.mockReturnValue({ select: selectMock });

    const req = {
      user: { _id: 'user-id' },
      body: { password: 'StrongPass1!' },
    };
    const res = createResponse();

    await updateController(req, res);

    expect(mockPasswordHashing).toHaveBeenCalledWith('StrongPass1!');
    expect(mockFindByIdAndUpdate).toHaveBeenCalledWith('user-id', { password: 'newHashedPassword' }, { returnDocument: 'after', runValidators: true });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
    });
  });
});
