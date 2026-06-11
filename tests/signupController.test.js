const mockFindOne = jest.fn();
const mockPasswordHashing = jest.fn();
const mockSave = jest.fn();

jest.mock('../src/models/user', () => {
  const User = function (data) {
    Object.assign(this, data);
    this.save = mockSave;
    this.toObject = jest.fn(() => ({ ...this }));
  };

  User.findOne = mockFindOne;
  User.passwordHashing = mockPasswordHashing;

  return User;
});

const { signupController } = require('../src/controllers/signup');

describe('signupController', () => {
  const createResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a new user and returns 201 when signup data is valid', async () => {
    mockFindOne.mockResolvedValue(null);
    mockPasswordHashing.mockResolvedValue('hashedPassword');
    mockSave.mockResolvedValue(true);

    const req = {
      body: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'StrongPass1!',
        roles: 'user',
      },
    };
    const res = createResponse();

    await signupController(req, res);

    expect(mockFindOne).toHaveBeenCalledWith({ email: 'john@example.com' });
    expect(mockPasswordHashing).toHaveBeenCalledWith('StrongPass1!');
    expect(mockSave).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'User registered successfully',
      data: expect.objectContaining({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        roles: 'user',
      }),
    });
    expect(res.json.mock.calls[0][0].data).not.toHaveProperty('password');
  });

  it('returns 400 when email already exists', async () => {
    mockFindOne.mockResolvedValue({ email: 'john@example.com' });

    const req = {
      body: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'StrongPass1!',
      },
    };
    const res = createResponse();

    await signupController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Email already exists' });
  });
});
