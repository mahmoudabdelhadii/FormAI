const mongoose = require("mongoose");
const {
  encryptField,
  decryptField,
  decryptData,
} = require("../utils/encryption");


import { z } from 'zod';

// Schema for Log
const LogSchema = z.object({
  id: z.number().int(),
  email: z.string().optional(),
  context: z.string().optional(),
  message: z.string().optional(),
  type: z.string().optional(),
  level: z.string().optional(),
  timestamp: z.date().optional(),
});


export { LogSchema };

type Log = z.infer<typeof LogSchema>;