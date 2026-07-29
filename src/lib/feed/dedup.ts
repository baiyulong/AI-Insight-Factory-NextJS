import { prisma } from "@/lib/db";

export async function isDuplicate(link: string, title: string): Promise<boolean> {
  const existing = await prisma.article.findFirst({
    where: {
      OR: [{ link }, { title }],
    },
    select: { id: true },
  });
  return existing !== null;
}
