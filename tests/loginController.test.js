const mockFindOne = jest.fn();

jest.mock('../src/models/user', () => ({
  findOne: mockFindOne,
}));

const { loginController } = require('../src/controllers/login');

describe('loginController', () => {
  const createResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.cookie = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 400 when email or password is missing', async () => {
    const req = { body: { email: 'john@example.com' } };
    const res = createResponse();

    await loginController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Email and password are required' });
  });

  it('returns 400 when the user is not found', async () => {
    mockFindOne.mockResolvedValue(null);
    const req = { body: { email: 'john@example.com', password: 'StrongPass1!' } };
    const res = createResponse();

    await loginController(req, res);

    expect(mockFindOne).toHaveBeenCalledWith({ email: 'john@example.com' });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
  });

  it('returns 400 when the password is invalid', async () => {
    const existingUser = { isPasswordValid: jest.fn().mockResolvedValue(false) };
    mockFindOne.mockResolvedValue(existingUser);

    const req = { body: { email: 'john@example.com', password: 'WrongPass1!' } };
    const res = createResponse();

    await loginController(req, res);

    expect(existingUser.isPasswordValid).toHaveBeenCalledWith('WrongPass1!');
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
  });

  it('returns 200 and sets cookie when login is successful', async () => {
    const existingUser = {
      _id: 'user-id',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      roles: 'user',
      isPasswordValid: jest.fn().mockResolvedValue(true),
      getJWT: jest.fn().mockResolvedValue('jwt-token'),
    };
    mockFindOne.mockResolvedValue(existingUser);

    const req = { body: { email: 'john@example.com', password: 'StrongPass1!' } };
    const res = createResponse();

    await loginController(req, res);

    expect(existingUser.isPasswordValid).toHaveBeenCalledWith('StrongPass1!');
    expect(existingUser.getJWT).toHaveBeenCalled();
    expect(res.cookie).toHaveBeenCalledWith('token', 'jwt-token', expect.objectContaining({ httpOnly: true }));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'User logged in successfully',
      data: {
        id: 'user-id',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        roles: 'user',
      },
    });
  });
});
