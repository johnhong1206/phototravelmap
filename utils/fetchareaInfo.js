export const fetchlocationInfo = async (locationInfo) => {
  const longitude = locationInfo.longitude;
  const latitude = locationInfo.latitude;
  var requestOptions = {
    method: "GET",
  };
  const url = `https://api.geoapify.com/v2/places?categories=catering,tourism,heritage,accommodation,entertainment&filter=circle:${longitude},${latitude},10000&bias=proximity:${longitude},${latitude}&limit=30&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_KEY}`;
  const res = await fetch(url, requestOptions);
  const areainfo = await res.json();
  return areainfo;
};
export const fetchlocationQueryInfo = async (locationInfo) => {
  const queryOption = locationInfo.queryOption;
  const longitude = locationInfo.longitude;
  const latitude = locationInfo.latitude;
  var requestOptions = {
    method: "GET",
  };
  const url = `https://api.geoapify.com/v2/places?categories=${queryOption.toString()}&filter=circle:${longitude},${latitude},10000&bias=proximity:${longitude},${latitude}&limit=50&apiKey=${
    process.env.NEXT_PUBLIC_GEOAPIFY_KEY
  }`;
  const res = await fetch(url, requestOptions);
  const areainfo = await res.json();
  return areainfo;
};
