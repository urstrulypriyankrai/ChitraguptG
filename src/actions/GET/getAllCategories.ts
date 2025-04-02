"use server";

export default async function getAllCategories() {
  const baseUrl = process.env.BASE_URL?.trim() || "http://localhost:3000"; // Default to localhost if undefined

  const res = await fetch(new URL(`${baseUrl}/api/product/category`), {
    method: "GET",
    next: {
      tags: ["getAllCategories"],
      revalidate: 10000,
    },
  });

  const { categories } = await res.json();
  return categories;
}
