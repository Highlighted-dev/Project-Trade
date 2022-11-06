const doesPasswordMatch = (password: string, confirm_passowrd: string) => {
  // If password and confirm password are equal
  if (password === confirm_passowrd) return true;
  return false;
};

const doesPasswordHaveCapitalLetter = (password: string) => {
  // Check if there is any uppercase letter in password. If there is not, return error
  if (/[A-Z]/.test(password)) return true;
  return false;
};

const doesPasswordHaveNumber = (password: string) => {
  // Check if there is any number in password. If there is not, return error
  if (/[1-9]/.test(password)) return true;
  return false;
};
const isEmailValid = (email: string) => {
  // Regular Expression validating email with rfc822 standard. If email is not valid, return error. Examples:
  // asdkladlkaslkaslk  /Not valid
  // test.com  /Not valid
  // test@test  /Not valid
  // test@test.com   /Valid
  if (
    // eslint-disable-next-line no-control-regex
    /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*(\.\w{2,})+$/.test(
      email,
    )
  )
    return true;
  return false;
};
const isBirthDateValid = (correct_birth_date: Date, user_birth_date: Date) => {
  if (user_birth_date > correct_birth_date) return true;
  return false;
};
export {
  doesPasswordMatch,
  doesPasswordHaveCapitalLetter,
  doesPasswordHaveNumber,
  isEmailValid,
  isBirthDateValid,
};
