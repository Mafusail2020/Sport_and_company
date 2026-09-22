/** Tiny fetch wrapper shared by the admin UI: always sends the session cookie, parses JSON, throws on non-2xx with the server's error message attached. */
async function request(path, options = {}) {
  const isFormData = options.body instanceof FormData;

  const response = await fetch(path, {
    credentials: "include",
    ...options,
    headers: isFormData ? options.headers : { "Content-Type": "application/json", ...options.headers },
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    // No/invalid JSON body — data stays null.
  }

  if (!response.ok) {
    const error = new Error(data?.error || `Request failed (${response.status})`);
    error.status = response.status;
    error.details = data?.details;
    throw error;
  }

  return data;
}

export const adminApi = {
  login: (password) => request("/api/admin/login", { method: "POST", body: JSON.stringify({ password }) }),
  logout: () => request("/api/admin/logout", { method: "POST" }),
  session: () => request("/api/admin/session"),

  getPricing: () => request("/api/pricing"),
  savePricing: (packages) =>
    request("/api/admin/pricing", { method: "PUT", body: JSON.stringify({ packages }) }),
  resetPricing: () => request("/api/admin/pricing", { method: "DELETE" }),

  getPhotos: () => request("/api/photos"),
  uploadPhoto: (slotKey, file) => {
    const formData = new FormData();
    formData.append("photo", file);
    return request(`/api/admin/photos/${slotKey}`, { method: "POST", body: formData });
  },
  resetPhoto: (slotKey) => request(`/api/admin/photos/${slotKey}`, { method: "DELETE" }),

  getContactInfo: () => request("/api/contact-info"),
  saveContactInfo: (contactInfo) =>
    request("/api/admin/contact-info", { method: "PUT", body: JSON.stringify(contactInfo) }),
  resetContactInfo: () => request("/api/admin/contact-info", { method: "DELETE" }),
};
