import Service from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { TrackedObject } from "@ember-compat/tracked-built-ins";
import { action } from "@ember/object";

export default class UserFieldValidations extends Service {
  @tracked _userFieldValidationsMap = new TrackedObject();
  @tracked totalCustomValidationFields = 0;
  currentCustomValidationFieldCount = 0;

  @action
  setValidation(field, value) {
    this._userFieldValidationsMap[field.id] = field;
    this._bumpTotalCustomValidationFields();

    if (
      this.currentCustomValidationFieldCount ===
      this.totalCustomValidationFields
    ) {
      this.crossCheckValidations(this._userFieldValidationsMap, value);
    }
  }

  _bumpTotalCustomValidationFields() {
    if (
      this.totalCustomValidationFields !==
      this.currentCustomValidationFieldCount
    ) {
      this.currentCustomValidationFieldCount += 1;
    }
  }

  @action
  crossCheckValidations(userFieldValidationsMap, value) {
    for (const property in userFieldValidationsMap) {
      const userField = userFieldValidationsMap[property];
      if (userField.showValues.length && userField.showValues.includes(value)) {
        console.log("showing");
        document.querySelectorAll(userField.showValues.join(", "));
      }
    }
  }
}
