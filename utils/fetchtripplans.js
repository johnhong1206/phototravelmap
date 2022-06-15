const url =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PRODUCTION_URL
    : process.env.NEXT_PUBLIC_BASE_URL;

export const fetchtripplans = async (email) => {
  const tripplansInfo = {
    email: email,
  };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/gettripplans`,
    { body: JSON.stringify(tripplansInfo), method: "POST" }
  );
  const data = await res.json();
  const tripplans = data.tripplans;
  return tripplans;
};

export const fetchtripplansById = async (id) => {
  const tripplansInfo = {
    id: id,
  };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/gettripplansbyid`,
    { body: JSON.stringify(tripplansInfo), method: "POST" }
  );
  const data = await res.json();
  const tripplans = data.tripplans;
  return tripplans;
};

export const fetchtripdetailsById = async (id) => {
  const tripplansInfo = {
    id: id,
  };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/gettripplandettailsbyid`,
    { body: JSON.stringify(tripplansInfo), method: "POST" }
  );
  const data = await res.json();

  const tripdetails = data.tripdetails;
  return tripdetails;
};
