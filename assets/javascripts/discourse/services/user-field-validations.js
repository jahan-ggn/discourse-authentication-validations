import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { next } from "@ember/runloop";
import Service from "@ember/service";
import { TrackedObject } from "@ember-compat/tracked-built-ins";

export default class UserFieldValidations extends Service {
  @tracked totalCustomValidationFields = 0;
  currentCustomValidationFieldCount = 0;
  @tracked _userFieldValidationsMap = new TrackedObject();

  @action
  setValidation(field, value) {
    this._userFieldValidationsMap[field.id] = field;
    this._bumpTotalCustomValidationFields();

    if (
      this.currentCustomValidationFieldCount ===
      this.totalCustomValidationFields
    ) {
      next(() =>
        this.crossCheckValidations(this._userFieldValidationsMap, value)
      );
    }
  }

  @action
  crossCheckValidations(userFieldValidationsMap, value) {
    for (const userField of Object.values(userFieldValidationsMap)) {
      const showValues = userField.show_values;
      const targetClasses = userField.target_classes;

      const shouldShow = showValues?.includes?.(value);
      const shouldHide = showValues.length && !showValues.includes(value);
      if (shouldShow || shouldHide) {
        this._updateTargets(targetClasses, shouldShow);
      }
    }
  }

  _updateTargets(targetClasses, shouldShow) {
    targetClasses.forEach((className) => {
      document.querySelector(`.${className}`).style.display = shouldShow
        ? "block"
        : "none";
    });
  }

  _bumpTotalCustomValidationFields() {
    if (
      this.totalCustomValidationFields !==
      this.currentCustomValidationFieldCount
    ) {
      this.currentCustomValidationFieldCount += 1;
    }
  }
}
