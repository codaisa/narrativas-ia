import { google } from "googleapis";
import type { JWT } from "google-auth-library";

let jwtClient: JWT

export function getAuthClient(): JWT {
    if (jwtClient) return jwtClient;

    const credsJson = process.env.GOOGLE_CREDENTIALS!;
    const key = JSON.parse(credsJson);

    jwtClient = new google.auth.JWT({
        email: key.client_email,
        key: key.private_key,
        scopes: ["https://www.googleapis.com/auth/documents", "https://www.googleapis.com/auth/drive"]
    })

    return jwtClient;
}

export async function getDocument(docId: string) {
    const auth = getAuthClient();
    const docs = google.docs({ version: "v1", auth })
    const res = await docs.documents.get({ documentId: docId })
    return res.data
}

export async function batchUpdateDocument(docId: string, requests: object[]) {
    const auth = getAuthClient()
    const docs = google.docs({ version: 'v1', auth })
    const res = await docs.documents.batchUpdate({
        documentId: docId,
        requestBody: {
            requests,
        },
    });

    return res.data
}


