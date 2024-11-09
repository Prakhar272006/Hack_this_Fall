import { getServerAuthSession } from "@/utils/auth";
import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

const handler = async (req: Request) => {
    if (req.method === "GET") {
        let session = await getServerAuthSession()
        if (!session) return new Response('Unauthorized', { status: 401 });

        let user = await prisma.user.findUnique({
            where: {
                id: session.user.id,
            },
            select: {
                email: true,
                id: true,
                image: true,
                name: true,
                username: true,
            }
        });

        if (!user) return new Response('User not found', { status: 404 });

        return new Response(JSON.stringify(user), { status: 200 });
    }

    if (req.method === "POST") {
        const session = await getServerAuthSession()
        if (!session) return new Response('Unauthorized', { status: 401 });

        let user = await prisma.user.findUnique({
            where: {
                id: session.user.id
            }
        });

        if (!user) return new Response('User not found', { status: 404 });

        const body: User = await req.json();

        let existingUser = await prisma.user.findFirst({
            where: {
                AND: [
                    { username: body.username },
                    {
                        NOT: {
                            id: session.user.id
                        }
                    }
                ]
            }
        });

        await prisma.user.update({
            where: {
                id: session.user.id
            },
            data: {
                email: body.email,
                image: body.image,
                name: body.name,
                username: body.username
            }
        });

        return new Response('User updated', { status: 200 });
    }
}

export { handler as GET, handler as POST }