import { useEffect, useState } from "react";
import axios from "axios";
import { userFields } from "../config/fieldsConfig";

const initialState = Object.fromEntries(userFields.map((f) => [f.name, ""]));
const initialErrors = Object.fromEntries(userFields.map((f) => [f.name, ""]));

export default function UserForm({ fetchUsers, editingUser, setEditingUser }) {
    const [formData, setFormData] = useState(initialState);
    const [formErrors, setFormErrors] = useState(initialErrors);

    useEffect(() => {
        if (editingUser) {
            setFormData(editingUser);
            setFormErrors(initialErrors);
        } else {
            setFormData(initialState);
            setFormErrors(initialErrors);
        }
    }, [editingUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setFormErrors((prev) => ({ ...prev, [name]: "" })); // Clear error as user types
    };

    const validate = () => {
        let errors = {};
        userFields.forEach(({ name, label, type }) => {
            const value = formData[name]?.trim();
            if (!value) {
                errors[name] = `${label} is required`;
                return;
            }
            if (name === "email") {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(value)) {
                    errors[name] = "Enter a valid email address";
                }
            }
            if (name === "phone") {
                const phonePattern = /^\d{10}$/;
                if (!phonePattern.test(value)) {
                    errors[name] = "Phone number must be 10 digits";
                }
            }
            if (name === "dob") {
                const selectedDate = new Date(value);
                const today = new Date();
                if (selectedDate > today) {
                    errors[name] = "DOB cannot be in the future";
                }
            }
        });
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        try {
            if (editingUser) {
                await axios.put(`http://localhost:5000/api/updateUser/${editingUser._id}`, formData);
                setEditingUser(null);
            } else {
                await axios.post("http://localhost:5000/api/createUser", formData);
            }
            fetchUsers();
            setFormData(initialState);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border rounded mb-4 bg-light">
            <h4 className="mb-3">{editingUser ? "Edit User" : "Add User"}</h4>
            <div className="row g-3">
                {userFields.map(({ label, name, type, options }) => (
                    <div className="col-12 col-sm-6 col-md-4" key={name}>
                        <div className="mb-3">
                            <label htmlFor={name} className="form-label">{label}</label>
                            {type === "select" ? (
                                <select
                                    name={name}
                                    id={name}
                                    value={formData[name]}
                                    onChange={handleChange}
                                    className={`form-select ${formErrors[name] ? "is-invalid" : ""}`}
                                >
                                    <option value="">Select {label}</option>
                                    {options.map((opt) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type={type}
                                    name={name}
                                    id={name}
                                    value={formData[name]}
                                    onChange={handleChange}
                                    className={`form-control ${formErrors[name] ? "is-invalid" : ""}`}
                                    max={type === "date" ? new Date().toISOString().split("T")[0] : undefined}
                                />
                            )}
                            {formErrors[name] && (
                                <div className="invalid-feedback">{formErrors[name]}</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <button type="submit" className="btn btn-primary">
                {editingUser ? "Update" : "Submit"}
            </button>
            {editingUser && (
                <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="btn btn-secondary ms-2"
                >
                    Cancel
                </button>
            )}
        </form>
    );
}
