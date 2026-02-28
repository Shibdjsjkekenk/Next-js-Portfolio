"use client";

export default function AIProjectCards({ cards }: any) {
    if (!cards?.length) return null;

    return (
        <div className="grid sm:grid-cols-2 gap-4 mt-3">
            {cards.map((card: any, i: number) => (
                <div
                    key={i}
                    className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
                >
                    <img
                        src={card.image}
                        className="w-full h-40 object-cover"
                        alt={card.title}
                    />

                    <div className="p-3">
                        <h3 className="font-semibold text-gray-800 text-sm line-clamp-2">
                            {card.title}
                        </h3>

                        <a
                            href={card.link}
                            target="_blank"
                            className="inline-block mt-2 text-sm bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700"
                        >
                            View Project 🚀
                        </a>
                    </div>
                </div>
            ))}
        </div>
    );
}