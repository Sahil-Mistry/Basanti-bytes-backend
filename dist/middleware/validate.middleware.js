"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
const response_1 = require("../utils/response");
function validate(schema, part = 'body') {
    return (req, res, next) => {
        const result = schema.safeParse(req[part]);
        if (!result.success) {
            const message = result.error.errors
                .map((e) => `${e.path.join('.')}: ${e.message}`)
                .join(', ');
            (0, response_1.sendError)(res, message, 422);
            return;
        }
        req[part] = result.data;
        next();
    };
}
//# sourceMappingURL=validate.middleware.js.map