interface CardProps {
  emoji: string;
  title: string;
  description: string;
}

export default function StampExpressionCard({ emoji, title, description }: CardProps) {
  return (
    <div className="bg-gray-50 p-8 rounded-xl shadow-md transition-transform transform hover:scale-105 duration-300 border border-gray-100">
      <div className="text-5xl mb-6">{emoji}</div>
      <h3 className="text-2xl text-gray-700 font-semibold mb-4">{title}</h3>
      <p className="text-gray-700">{description}</p>
    </div>
  );
}
