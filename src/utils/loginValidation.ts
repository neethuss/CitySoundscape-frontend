const validateUsername = (username: string) => {
  if (!username) {
    return "Username is required";
  }

  if (username.length < 4) {
    return "Username must be at least 4 characters long";
  }

  const usernamePattern = /^[a-z]+$/;
  if (!usernamePattern.test(username)) {
    return "Username must contain only lowercase letters";
  }

  return "";
};

const validatePassword = (password: string) => {
  if (!password) {
    return "Password is required";
  }

  if (password.length < 6) {
    return "Password must be at least 6 characters long";
  }

  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/;
  if (!passwordPattern.test(password)) {
    return "Password must contain both letters and numbers";
  }

  return "";
};

export const validateLoginForm = (
  username: string,
  password: string
) => {
  const isAnyFieldEmpty = !username || !password;

  if (isAnyFieldEmpty) {
    return {
      errors: { username: "", password: "" },
      isValid: false,
      isAnyFieldEmpty,
    };
  }

  const errors = {
    username: validateUsername(username),
    password: validatePassword(password),
  };

  const isValid = !errors.username && !errors.password;
  return { errors, isValid, isAnyFieldEmpty };
};
