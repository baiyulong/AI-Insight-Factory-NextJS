import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/db", () => ({
  prisma: {
    article: {
      findFirst: vi.fn(),
    },
  },
}));

import { isDuplicate } from "@/lib/feed/dedup";
import { prisma } from "@/lib/db";

const mockFindFirst = vi.mocked(prisma.article.findFirst);

describe("isDuplicate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns true when link already exists", async () => {
    mockFindFirst.mockResolvedValue({ id: "1" } as never);
    const result = await isDuplicate("https://example.com/article", "Some Title");
    expect(result).toBe(true);
    expect(mockFindFirst).toHaveBeenCalledWith({
      where: {
        OR: [{ link: "https://example.com/article" }, { title: "Some Title" }],
      },
      select: { id: true },
    });
  });

  it("returns false when no duplicate found", async () => {
    mockFindFirst.mockResolvedValue(null);
    const result = await isDuplicate("https://new.com/article", "New Title");
    expect(result).toBe(false);
  });

  it("returns true when title matches even with different link", async () => {
    mockFindFirst.mockResolvedValue({ id: "2" } as never);
    const result = await isDuplicate("https://different.com", "Existing Title");
    expect(result).toBe(true);
  });
});
