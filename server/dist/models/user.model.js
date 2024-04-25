"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const UserSchema = zod_1.z.object({
    id: zod_1.z.number().int(), // Automatically incremented, typically not provided in payload
    username: zod_1.z.string().trim().min(3, "Username must be at least 3 characters long").max(20, "Username must be no more than 20 characters long").refine(value => /^[a-zA-Z0-9]+$/.test(value), {
        message: "Username can only contain alphanumeric characters",
    }),
    firstName: zod_1.z.string().trim().min(1, "name must be at least 1 characters long"),
    lastName: zod_1.z.string().trim().min(1, "name must be at least 1 characters long"),
    email: zod_1.z.string().email("Invalid email"),
    password: zod_1.z.string().min(8), // You may want to enforce password policies here
    avatarUrl: zod_1.z.string().optional(),
    bio: zod_1.z.string().optional(),
    role: zod_1.z.number().int().optional(),
    createdAt: zod_1.z.date().optional(), // Defaults to current time when creating new records
    isEmailVerified: zod_1.z.boolean().default(false),
    height: zod_1.z.number().optional(),
    weight: zod_1.z.number().optional(),
    age: zod_1.z.number().int().optional(),
    CommunityRequest: zod_1.z.array(zod_1.z.any()).optional() // Assuming CommunityRequest is another schema you'd define
}).superRefine(({ password }, checkPassComplexity) => {
    const containsUppercase = (ch) => /[A-Z]/.test(ch);
    const containsLowercase = (ch) => /[a-z]/.test(ch);
    const containsSpecialChar = (ch) => /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch);
    let countOfUpperCase = 0, countOfLowerCase = 0, countOfNumbers = 0, countOfSpecialChar = 0;
    for (let i = 0; i < password.length; i++) {
        let ch = password.charAt(i);
        if (!isNaN(+ch))
            countOfNumbers++;
        else if (containsUppercase(ch))
            countOfUpperCase++;
        else if (containsLowercase(ch))
            countOfLowerCase++;
        else if (containsSpecialChar(ch))
            countOfSpecialChar++;
    }
    let errObj = {
        upperCase: { pass: true, message: "add upper case." },
        lowerCase: { pass: true, message: "add lower case." },
        specialCh: { pass: true, message: "add special ch." },
        totalNumber: { pass: true, message: "add number." },
    };
    if (countOfLowerCase < 1) {
        errObj = Object.assign(Object.assign({}, errObj), { lowerCase: Object.assign(Object.assign({}, errObj.lowerCase), { pass: false }) });
    }
    if (countOfNumbers < 1) {
        errObj = Object.assign(Object.assign({}, errObj), { totalNumber: Object.assign(Object.assign({}, errObj.totalNumber), { pass: false }) });
    }
    if (countOfUpperCase < 1) {
        errObj = Object.assign(Object.assign({}, errObj), { upperCase: Object.assign(Object.assign({}, errObj.upperCase), { pass: false }) });
    }
    if (countOfSpecialChar < 1) {
        errObj = Object.assign(Object.assign({}, errObj), { specialCh: Object.assign(Object.assign({}, errObj.specialCh), { pass: false }) });
    }
    if (countOfLowerCase < 1 ||
        countOfUpperCase < 1 ||
        countOfSpecialChar < 1 ||
        countOfNumbers < 1) {
        checkPassComplexity.addIssue({
            code: "custom",
            path: ["password"],
            message: JSON.stringify(errObj), // Convert errObj to a string
        });
    }
});
exports.default = UserSchema;
//# sourceMappingURL=user.model.js.map