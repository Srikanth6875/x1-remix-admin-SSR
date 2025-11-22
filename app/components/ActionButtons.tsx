import { Form } from "react-router";
import type { Reseller } from "~/services/ResellerAppService.server";

type Props = {
  reseller: Reseller;
  onEdit: () => void;
};

export const ActionButtons = ({ reseller, onEdit }: Props) => {
  return (
    <div className="flex gap-2">
      <button type="button" onClick={onEdit}
        className="px-2 py-1 bg-blue-400 text-white rounded hover:bg-blue-500">
        Edit
      </button>

      <Form method="post">
        <input type="hidden" name="_method" value="delete" />
        <input type="hidden" name="id" value={reseller.id} />
        <button type="submit"
          className="px-2 py-1 bg-red-400 text-white rounded hover:bg-red-500"
          onClick={(e) => !confirm("Are you sure?") && e.preventDefault()}>
          Delete
        </button>
      </Form>
    </div>
  );
};
