/**
 * v0 by Vercel.
 * @see https://v0.dev/t/Oa0HAbRk2OG
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client"

export default function Component() {
  const hotelRooms = [
    {
      id: 1,
      image: "/placeholder.svg",
      type: "Standard Room",
      description: "Cozy and comfortable room with a queen-sized bed.",
    },
    {
      id: 2,
      image: "/placeholder.svg",
      type: "Deluxe Room",
      description: "Spacious room with a king-sized bed and city view.",
    },
    {
      id: 3,
      image: "/placeholder.svg",
      type: "Suite",
      description: "Luxurious suite with a separate living area and balcony.",
    },
    {
      id: 4,
      image: "/placeholder.svg",
      type: "Standard Room",
      description: "Affordable room with a full-sized bed and basic amenities.",
    },
    {
      id: 5,
      image: "/placeholder.svg",
      type: "Deluxe Room",
      description: "Elegant room with a king-sized bed and en-suite bathroom.",
    },
    {
      id: 6,
      image: "/placeholder.svg",
      type: "Suite",
      description: "Spacious suite with a separate bedroom, living area, and kitchen.",
    },
  ]
  return (
    <div className="flex flex-col h-screen">
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto py-8 px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotelRooms.map((room) => (
            <div key={room.id} className="bg-background rounded-lg shadow-lg overflow-hidden">
              <img
                src="/placeholder.svg"
                alt={room.type}
                width={400}
                height={300}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold">{room.type}</h3>
                <p className="text-muted-foreground">{room.description}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

function HotelIcon(props:any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 22v-6.57" />
      <path d="M12 11h.01" />
      <path d="M12 7h.01" />
      <path d="M14 15.43V22" />
      <path d="M15 16a5 5 0 0 0-6 0" />
      <path d="M16 11h.01" />
      <path d="M16 7h.01" />
      <path d="M8 11h.01" />
      <path d="M8 7h.01" />
      <rect x="4" y="2" width="16" height="20" rx="2" />
    </svg>
  )
}