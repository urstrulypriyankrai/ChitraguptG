export default function Loading() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 w-40 bg-gray-200 animate-pulse rounded"></div>
        <div className="flex gap-2">
          <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-10 w-24 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-12 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-12 bg-gray-200 animate-pulse rounded"></div>
          </div>

          <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>

          <div className="h-64 bg-gray-200 animate-pulse rounded"></div>

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="h-12 w-40 bg-gray-200 animate-pulse rounded"></div>
            <div className="flex gap-2">
              <div className="h-10 w-24 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
