// import { useState } from "react";
// import { ResellerModal } from "./ResellerModal";
// import { ActionButtons } from "./ActionButtons";
// import type { Reseller } from "~/services/ResellerAppService.server";

// // import {fs} from 'fs';

// export const ResellerTable = ({ initialData }: { initialData: Reseller[] }) => {
//   const [editingReseller, setEditingReseller] = useState<Reseller | null>(null);
//   const [modalOpen, setModalOpen] = useState(false);

//   const [page, setPage] = useState(1);
//   const pageSize = 15;
//   const totalPages = Math.ceil(initialData.length / pageSize);

//   const handleAddClick = () => {
//     setEditingReseller(null);
//     setModalOpen(true);
//   };

//   const handleEditClick = (reseller: Reseller) => {
//     setEditingReseller(reseller);
//     setModalOpen(true);
//   };

//   const paginatedData = initialData.slice(
//     (page - 1) * pageSize,
//     page * pageSize
//   );

//   const columns = ["id", "name", "email", "companyName", "resellerType", "status", "address", "actions",] as const;

//   const formatLabel = (key: string) => key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());

//   return (
//     <div className="p-4">
//       <div className="flex justify-between mb-4">
//         <h1 className="text-xl font-bold">Resellers</h1>

//         <button
//           onClick={handleAddClick}
//           className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600" >Add Reseller </button>
//       </div>

//       {modalOpen && (<ResellerModal reseller={editingReseller || undefined} onClose={() => setModalOpen(false)} />)}

//       <table className="reseller-table table-striped table-bordered w-full">
//         <thead>
//           <tr>
//             {columns.map((col) => (
//               <th key={col}>{formatLabel(col)}</th>
//             ))}
//           </tr>
//         </thead>

//         <tbody>
//           {paginatedData.map((r) => (
//             <tr key={r.id}>
//               {columns.map((col) => (
//                 <td key={col}>
//                   {col === "actions" ? (<ActionButtons reseller={r} onEdit={() => handleEditClick(r)} />) : ((r as any)[col])}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <div className="flex justify-between items-center mt-4">
//         <span className="text-sm text-gray-600"> Page {page} of {totalPages} </span>

//         <div className="flex gap-2">
//           <button
//             disabled={page === 1}
//             onClick={() => setPage((p) => p - 1)}
//             className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
//           >
//             Prev
//           </button>

//           <button
//             disabled={page === totalPages}
//             onClick={() => setPage((p) => p + 1)}
//             className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };



import { useState } from "react";
import { ResellerModal } from "./ResellerModal";
import { ActionButtons } from "./ActionButtons";
import type { Reseller } from "~/services/ResellerAppService.server";

export const ResellerTable = ({ initialData }: { initialData: Reseller[] }) => {
  const [editingReseller, setEditingReseller] = useState<Reseller | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleAdd = () => {
    setEditingReseller(null);
    setModalOpen(true);
  };

  const handleEdit = (reseller: Reseller) => {
    setEditingReseller(reseller);
    setModalOpen(true);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Resellers</h1>
        <button
          onClick={handleAdd}
          className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Add Reseller
        </button>
      </div>

      {modalOpen && (
        <ResellerModal
          reseller={editingReseller || undefined}
          onClose={() => setModalOpen(false)}
        />
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["ID", "Name", "Email", "Company", "Type", "Status", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {initialData.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-3 text-sm">{r.id}</td>
                <td className="px-4 py-3 text-sm font-medium">{r.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{r.email}</td>
                <td className="px-4 py-3 text-sm">{r.companyName || "-"}</td>
                <td className="px-4 py-3 text-sm">{r.resellerType}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-2 py-1 text-xs rounded-full ${r.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <ActionButtons reseller={r} onEdit={() => handleEdit(r)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};