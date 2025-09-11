export default function DateSelect({value,onChange}) {

  return (
    <div className="relative">
            <label
              htmlFor="date"
              className="text-sm font-medium text-gray-700 mb-2"
            >
              Select Date
            </label>
            <input
              type="date"
              value={value ? value.split('T')[0] : ''}
              onChange={onChange}
              className="w-full px-4 py-1 text-gray-700 border border-gray-300 
                       rounded-xl shadow-sm focus:outline-none focus:ring-2 
                       focus:ring-blue-500 focus:border-blue-500 transition 
                       duration-200 cursor-pointer mb-5 bg-blue-200"
            />
          </div>
  );
}
