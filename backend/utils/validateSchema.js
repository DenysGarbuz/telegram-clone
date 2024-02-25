module.exports = async function validateSchema(schema, user) {
  try {
    await schema.validate(user);
    return null;
  } catch (error) {
    return error;
  }
}
