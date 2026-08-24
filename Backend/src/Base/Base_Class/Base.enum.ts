export enum USERROLE {
    // System level
    SUPER_ADMIN = "SUPER_ADMIN",

    // Society management
    SOCIETY_ADMIN = "SOCIETY_ADMIN",
    SOCIETY_MANAGER = "SOCIETY_MANAGER",
    ACCOUNTANT = "ACCOUNTANT",

    // Residents
    OWNER = "OWNER",
    TENANT = "TENANT",
    RESIDENT = "RESIDENT",

    // Society staff
    SECURITY = "SECURITY",
    MAINTENANCE = "MAINTENANCE",
    CLEANER = "CLEANER",
    GARDENER = "GARDENER",
    STAFF = "STAFF",

    // Legacy template aliases for backward compatibility
    ADMIN = "ADMIN",
    SUPERADMIN = "SUPERADMIN",
    STUDENT = "STUDENT",
    TEACHER = "TEACHER",
    HOD = "HOD",
}
