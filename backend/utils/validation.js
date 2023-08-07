const { validationResult } = require('express-validator');

const handleValidationErrors = (req, _res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        const errors = validationErrors.array().map((error) => `${error.msg}`);

        const err = new Error('Bad request.');
        err.status = 400;
        err.title = 'Bad request.';
        err.errors = errors;
        return _res.status(400).json({
            title: 'Bad request',
            errors: errors,
        });
    }
    next();
};

module.exports = {
    handleValidationErrors,
};
