import axios from "axios";
import { userFields } from "../config/fieldsConfig";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

export default function UserList({ users, fetchUsers, setEditingUser }) {
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    await axios.delete(`http://localhost:5000/api/deleteUser/${id}`);
    fetchUsers();
  };

  const fieldKeys = userFields.map((field) => field.name);

  return (
    <div className="container-lg mt-5 container-md-fluid">
      <h4 className="card-title mb-4">User List</h4>
      <div className="table-responsive">
        <table className="table table-hover align-middle table-borderless">
          <thead className="table-light">
            <tr>
              <th style={{ width: "40px" }}>#</th>
              {fieldKeys.map((key) => (
                <th key={key} className="text-nowrap">
                  {userFields.find((f) => f.name === key)?.label || key}
                </th>
              ))}
              <th style={{ width: "80px" }} className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.length > 0 ? (
              users.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  {fieldKeys.map((key) => (
                    <td key={key} className="text-nowrap">
                      {user[key] || "-"}
                    </td>
                  ))}
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-link text-primary"
                      onClick={() => setEditingUser(user)}
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn btn-sm btn-link text-danger"
                      onClick={() => handleDelete(user._id)}
                      title="Delete"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={fieldKeys.length + 2} className="text-center py-4">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
