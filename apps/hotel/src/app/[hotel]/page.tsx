import { redirect } from "next/navigation";

export default async function HotelIndex({ params }: { params: Promise<{ hotel: string }> }) {
  const { hotel } = await params;
  redirect(`/${hotel}/dashboard`);
}
