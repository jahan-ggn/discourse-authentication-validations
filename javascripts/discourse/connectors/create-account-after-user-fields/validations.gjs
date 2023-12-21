import Component from "@glimmer/component";
import setupUserFieldValidation from "../../helpers/setup-user-field-validation";
import { inject as service } from "@ember/service";
import { hash } from "@ember/helper";

export default class Validations extends Component {
  @service userFieldValidations;

  constructor() {
    super(...arguments);

    this.args.outletArgs.userFields[0].field.setProperties({
      hasCustomValidation: true,
      showValues: ["show1", "show2"],
      hideValues: [""],
      targetClasses: [
        "user-field-high-school-graduation-year",
        "user-field-high-school",
      ],
    });

    this.userFieldValidations.totalCustomValidationFields =
      this.args.outletArgs.userFields.filterBy(
        "field.hasCustomValidation"
      ).length;
  }

  <template>
    {{#each @outletArgs.userFields as |field|}}
      {{#if field.field.hasCustomValidation}}
        {{setupUserFieldValidation (hash field=field.field value=field.value)}}
      {{/if}}
    {{/each}}
  </template>
}
