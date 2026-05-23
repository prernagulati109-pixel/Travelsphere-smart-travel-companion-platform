const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'https://travelsphere-production.up.railway.app/api';
const CHAT_API_URL = `${API_BASE_URL.replace(/\/$/, '')}/chat`;

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || data.message || 'Chat request failed');
  }
  return data;
};

export const sendMessage = async ({ message, sessionId, userId, userEmail, messages }) => {
  const response = await fetch(CHAT_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message,
      sessionId,
      userId,
      userEmail,
      messages
    })
  });

  return handleResponse(response);
};

export const getHistory = async ({ sessionId, userId, userEmail }) => {
  const params = new URLSearchParams();
  if (userId) params.set('userId', userId);
  if (userEmail) params.set('userEmail', userEmail);

  const query = params.toString();
  const response = await fetch(`${CHAT_API_URL}/history/${encodeURIComponent(sessionId)}${query ? `?${query}` : ''}`);
  return handleResponse(response);
};
