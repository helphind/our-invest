import { generateMonthlyContributions } from "@/app/services/contribution.job.service";

export async function POST(req: Request) {
    const body = await req.json();
    const { month } = body;
    const result = await generateMonthlyContributions(month);
    return Response.json(result);
}
