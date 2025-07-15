import z from "zod";

export const userRegisterValidator = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    email: z.email("Invalid email format"),
    courseName: z.enum(["Btech", "Mtech"], "Invalid course name"),
    section: z.enum(["A", "B", "C", "D", "CE"], "Invalid section"),
    semester: z.enum(["1", "2", "3", "4", "5", "6", "7", "8"], "Invalid semester"),
    rollNumber: z.string().min(5, "Roll number must be at least 5 characters long"),    
});

export const userLoginValidator = z.object({
    rollNumber: z.string("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});
