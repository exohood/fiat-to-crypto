let _isAdded: { [key: string]: boolean } = {};

/**
 * This function can be used to render a customized component that contains the combination of fields with a specific design.
 * Used to check if in the array of fields (allFields) is present a given combination of fields and if so, registers when it's added so the nexts iterations are not added twice
 * Returns true
 * @param currentField name of the field is being checked
 * @param fields2Check array of fields we are looking for
 * @param allFields array of fields all fields that should be rendered
 */
export const isGroupRequired = (
  currentField: string,
  fields2Check: string[],
  allFields: string[]
) => {
  // checks if this check corresponds to this case or should be skipped
  if (!fields2Check.find((field) => field === currentField)) return false;

  // checks if all fields from fields2Check are requested
  for (const index in fields2Check) {
    if (!allFields.some((f) => f === fields2Check[index])) {
      return false;
    }
  }

  // generating the key to identify the different combination of fields
  const fields2CheckKey = fields2Check.sort().join(",");

  if (_isAdded[fields2CheckKey] === undefined) {
    _isAdded[fields2CheckKey] = false;
  } else if (_isAdded[fields2CheckKey] === false) {
    _isAdded[fields2CheckKey] = true;
  }

  return true;
};

export const isGroupAdded = (fields2Check: string[]) => {
  return _isAdded[fields2Check.sort().join(",")];
};

export const initGroups = () => {
  _isAdded = {};
};
