import "dotenv/config";

import { startNotificationWorker } from "./server/integrations/notification-worker";

startNotificationWorker();
