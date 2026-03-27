import { prisma } from "@/lib/prisma";

/**
 * Method to mark multiple contribution as paid
 * @param req 
 * @returns 
 */
export async function POST(req: Request) {
    const { ids } = await req.json();

    if (!ids || ids.length === 0) {
        return Response.json({ error: "No IDs provided" }, { status: 400 });
    }

    const result = await prisma.contribution.updateMany({
        where: {
            id: { in: ids },
            status: "PENDING",
        },
        data: {
            status: "PAID",
        },
    });

    return Response.json({
        message: "Updated successfully",
        count: result.count,
    });
}
