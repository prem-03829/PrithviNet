export default function Table({ headers, data, renderRow }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="text-xs font-bold uppercase text-slate-500 border-b border-slate-200 dark:border-primary dark:border-opacity-10">
            {headers.map((header, idx) => (
              <th key={idx} className="px-6 py-4">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="text-sm divide-y divide-slate-100 dark:divide-primary dark:divide-opacity-5">
          {data.map((row, idx) => renderRow(row, idx))}
        </tbody>
      </table>
    </div>
  );
}
