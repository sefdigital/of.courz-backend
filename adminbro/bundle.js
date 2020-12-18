process.env.NODE_ENV = "production";

import AdminBro from "admin-bro";
import { AdminBroOptions } from "./config";

const admin = new AdminBro(AdminBroOptions);

admin.initialize();