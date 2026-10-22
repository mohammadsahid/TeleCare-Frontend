import API from "../api/axios";

export const getMedicines = async () => {
  const { data } = await API.get("/medicines");
  return data;
};

export const addMedicine = async (medicineData) => {
  const { data } = await API.post(
    "/medicines",
    medicineData
  );

  return data;
};

export const searchMedicine = async (name) => {
  const { data } = await API.get(
    `/medicines/search?name=${name}`
  );

  return data;
};