import React from "react";
import { useState, useEffect } from "react";
import CategoryAccordeon from "./CategoryAccordeon";
import { checking } from "../Utils";
import Loading from "../Loading";

const ITEMS_PER_PAGE = 5;

export default function RestaurantMenu({ thisRestaurant, setThisRestaurant }) {
  const [open, setOpen] = useState(1);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (thisRestaurant) {
      setLoading(true);
      fetch(
        `http://localhost:8080/categoryProduct/getSome/${thisRestaurant.menu.id}/${page}/${ITEMS_PER_PAGE}`
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          console.log(thisRestaurant.menu.categoryProducts);
          setThisRestaurant({
            ...thisRestaurant,
            menu: {
              ...thisRestaurant.menu,
              categoryProducts: [
               ...thisRestaurant.menu.categoryProducts ? thisRestaurant.menu.categoryProducts : [],
                ...data,
              ],
            },
          });
          setLoading(false);
        });
    }
  }, [page]);

  const seeMore = () => {
    setPage(page + 1);
  };

  const handleOpen = (value, e) => {
    if (e.target.nodeName != "I") setOpen(open === value ? 0 : value);
  };

  const addNewCateg = () => {
    fetch(
      `http://localhost:8080/categoryProduct/post/new/category/${thisRestaurant.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({}),
      }
    )
      .then((res) => res.json())
      .then((newCateg) => {
        console.log(newCateg);
        setThisRestaurant({
          ...thisRestaurant,
          menu: {
            ...thisRestaurant.menu,
            categoryProducts: [
              ...thisRestaurant.menu.categoryProducts,
              newCateg,
            ],
          },
        });
      })
      .catch((error) => {
        console.error("Error fetching data (categoryProducts):", error);
      });
  };
  const addNewProd = (categId) => {
    fetch(`http://localhost:8080/product/post/new/product/${categId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then((newProd) => {
        console.log(newProd);
        let thisRestaurantCopy = { ...thisRestaurant };
        thisRestaurantCopy.menu.categoryProducts.map((categ) => {
          if (categ.id === categId) {
            categ.products.push(newProd);
          }
          return categ;
        });
        setThisRestaurant(thisRestaurantCopy);
      })
      .catch((error) => {
        console.error("Error fetching data (categoryProducts):", error);
        console.log("error in fetch");
      });
  };

  const editContentEvent = (contentRef, key, categId) => {
    let thisRestaurantCopy = { ...thisRestaurant };

    fetch(`http://localhost:8080/categoryProduct/update/${key}/${categId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: contentRef.current.textContent,
    }).catch((err) => {
      console.error("Err at updating categName " + err);
    });

    for (let categ of thisRestaurantCopy.menu.categoryProducts) {
      if (categ.id === categId) {
        categ[key] = contentRef.current.textContent;
        break;
      }
    }
    setThisRestaurant(thisRestaurantCopy);
  };

  const editProduct = (contentRef, key, categId, prodId) => {
    let thisRestaurantCopy = { ...thisRestaurant };
    console.log("prod ID " + prodId);
    console.log("cat Id " + categId);

    fetch(`http://localhost:8080/product/update/${key}/${prodId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: contentRef.current.textContent,
    })
      .then((res) => res.json())
      .catch((err) => {
        console.err("Err at updating categName " + err);
      });

    for (let categ of thisRestaurantCopy.menu.categoryProducts) {
      if (categ.id === categId) {
        for (let prod of categ.products) {
          if (prod.id === prodId) {
            prod[key] = contentRef.current.textContent;
            break;
          }
        }
        break;
      }
    }
    setThisRestaurant(thisRestaurantCopy);
  };

  return (
    <>
      <div className="md:mr-2 rounded-t-lg divide-y-2 border-b-2 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 lg:overflow-visible">
        {loading ? <Loading /> : null}
        {thisRestaurant?.menu.categoryProducts?.map((categ, index) => {
          return (
            <CategoryAccordeon
              key={index}
              open={open}
              index={index}
              handleOpen={handleOpen}
              categ={categ}
              editContentEvent={editContentEvent}
              addNewProd={addNewProd}
              editProduct={editProduct}
            />
          );
        })}
      </div>

      {checking.checkIfHolder() ? (
        <div className="w-full flex justify-center mt-3 ">
          <button
            className="w-1/2 justify-center font-bold py-2 px-4 rounded inline-flex items-center  text-gray-200 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-yellow-300 dark:focus:ring-yellow-800 shadow-lg shadow-yellow-500/50 dark:shadow-lg dark:shadow-yellow-800/80  text-sm  text-cente"
            onClick={addNewCateg}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="none"
              stroke={"white"}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-2"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>

            <span>Add category of products(ex. Drinks)</span>
          </button>
        </div>
      ) : null}
      <button
        className="w-1/2 justify-center font-bold py-2 px-4 rounded inline-flex items-center  text-gray-200 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-yellow-300 dark:focus:ring-yellow-800 shadow-lg shadow-yellow-500/50 dark:shadow-lg dark:shadow-yellow-800/80  text-sm  text-cente"
        onClick={seeMore}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={20}
          height={20}
          viewBox="0 0 24 24"
          fill="none"
          stroke={"white"}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mx-2"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>

        <span>See more...</span>
      </button>
    </>
  );
}
