

// Replace placeholders like {{name}}, {{discount}} in template string

exports.generateMessage = (template, customerData) => {
  return template.replace(/{{(\w+)}}/g, (_, key) => customerData[key] || '');
};