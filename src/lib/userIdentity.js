export function userInitials(name) {
    return name?.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase() || "U";
}
