import { default as config } from '../../../config/index';
import * as inputVal from '../../../config/settings/inputvalidation.settings';
import * as bcrypt from 'bcrypt';

declare function escape(s: string): string;

export class InputValidator {

    /**
   * check if a req is not null or undefined
   * @param string - String  - the string to check
   * @return       - boolean
   */
    public static checkNulls(string: string) {
        return string == null || string == undefined || string == '' ? false : true;
    }

    /**
     * validate if the fields of the request have the required regex pattern or the required lenght
     * @param  fields - Array   - the object with the fields to check
     * @param  valSettings - JSON    - the configs to follow
     * @return        - boolean
     */
    public static validateFormField(fields, valSettings) {
        let validateField: boolean = true;
        if (valSettings.hasOwnProperty('validate')) {
            fields.forEach(field => {
                if (!valSettings.exclude.includes(field.key)) {
                    if (valSettings.validate.hasOwnProperty(field.key)) {
                        let regexField = new RegExp(valSettings.validate[field.key].match);
                        if (valSettings.validate[field.key].type === 'regex') {
                            if (!regexField.test(field.value.toString())) {
                                validateField = false;
                            }
                        } else {
                            if (valSettings.validate[field.key].type === 'lenght') {
                                if (field.value.length < valSettings.validate[field.key].min || field.value.length > valSettings.validate[field.key].max) {
                                    validateField = false;
                                }
                            }
                        }
                    }
                }
            })
            return validateField;
        } else {
            return validateField;
        }
    }

    /**
     * function to create the object with the fields of the request
     * @param  req  - express.request - request object from express
     * @return      - fields          - the object with the keys and values ex: [{"key: x", "value: y"}]
     */
    public static inputFields(req) {
        const fields = [];
        if (Object.keys(req.body).length) {
            for (let field in req.body) {
                fields.push({
                    key: field,
                    value: req.body[field]
                })
            }
            return fields;
        }
        if (Object.keys(req.params).length) {
            for (let field in req.params) {
                fields.push({
                    key: field,
                    value: req.params[field]
                })
            }
            return fields;
        }
        return fields;
    }

    /**
     * function to check if the required fields of the config file are in the request
     * @param  fields - Array   - the object with the fields to check
     * @param  valSettings - JSON    - the configs to follow
     * @return        - boolean
     */
    public static isRequired(fields, valSettings) {
        const reqFields = [];
        let required: boolean = true;
        if (valSettings.hasOwnProperty('required')) {
            if (valSettings.required.length > 1) {
                if (valSettings.required != []) {
                    fields.forEach((fieldKey: any) => {
                        reqFields.push(fieldKey.key);
                    })
                    valSettings.required.forEach(requiredField => {
                        if (reqFields.indexOf(requiredField) == -1) {
                            required = false;
                        }
                    })
                    return required
                } else {
                    return required
                }
            } else {
                if (valSettings.required != []) {
                    fields.forEach((fieldKey: any) => {
                        reqFields.push(fieldKey.key);
                    })
                    if (reqFields.indexOf(valSettings.required[0]) == -1) {
                        required = false;
                    }
                    return required
                } else {
                    return required
                }
            }
        } else {
            return required
        }
    }

    /**
     * function to check if the required fields of the config file are not null or undefined
     * @param  fields - Array   - the object with the fields to check
     * @param  valSettings - JSON    - the configs to follow
     * @return        - boolean
     */
    public static isValid(fields, valSettings) {
        let notNull: boolean = true;
        if (valSettings.hasOwnProperty('required')) {
            fields.forEach(field => {
                valSettings.required.forEach(requiredField => {
                    if (field.key === requiredField) {
                        if (!valSettings.exclude.includes(field.key)) {
                            if (!this.checkNulls(field.value)) {
                                notNull = false;
                            }
                        }
                    }
                })
            })
            return notNull;
        }
        else {
            return notNull;
        }
    }

    /**
     * function that will saniteze the fields of the object fields to avoid injections in the database
     * @param  fields - Array - the object with the fields to check
     * @return                - the object with sanitezed data
     */
    public static sanitizeFields(fields) {
        const sanitezedFields = [];
        for (let field of fields) {
            let sanitizedField = escape(field.value);
            sanitezedFields.push({
                key: field.key,
                value: sanitizedField
            });
        }
        return sanitezedFields;
    }

}
