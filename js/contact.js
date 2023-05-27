export { getContact };

function getContact(contactType, contact) {
    if (contactType == "TEL") {
        return `<p><i class="fa-solid fa-phone"></i> <a href="tel:${contact}">${contact}</a></p>`;
    } else if (contactType == "EMAIL") {
        return `<p><i class="fa-solid fa-envelope"></i> <a href="mailto:${contact}">${contact}</a></p>`;
    } else if (contactType == "WEB") {
        return `<p><i class="fa-solid fa-globe"></i> <a href="${contact}" target="_blank">${contact}</a></p>`;
    } else {
        return "";
    }
}