import { Resolution, UserAlt as User } from "@/lib/types";

const respondToResolution = async (
  user: User,
  resolutionId: string,
  accept: boolean
): Promise<Resolution> => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${user.access_token}`,
  };

  const body = {
    resolutionId,
    userId: user.user_id,
    accept
  };

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/issues/respond-resolution`;
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (response.ok) {
    return data;
  } else {
    throw new Error(data.error);
  }
};

export { respondToResolution };