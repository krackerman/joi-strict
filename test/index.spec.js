const expect = require('chai').expect;
const Joi = require('../src/index');

describe('Testing Strict Mode', () => {
  const validated = (schema, input, expectedErrorMessage = null) => {
    // todo: check validation error
    if (expectedErrorMessage === null) {
      expect(schema.validate(input).error).to.equal(null);
    } else {
      expect(schema.validate(input).error.message).to.equal(expectedErrorMessage);
    }
  };

  it('Testing string required by default', () => {
    validated(
      Joi.string(),
      undefined,
      '"value" is required'
    );
  });

  it('Testing unknown key not allowed by default', () => {
    validated(
      Joi.object().keys({}),
      { a: 'thing' },
      '"a" is not allowed'
    );
  });

  it('Testing key required by default', () => {
    validated(
      Joi.object().keys({ a: Joi.string() }),
      {},
      'child "a" fails because ["a" is required]'
    );
  });

  it('Testing deeply nested key required by default', () => {
    validated(
      Joi.object().keys({ a: Joi.object().keys({ b: Joi.string() }) }),
      { a: {} },
      'child "a" fails because [child "b" fails because ["b" is required]]'
    );
  });

  it('Testing deeply nested, explicitly optional key', () => {
    validated(
      Joi.object().keys({ a: Joi.object().keys({ b: Joi.string().optional() }) }),
      { a: {} }
    );
  });

  it('Testing unknown key explicitly allowed', () => {
    validated(
      Joi.object().keys({}).unknown(true),
      { a: 'thing' }
    );
  });
});
