export enum ComplexityCheckErrorCode {
  PASSWORD_TOO_SHORT,
  PASSWORD_NO_DIGIT,
  PASSWORD_NO_SPECIAL_CHARACTER,
}

interface ComplexityCheckResult {
  isPassed: boolean;
  error?: ComplexityCheckErrorCode[];
}

export const passwordComplexityCheck = (
  password: string,
): ComplexityCheckResult => {
  let lengthCheck = new RegExp(`(?=.{8,})`);
  let digitCheck = new RegExp(`(?=.*[0-9])`);
  let specialCharacterCheck = new RegExp(`([^A-Za-z0-9])`);

  if (
    lengthCheck.test(password) &&
    digitCheck.test(password) &&
    specialCharacterCheck.test(password)
  )
    return {isPassed: true};

  // if one or more of the checks failed
  const result: ComplexityCheckResult = {
    isPassed: false,
    error: [],
  };

  // check for length
  if (!lengthCheck.test(password)) {
    result.error?.push(ComplexityCheckErrorCode.PASSWORD_TOO_SHORT);
  }

  // check for digit
  if (!digitCheck.test(password)) {
    result.error?.push(ComplexityCheckErrorCode.PASSWORD_NO_DIGIT);
  }

  // check for special characters
  if (!specialCharacterCheck.test(password)) {
    result.error?.push(ComplexityCheckErrorCode.PASSWORD_NO_SPECIAL_CHARACTER);
  }

  return result;
};
