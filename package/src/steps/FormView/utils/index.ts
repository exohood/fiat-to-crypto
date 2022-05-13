import { isGroupAdded, isGroupRequired, initGroups } from "./groupFieldsCheck";

/**
 * Used to check if in an array of fields is present a given combination of fields and if so, registers it
 * @method initGroups Initialize the controller, should be called on every render
 * @method isGroupRequired Returns true if all elements of the required group are in the list of fields that should be rendered
 * @method isGroupAdded Returns false if is the first time the combination of fields is found
 */
const GroupFieldsController = {
  initGroups,
  isGroupRequired,
  isGroupAdded,
};

export { GroupFieldsController };
