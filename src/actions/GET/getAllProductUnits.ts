"use server";

export default async function getAllProductUnits() {
  const baseUrl = process.env.BASE_URL?.trim() || "http://localhost:3000"; // Default to localhost if undefined

  const res = await fetch(new URL(`${baseUrl}/api/product/unit`), {
    method: "GET",
    next: {
      tags: ["productUnits"],
      revalidate: 10000,
    },
  });
  const { units } = await res.json();
  return units;
}
