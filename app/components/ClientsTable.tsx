type ColumnDef = {
    key: string;
    label: string;
};
type Props = {
    initialData: any[];
    columns: ColumnDef[];
};

export const ClientsTable = ({ initialData, columns }: Props) => {
    return (
        <div className="p-4 bg-white rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-1">
                <h1 className="text-xl font-bold text-gray-800">Clients List</h1>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200">
                    <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
                        <tr>
                            {columns.map((col) => (
                                <th key={col.key}
                                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider border-b">
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {initialData.map((row) => (
                            <tr key={row.id}>
                                {columns.map((col) => (
                                    <td key={col.key} className="px-4 py-3 text-sm"> {(row as any)[col.key]} </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
