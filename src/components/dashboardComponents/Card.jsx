
export default function Card({ icon, title, number }) {
  return (
    <div className="bg-white p-3 w-full rounded-2xl h-[180px] relative">
      <div className="absolute rounded-full bg-blue-300 w-[35px] h-[35px] p-2 flex items-center justify-center">{icon}</div>
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-gray-400 text-sm">{title}</p>
        <p className="text-2xl">{number}</p>
      </div>
    </div>
  );
}
