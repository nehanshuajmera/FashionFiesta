import forge from "node-forge";
const publicKeyPem = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApF4SsQEHMgPo/oxlzLe/
Syw9oke6o2OnGA19DiTqilKKV36FAEYl7+yGdOIefvhrwQAJkVteA4mu1OcrYnpr
UjnmGwaQA6UivaJIfMOkC0zMw9n/He6oUGXEpdbqb0KSJBThMDomPvzdi7GYmUGG
t+Blr/4ubVy1kN2gcSifqgnQht9K7gSEv3uClFGe+VbCjZWefHY1Y3Up3ysdfyP1
NkO8lHRuXLJ2N1S4W5JXQOGwsW30oqZmN9XS71mg/75W0eqWXWq592j0x5vzy+GH
Diqnl2Dj112fzwj70mnsTJzqBe9Yk9iG9xQxnSbaNLqFqGBfFgd7lO6bsaemvgxg
DwIDAQAB
-----END PUBLIC KEY-----`;

export const encryptPassword = (password) => {
  try {
    if (!publicKeyPem) {
      throw new Error("Public key is not defined");
    }
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
    const encryptedPassword = publicKey.encrypt(password, "RSA-OAEP", {
      md: forge.md.sha256.create(),
    });
    return forge.util.encode64(encryptedPassword); // Encode as Base64
  } catch (error) {
    console.error(`Error encrypting password: ${error}`);
    throw new Error("Encryption failed");
  }
};
