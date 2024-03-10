import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import getAddress from "../../services/apiGeocoding";

function getPosition() {
  return new Promise(function (resolve, reject) {
  // On récupère la position de l'utilisateur si celui-ci l'a permis
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

// Un Thunk est un middleware situé entre le dispatching et le store, il permet d'écrire du code après le dispatch avant qu'il atteigne le reducer du store
export const fetchAddress = createAsyncThunk("user/fetchAddress", async function () {
  // On a la position de l'utilisateur
  const positionObj = await getPosition();
  const position = {
    latitude: positionObj.coords.latitude,
    longitude: positionObj.coords.longitude,
  };

  // On utilise une API pour avoir plus de détails sur la position de l'utilisateur pour que l'on puisse l'afficher dans le formulaire
  const addressObj = await getAddress(position);
  const address = `${addressObj?.locality}, ${addressObj?.city} ${addressObj?.postcode}, ${addressObj?.countryName}`;

  // On retourne ensuite un objet avec les données qui nous intéressent
  return { position, address };
})

// On créé un objet avec l'état initial
const initialState = {
  username: "",
  status: "idle",
  position: {},
  address: "",
  error: ""
};

// On créé une slice pour l'user
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateName(state, action) { // On créé une action pour update le nom
      state.username = action.payload
    }
  }, // les extra reducers permettent de répondre à des actions générées ailleurs dans l'application
  extraReducers: (builder) => 
    builder.addCase(
      fetchAddress.pending,
      (state, action) => {
        state.status = "loading"
      }
    )
    .addCase(
      fetchAddress.fulfilled,
      (state, action) => {
        state.position = action.payload.position;
        state.address = action.payload.address;
        state.status = "idle"
      }
    )
    .addCase(
      fetchAddress.rejected, 
      (state, action) => {
        state.status = "error";
        state.error = "There was an error getting your address. Make sure to fill this field !";
      }
    )
});

export const { updateName } = userSlice.actions;

export default userSlice.reducer;