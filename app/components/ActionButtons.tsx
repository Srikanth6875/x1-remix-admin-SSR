// import { Form } from "react-router";
// import type { Reseller } from "~/services/ResellerAppService.server";

// type Props = {
//   reseller: Reseller;
//   onEdit: () => void;
// };

// export const ActionButtons = ({ reseller, onEdit }: Props) => {
//   return (
//     <div className="flex gap-2">
//       <button type="button" onClick={onEdit}
//         className="px-2 py-1 bg-blue-400 text-white rounded hover:bg-blue-500">
//         Edit
//       </button>

//       <Form method="post">
//         <input type="hidden" name="_method" value="delete" />
//         <input type="hidden" name="id" value={reseller.id} />
//         <button type="submit"
//           className="px-2 py-1 bg-red-400 text-white rounded hover:bg-red-500"
//           onClick={(e) => !confirm("Are you sure?") && e.preventDefault()}>
//           Delete
//         </button>
//       </Form>
//     </div>
//   );
// };


import { Form } from "react-router";
import type { Reseller } from "~/services/ResellerAppService.server";

export const ActionButtons = ({ reseller, onEdit }: { reseller: Reseller; onEdit: () => void }) => {
  return (
    <div className="flex gap-2">
      <button
        onClick={onEdit}
        className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Edit
      </button>

      <Form
        method="post"
        onSubmit={(e) => {
          if (!confirm("Delete this reseller permanently?")) {
            e.preventDefault();
            return false;
          }
        }}
      >
        <input type="hidden" name="app_type" value="RESELLER" />
        <input type="hidden" name="run_type" value="DELETE_RESELLER" />
        <input type="hidden" name="id" value={reseller.id} />
        
        <button
          type="submit"
          className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete
        </button>
      </Form>
    </div>
  );
};