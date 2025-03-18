import FingerprintJS from "@fingerprintjs/fingerprintjs";

export default async function getFingerprint() {
    const fp = await FingerprintJS.load(); // Load library
    const result = await fp.get(); // Get fingerprint
    console.log("User Fingerprint:", result.visitorId);
    return result.visitorId; // Unique fingerprint ID
}


