export const booleanToYesNoFormatter = (value: unknown) => {
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No'
  }
  return ''
}

export const validateChinese = (value: string) => {
  const reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g')
  return !reg.test(value) || 'This field does not support Chinese.'
}

export const validateStringLength = (rule: string, value: string, limitNum: number) => {
  if (!value || value?.length <= limitNum) {
    return Promise.resolve()
  }
  return Promise.reject(new Error(`The value length should not exceed ${limitNum} characters.`))
}
export const validateRequiredValue = (value: string) => {
  return value.length || 'Please type something'
}

export const validateRequiredSelect = (value: boolean) => {
  return !!value || 'Please select'
}

export const validateLetterNumber = (value: string) => {
  const reg = new RegExp('^[A-Za-z0-9]*$')
  return reg.test(value) || 'Must be letters or numbers.'
}

export const validateLowercaseLetterNumber = (value: string) => {
  const reg = new RegExp('^[a-z]+[a-z0-9]*$')
  return reg.test(value) || 'Must be lowercase letters and numbers,and start with a letter.'
}

export const validateLetterNumberWithDash = (value: string) => {
  const reg = new RegExp('^[a-z]([-a-z0-9]*[a-z0-9])?$')
  return reg.test(value) || 'Must be lowercase letters, numbers or -, and start with a letter, end with a letter or number.'
}

export const validateLetterNumberWithBlankUnderscoreCommaDot = (value: string) => {
  const reg = new RegExp('^[A-Za-z0-9 _,.]*$')
  return reg.test(value) || 'Must be letters, numbers, blank, underscore, comma and dot.'
}

export const validateLowercaseLetter = (value: string) => {
  const reg = new RegExp('^[A-Z][a-z]*$')
  return reg.test(value) || 'Must be letters and start with uppercase letter'
}

export const validateLetterWithDash = (value: string) => {
  const reg = new RegExp('^[a-z]([-a-z]*[a-z])?$')
  return (
    reg.test(value) ||
    'The first and last letter must be lowercase and have a lowercase letter and the content is a lowercase letter and -.'
  )
}

export const validateTextTypeWithLength = (value: string) => {
  const reg = new RegExp('^(?:(?![\u4e00-\u9fa5]).)*$')
  return reg.test(value) || 'Only English letters and numbers are allowed, and the length should not exceed 20 characters.'
}

export const validateEmail = (value: string) => {
  const reg = new RegExp(
    // eslint-disable-next-line
    /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i
  )
  return reg.test(value) || 'Please input an valid email(e.g. abc@mercedes-benz.com).'
}
