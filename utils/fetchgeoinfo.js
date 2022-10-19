export const fetchgeoInfo = async (input) => {
  console.log("input", input);
  const id = input;
  var requestOptions = {
    method: "GET",
  };
  const url = `https://api.geoapify.com/v1/geocode/search?text=${id}&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_KEY}`;
  const res = await fetch(url, requestOptions);
  const areainfo = await res.json();

  return areainfo;
};

export const fetchAreageo = async (input) => {
  console.log("input", input);
  const id = input;
  var requestOptions = {
    method: "GET",
  };
  const url = `https://api.geoapify.com/v1/geocode/search?text=${id}&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_KEY}`;
  const res = await fetch(url, requestOptions);
  const areainfo = await res.json();
  let newAreaGeo = areainfo.features[0].properties;

  return newAreaGeo;
};

export const fetchAreaInfo = async (type, areaGeo) => {
  const lon = areaGeo?.lon;
  const lat = areaGeo?.lat;
  const input = type;
  var requestOptions = {
    method: "GET",
  };
  const url = `https://api.geoapify.com/v2/places?categories=${input}&filter=circle:${lon},${lat},10000&bias=proximity:${lon},${lat}&limit=50&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_KEY}`;
  const res = await fetch(url, requestOptions);
  const areainfo = await res.json();
  let newAreaGeo = areainfo.features;

  return newAreaGeo;
};

export const fetchCommonAreaInfo = async (areaGeo) => {
  const longitude = areaGeo?.lon;
  const latitude = areaGeo?.lat;

  var requestOptions = {
    method: "GET",
  };
  const url = `https://api.geoapify.com/v2/places?categories=catering,tourism,heritage,accommodation,entertainment&filter=circle:${longitude},${latitude},10000&bias=proximity:${longitude},${latitude}&limit=30&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_KEY}`;

  const res = await fetch(url, requestOptions);
  const areainfo = await res.json();
  let newAreaGeo = areainfo.features;

  return newAreaGeo;
};
export const fetchAdvanceCommonAreaInfo = async (lon, lat) => {
  const longitude = lon;
  const latitude = lat;

  var requestOptions = {
    method: "GET",
  };
  const url = `https://api.geoapify.com/v2/places?categories=catering,tourism,heritage,accommodation,entertainment&filter=circle:${longitude},${latitude},10000&bias=proximity:${longitude},${latitude}&limit=30&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_KEY}`;

  const res = await fetch(url, requestOptions);
  const areainfo = await res.json();
  let newAreaGeo = areainfo.features;

  return newAreaGeo;
};
export const fetchAdvanceAreaInfo = async (type, lon, lat) => {
  const input = type;
  var requestOptions = {
    method: "GET",
  };
  const url = `https://api.geoapify.com/v2/places?categories=${input}&filter=circle:${lon},${lat},10000&bias=proximity:${lon},${lat}&limit=50&apiKey=${process.env.NEXT_PUBLIC_GEOAPIFY_KEY}`;
  const res = await fetch(url, requestOptions);
  const areainfo = await res.json();
  let newAreaGeo = areainfo.features;

  return newAreaGeo;
};
