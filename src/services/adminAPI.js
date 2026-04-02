export const createUser = async (userData) => {
  try {
    const response = await fetch('http://localhost:8089/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create user');
    return data;
  } catch (error) {
    console.error('Create User Error:', error);
    throw error;
  }
};

export const updateUser = async (userId, updatedData) => {
  try {
    const response = await fetch(`http://localhost:8089/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update user');
    return data;
  } catch (error) {
    console.error('Update User Error:', error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await fetch(`http://localhost:8089/api/users/${userId}`, {
      method: 'DELETE',
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to delete user');
    return data;
  } catch (error) {
    console.error('Delete User Error:', error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await fetch('http://localhost:8089/api/users');

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch users');
    return data;
  } catch (error) {
    console.error('Get All Users Error:', error);
    throw error;
  }
};

export const resetLeaveBalances = async () => {
  try {
    const response = await fetch('http://localhost:8089/api/users/reset-leaves', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to reset leave balances');
    }

    return data;
  } catch (error) {
    throw new Error(error.message || 'Network error');
  }
};
