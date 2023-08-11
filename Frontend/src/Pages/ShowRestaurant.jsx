import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import RatingComponent from "../Components/RatingComponent";
import state from "../Components/AtomStates";
import RestaurantName from "../Components/ShouRestaurantComponents.jsx/RestaurantName";
import RestaurantDescription from "../Components/ShouRestaurantComponents.jsx/RestaurantDescription";
import RestaurantImage from "../Components/ShouRestaurantComponents.jsx/RestaurantImage";
import RestaurantMenu from "../Components/ShouRestaurantComponents.jsx/RestaurantMenu";

export default function MyRestaurant() {
  const [thisRestaurant, setThisRestaurant] = useState(null);
  const [refreshShowRestaurant, setRefreshShowRestaurant] = useAtom(
    state.refreshShowRestaurant
  );
  const params = useParams();

  let lastUpdatedMenu = "21.07.2003";
  let id = params.restaurantId * 1;
  useEffect(() => {
    fetch(`http://localhost:8080/restaurant/getById/${id}`)
      .then((res) => res.json())
      .then((data) => {
        window.location.pathname == "/createRestaurant"
          ? setThisRestaurant(null)
          : setThisRestaurant(data);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching data (categoryProducts):", error);
        console.log("error in fetch");
      });
  }, [refreshShowRestaurant]);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);

    fetch(
      `http://localhost:8080/restaurant/uploadProfileImage/${thisRestaurant.id}`,
      {
        method: "POST",
        body: formData,
      }
    )
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        setThisRestaurant({
          ...thisRestaurant,
          image: { ...thisRestaurant.image, imageUrl: data.imageUrl },
        });
        console.log("the restaurant was refreshed");
      })
      .catch((error) => {
        console.error("Error while uploading image:", error);
      });

    //TODO patch
  };

  const editContentEvent = (contentRef, key) => {
    fetch(
      `http://localhost:8080/restaurant/update/${key}/${thisRestaurant.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: contentRef.current.textContent,
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {})
      .catch((error) => {
        console.error("Error while updating the restaurant name:", error);
      });
    setThisRestaurant({
      ...thisRestaurant,
      [key]: contentRef.current.textContent,
    });
  };

  const Divider = () => {
    return (
      <div className="flex flex-col w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
        <div className="divider"></div>
      </div>
    );
  };

  console.log(thisRestaurant);
  return (
    <div className="h-full overflow-x-hidden">
      <div className="grid grid-cols-1 md:grid-cols-5 bg-tc1 text-white w-screen h-full">
        {/* col1 */}
        <div className="bg-gray-900 col-span-2">
          <RestaurantName
            thisRestaurant={thisRestaurant}
            editContentEvent={editContentEvent}
          />

          <Divider />

          <RestaurantImage
            thisRestaurant={thisRestaurant}
            handleImageChange={handleImageChange}
          />

          <Divider />

          <RatingComponent />

          <Divider />

          <RestaurantDescription
            thisRestaurant={thisRestaurant}
            editContentEvent={editContentEvent}
          />
        </div>

        {/* col2 */}
        <div className="pl-2 pr-3 bg-gray-900 w-full col-span-3">
          <div className="mt-3 mb-1 flex flex-col items-center p-2 bg-gray-800 text-white rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-0">MENU</h1>
            <p className="text-sm text-gray-400 mt-1 mb-0">
              Last updated at {lastUpdatedMenu}
            </p>
          </div>

          <div className="max-h-screen overflow-y-scroll mt-3 scrollbar-hide">
            <RestaurantMenu
              thisRestaurant={thisRestaurant}
              setThisRestaurant={setThisRestaurant}
            />
          </div>
        </div>
      </div>
      {/* <button className = "bg-white absolute right-10 bottom-10 w-20 h-10"> SAVE </button> */}

      <button
        type="button"
        className="fixed right-14 bottom-10 text-white bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-yellow-300 dark:focus:ring-yellow-800 shadow-lg shadow-yellow-500/50 dark:shadow-lg dark:shadow-yellow-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
      >
        SAVE
      </button>
    </div>
  );
}