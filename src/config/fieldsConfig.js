export const userFields = [
    { name: "firstName", label: "First Name", type: "text", required: true },
    { name: "lastName", label: "Last Name", type: "text", required: true },
    { name: "phone", label: "Phone Number", type: "tel", required: true },
    { name: "email", label: "Email Address", type: "email", required: true },
    { name: "dob", label: "Date of Birth", type: "date", required: true },
    {
        name: "gender",
        label: "Gender",
        type: "select",
        options: ["Male", "Female", "Other"],
        required: true
    },
];