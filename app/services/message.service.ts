export const sendContributionMessage = (phone: string, name: string) => {
    const contributionMessage = `
Hello ${name},

💰 Contribution
Amount: INR 5000
Status: Received ✅

Thank you!
OCET Circle Fund
`;
    sendWhatsAppMessage(phone, contributionMessage);
};

export const sendWhatsAppMessage = (phone: string, message: string) => {
    const cleanPhone = phone.replace(/\D/g, "");
    const encodedMessage = encodeURIComponent(message);

    const url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMessage}`;

    window.open(url, "_blank");
};
