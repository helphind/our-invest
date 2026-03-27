import { generateMonthlyContributions } from "@/app/services/contribution.job.service";
import cron from "node-cron";


cron.schedule("0 0 1 * *", async () => {
  await generateMonthlyContributions();
});