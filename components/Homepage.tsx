import Sidebar from './Sidebar';
import RightSidebar from './RightSidebar';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import Login from './Login';
import { useAuth } from '../context/authContext';
import styles from '../styles/Loading.module.css';

export type List = {
  id: string;
  name: string;
  categories: Array<{
    name: string;
    id: string;
    items: Array<{
      note: string;
      name: string;
      id: string;
      image: string;
      quantity: number;
    }>;
  }>;
};

export type Cart = {
  categories: Array<{
    name: string;
    id: string;
    items: Array<{
      note: string;
      name: string;
      id: string;
      image: string;
      quantity: number;
    }>;
  }>;
  name: string;
};

export type selectedItem = {
  name: string;
  note: string;
  image: string;
  quantity: number;
  id: string;
};

function Home() {
  const [cart, setCart] = useState<Cart>({
    categories: [],
    name: 'Shopping list',
  });

  const [selectedItem, setSelectedItem] = useState<selectedItem | null>(null);

  const { user, userData, loading, logout, getUserData } = useAuth();

  useEffect(() => {
    const getData = async () => {
      if (!userData) {
        await getUserData();
      }
    };

    getData();
  }, [getUserData, userData]);

  useEffect(() => {
    setFilteredItems(userData);
  }, [userData]);

  const [filteredItems, setFilteredItems] = useState<List | null>(userData);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className={styles.load}></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const handleAddToCart = (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent> | null,
    category: List['categories'][0],
    item: List['categories'][0]['items'][0]
  ) => {
    if (event) {
      event.currentTarget.textContent = 'done';
    }
    setCart((prevCart) => {
      const inCart = prevCart.categories.findIndex((cat) => cat.id == category.id);
      if (inCart == -1) {
        return {
          ...prevCart,
          categories: [...prevCart.categories, { ...category, items: [{ ...item, quantity: 1 }] }],
        };
      } else {
        const itemInCategory = prevCart.categories[inCart].items.findIndex(
          (it) => it.id == item.id
        );

        if (itemInCategory == -1) {
          return {
            ...prevCart,
            categories: [
              ...prevCart.categories.slice(0, inCart),
              {
                ...prevCart.categories[inCart],
                items: [...prevCart.categories[inCart].items, { ...item, quantity: 1 }],
              },
              ...prevCart.categories.slice(inCart + 1),
            ],
          };
        } else {
          return {
            ...prevCart,
            categories: [
              ...prevCart.categories.slice(0, inCart),
              {
                ...prevCart.categories[inCart],
                items: [
                  ...prevCart.categories[inCart].items.slice(0, itemInCategory),
                  {
                    ...prevCart.categories[inCart].items[itemInCategory],
                    quantity: prevCart.categories[inCart].items[itemInCategory].quantity + 1,
                  },
                  ...prevCart.categories[inCart].items.slice(itemInCategory + 1),
                ],
              },
              ...prevCart.categories.slice(inCart + 1),
            ],
          };
        }
      }
    });
    if (event) {
      setTimeout(() => {
        event.currentTarget.textContent = 'add';
      }, 1000);
    }
  };

  const handleAddToCartSelectedItem = (category: List['categories'][0]) => {
    if (selectedItem) {
      handleAddToCart(null, category, selectedItem);
    }
  };

  const handleResetSelectedItem = () => {
    setSelectedItem(null);
  };

  const renderSekeleton = () => {
    const card = Array(4).fill(
      <div className="border border-gray-200 py-4 px-8 font-bold rounded-xl shadow-lg flex gap-8 items-center">
        <div className="h-4 rounded w-32 bg-[#e5e7eb]" />
        <span className="material-symbols-outlined cursor-pointer text-[#C1C1C4]">add</span>
      </div>
    );

    const skeleton = (
      <>
        <div className="mt-8 h-4 bg-[#212529] opacity-10 rounded w-44" />
        <div className="flex flex-wrap gap-5 py-5 justify-between">
          <div className="border border-gray-200 py-4 px-8 font-bold rounded-xl shadow-lg flex gap-8 items-center">
            <div className="h-4 rounded w-32 bg-[#e5e7eb]" />
            <span className="material-symbols-outlined cursor-pointer text-[#C1C1C4]">add</span>
          </div>
          <div className="border border-gray-200 py-4 px-8 font-bold rounded-xl shadow-lg flex gap-8 items-center">
            <div className="h-4 rounded w-32 bg-[#e5e7eb]" />
            <span className="material-symbols-outlined cursor-pointer text-[#C1C1C4]">add</span>
          </div>
          <div className="border border-gray-200 py-4 px-8 font-bold rounded-xl shadow-lg flex gap-8 items-center">
            <div className="h-4 rounded w-32 bg-[#e5e7eb]" />
            <span className="material-symbols-outlined cursor-pointer text-[#C1C1C4]">add</span>
          </div>
          <div className="border border-gray-200 py-4 px-8 font-bold rounded-xl shadow-lg flex gap-8 items-center">
            <div className="h-4 rounded w-32 bg-[#e5e7eb]" />
            <span className="material-symbols-outlined cursor-pointer text-[#C1C1C4]">add</span>
          </div>
        </div>
      </>
    );

    return (
      <div className="animate-pulse">
        {skeleton}
        {skeleton}
        {skeleton}
        {skeleton}
      </div>
    );
  };

  return (
    <div className="flex">
      <Head>
        <title>Shoppingify</title>
      </Head>
      <Sidebar cartlen={cart.categories.length} />
      <div className="bg-mainBg w-full p-12 ml-24 mr-[25%] min-h-screen">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">
            <span className="text-primary font-bold">Shoppingify</span> allows you take your
            shopping list wherever you go
          </h1>
          <button className="bg-primary rounded p-2 text-white font-bold" onClick={logout}>
            LOGOUT
          </button>
          <div className="bg-white shadow-md rounded-xl p-4 flex items-center gap-2">
            <span className="material-symbols-outlined">search</span>
            <input
              className="placeholder:text-sm pl-2 active:border-none focus:outline-none"
              disabled={loading || !userData}
              placeholder="search item"
              onChange={(e) => {
                const search = e.target.value;
                if (!search || search.trim() == '') {
                  setFilteredItems(userData);
                } else {
                  const filteredItems = userData!.categories.map((category) => {
                    return {
                      ...category,
                      items: category.items.filter((item) => {
                        return item.name.toLowerCase().includes(search.toLowerCase());
                      }),
                    };
                  });
                  setFilteredItems({
                    categories: filteredItems,
                    id: userData!.id,
                    name: userData!.name,
                  });
                }
              }}
            />
          </div>
        </div>
        {filteredItems
          ? filteredItems.categories.map((category) => {
              if (category.items.length <= 0) {
                return null;
              }

              return (
                <div key={category.id}>
                  <h2 className="mt-5 font-bold">{category.name}</h2>
                  <div className="flex flex-wrap gap-5 py-5">
                    {category.items.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white p-4 font-bold rounded-xl shadow-lg flex gap-8 cursor-pointer border-2 border-transparent hover:border-primary"
                        onClick={() => setSelectedItem(item)}
                      >
                        <p>{item.name}</p>
                        <span
                          className="material-symbols-outlined cursor-pointer text-[#C1C1C4] hover:text-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(e, category, item);
                          }}
                        >
                          add
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          : renderSekeleton()}
      </div>
      {userData ? (
        <RightSidebar
          cart={cart}
          setCart={setCart}
          list={userData}
          selectedItem={selectedItem}
          resetSelected={handleResetSelectedItem}
          addToCart={handleAddToCartSelectedItem}
        />
      ) : (
        <div className="w-1/4 fixed right-0 h-screen flex items-center bg-mainBg">
          <div className={styles.load}></div>
        </div>
      )}
    </div>
  );
}
export default Home;
