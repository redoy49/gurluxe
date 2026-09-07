export default function EmptyChartState({ message }) {
  return (
    <div className="flex h-full min-h-50 items-center justify-center rounded-lg border border-dashed border-gray-200 text-sm text-gray-400">
      {message}
    </div>
  );
}
