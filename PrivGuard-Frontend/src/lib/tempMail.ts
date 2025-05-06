import axios from "axios";

const API = "https://api.mail.tm";

// TTL for the temp email (6.5 days in milliseconds)
const TTL = 6.5 * 24 * 60 * 60 * 1000;

interface MailTMMessage {
    id: string;
    from: {
        address: string;
        name?: string;
    };
    subject: string;
    createdAt: string;
}

// Function to get the auth token (either from memory or localStorage)
function getAuthToken(): string {
    return localStorage.getItem("tempAuthToken") || "";
}

// Function to generate the temporary email and store it in localStorage with TTL
export async function createTempAccount(): Promise<string> {
    const storedEmail = localStorage.getItem("tempEmail");
    const storedTime = localStorage.getItem("tempEmailTime");
    const storedToken = localStorage.getItem("tempAuthToken");

    const currentTime = new Date().getTime();

    // If the email exists, has not expired, and has a token, return it
    if (storedEmail && storedTime && storedToken && currentTime - parseInt(storedTime) < TTL) {
        return storedEmail;
    }

    // Otherwise, create a new temporary email
    const domainRes = await axios.get(`${API}/domains`);
    const domains = domainRes.data["hydra:member"];
    if (!domains.length) throw new Error("No domains available");

    const selectedDomain = domains[0].domain;
    const randomUsername = Math.random().toString(36).substring(2, 10);
    const randomEmail = `${randomUsername}@${selectedDomain}`;
    const password = "privguard-temp123";

    await axios.post(`${API}/accounts`, {
        address: randomEmail,
        password,
    });

    const tokenRes = await axios.post(`${API}/token`, {
        address: randomEmail,
        password,
    });

    const authToken = tokenRes.data.token;

    // Store the email, timestamp, and token in localStorage
    localStorage.setItem("tempEmail", randomEmail);
    localStorage.setItem("tempEmailTime", currentTime.toString());
    localStorage.setItem("tempAuthToken", authToken);

    return randomEmail;
}

// Fetch temporary emails using the stored token
export async function fetchTempEmails(): Promise<MailTMMessage[]> {
    const authToken = getAuthToken();
    if (!authToken) throw new Error("Missing auth token");

    const res = await axios.get(`${API}/messages`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
    });

    return res.data["hydra:member"] || [];
}