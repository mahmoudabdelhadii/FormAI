const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

import { z } from 'zod';

const PendingPostSchema = z.object({
  id: z.number().int(),
  Content: z.string().optional(),
  fileUrl: z.string(),
  community: z.number().int(),
  user: z.string(),
  caption: z.string().optional(),
  status: z.number().int().optional(),
  confirmationToken: z.string().optional(),
});


export { PendingPostSchema };

type PendingPost = z.infer<typeof PendingPostSchema>;
