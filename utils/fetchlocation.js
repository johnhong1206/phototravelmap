export const fetchlocation = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/getlocations`
  );
  const data = await res.json();
  const location = data.location;
  return location;
};
