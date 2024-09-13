import forge from "node-forge";
import { config } from "dotenv";
config(); // Load environment variables

// Function to decrypt an encrypted password
export const decryptPassword = (encryptedPassword) => {
  // Load private key from the environment variable
  const privateKeyPem = process.env.PRIVATE_KEY;
  try {
    if (!privateKeyPem) {
      throw new Error("Private key is missing in environment variables");
    }

    // Parse the PEM-encoded private key using Node Forge
    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);

    // Decrypt the password (assuming it's base64 encoded)
    const encryptedBuffer = forge.util.decode64(encryptedPassword);

    const decryptedPassword = privateKey.decrypt(encryptedBuffer, "RSA-OAEP", {
      md: forge.md.sha256.create(),
    });

    return decryptedPassword;
  } catch (err) {
    throw new Error(`Failed to decrypt the password: ${err.message}`);
  }
};
