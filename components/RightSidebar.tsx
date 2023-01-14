import Image from 'next/image';
import { FormEvent, memo, SetStateAction, useState } from 'react';
import { useAuth } from '../context/authContext';
import styles from '../styles/Rightbar.module.css';
import { Cart, List, selectedItem } from './Homepage';

type RightSidebarProps = {
  cart: Cart;
  list: List;
  selectedItem: selectedItem | null;
  setCart: React.Dispatch<SetStateAction<Cart>>;
  resetSelected: () => void;
  addToCart: (category: List['categories'][0]) => void;
};

const LoadedImage = memo(function LoadedImage() {
  return <Image src="/source.svg" width={70} height={120} alt="bottle" />;
});

function RightSidebar({
  cart,
  setCart,
  list,
  selectedItem,
  resetSelected,
  addToCart,
}: RightSidebarProps) {
  const [editId, setEditId] = useState('');
  const [addItemOption, setAddItemOption] = useState(false);

  const [newItemName, setNewItemName] = useState('');
  const [newItemNote, setNewItemNote] = useState('');
  const [newItemImage, setNewItemImage] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('');
  const [newCustomCategory, setNewCustomCategory] = useState('');

  const selectedItemCategory = selectedItem
    ? list.categories.find((category) => category.items.find((item) => item.id === selectedItem.id))
    : null;

  const { addItem, removeItem } = useAuth();

  const handleRemoveItem = (
    category: Cart['categories'][0],
    item: Cart['categories'][0]['items'][0]
  ) => {
    const categoryIndex = cart.categories.findIndex((cat) => cat.id === category.id);
    const itemIndex = cart.categories[categoryIndex].items.findIndex((i) => i.id === item.id);
    const categoryLen = cart.categories[categoryIndex].items.length;

    setCart((prevCart) => {
      if (categoryLen == 1) {
        return {
          ...prevCart,
          categories: [
            ...prevCart.categories.slice(0, categoryIndex),
            ...prevCart.categories.slice(categoryIndex + 1),
          ],
        };
      } else {
        return {
          ...prevCart,
          categories: [
            ...prevCart.categories.slice(0, categoryIndex),
            {
              ...prevCart.categories[categoryIndex],
              items: [
                ...prevCart.categories[categoryIndex].items.slice(0, itemIndex),
                ...prevCart.categories[categoryIndex].items.slice(itemIndex + 1),
              ],
            },
            ...prevCart.categories.slice(categoryIndex + 1),
          ],
        };
      }
    });
  };

  const handlePlusItem = (
    category: Cart['categories'][0],
    item: Cart['categories'][0]['items'][0]
  ) => {
    const categoryIndex = cart.categories.findIndex((cat) => cat.id === category.id);
    const itemIndex = cart.categories[categoryIndex].items.findIndex((i) => i.id === item.id);

    setCart((prevCart) => ({
      ...prevCart,
      categories: [
        ...prevCart.categories.slice(0, categoryIndex),
        {
          ...prevCart.categories[categoryIndex],
          items: [
            ...prevCart.categories[categoryIndex].items.slice(0, itemIndex),
            { ...item, quantity: item.quantity + 1 },
            ...prevCart.categories[categoryIndex].items.slice(itemIndex + 1),
          ],
        },
        ...prevCart.categories.slice(categoryIndex + 1),
      ],
    }));
  };

  const handleMinusItem = (
    category: Cart['categories'][0],
    item: Cart['categories'][0]['items'][0]
  ) => {
    const categoryIndex = cart.categories.findIndex((cat) => cat.id === category.id);
    const itemIndex = cart.categories[categoryIndex].items.findIndex((i) => i.id === item.id);
    const categoryLen = cart.categories[categoryIndex].items.length;

    setCart((prevCart) => {
      if (item.quantity == 1) {
        if (categoryLen == 1) {
          return {
            ...prevCart,
            categories: [
              ...prevCart.categories.slice(0, categoryIndex),
              ...prevCart.categories.slice(categoryIndex + 1),
            ],
          };
        } else {
          return {
            ...prevCart,
            categories: [
              ...prevCart.categories.slice(0, categoryIndex),
              {
                ...prevCart.categories[categoryIndex],
                items: [
                  ...prevCart.categories[categoryIndex].items.slice(0, itemIndex),
                  ...prevCart.categories[categoryIndex].items.slice(itemIndex + 1),
                ],
              },
              ...prevCart.categories.slice(categoryIndex + 1),
            ],
          };
        }
      } else {
        return {
          ...prevCart,
          categories: [
            ...prevCart.categories.slice(0, categoryIndex),
            {
              ...prevCart.categories[categoryIndex],
              items: [
                ...prevCart.categories[categoryIndex].items.slice(0, itemIndex),
                { ...item, quantity: item.quantity - 1 },
                ...prevCart.categories[categoryIndex].items.slice(itemIndex + 1),
              ],
            },
            ...prevCart.categories.slice(categoryIndex + 1),
          ],
        };
      }
    });
  };

  const handleAddItem = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAddItemOption(false);

    if (newItemCategory === 'new') {
      await addItem(newItemName, newItemNote, newItemImage, newCustomCategory);
    } else {
      await addItem(newItemName, newItemNote, newItemImage, newItemCategory);
    }

    setNewItemName('');
    setNewItemNote('');
    setNewItemImage('');
    setNewItemCategory('');
    setNewCustomCategory('');
  };

  if (selectedItem) {
    return (
      <div className="w-1/4 h-screen flex flex-col gap-8 fixed right-0 px-8 py-8 overflow-y-scroll">
        <button
          onClick={resetSelected}
          className="text-primary font-semibold flex justify-start items-center gap-1"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          back
        </button>

        <div className="flex gap-8 flex-col flex-grow overflow-y-clip shrink-0">
          {selectedItem.image ? (
            <Image
              src={selectedItem.image}
              alt="Product Image"
              width={300}
              height={220}
              objectFit="cover"
              objectPosition="center"
              layout="fixed"
              className="rounded-xl"
            />
          ) : null}

          <div>
            <h2 className="text-smallText">name</h2>
            <p className="font-bold text-xl">{selectedItem.name}</p>
          </div>

          <div>
            <h2 className="text-smallText">category</h2>
            <p className="font-bold text-xl">{selectedItemCategory?.name}</p>
          </div>

          {selectedItem.note ? (
            <div>
              <h2 className="text-smallText">note</h2>
              <p className="font-bold text-xl h-fit">{selectedItem.note}</p>
            </div>
          ) : null}
        </div>

        <div className="flex justify-around">
          <button
            onClick={() => {
              removeItem(selectedItem.id);
              resetSelected();
            }}
            className="font-bold text-xl"
          >
            delete
          </button>
          <button
            className="bg-primary text-white p-4 rounded-lg font-semibold"
            onClick={() => (selectedItemCategory ? addToCart(selectedItemCategory) : null)}
          >
            Add to list
          </button>
        </div>
      </div>
    );
  }

  if (addItemOption) {
    return (
      <div className="w-1/4 bg-mainBg fixed right-0 pr-12 flex flex-col h-screen">
        <h2 className="text-xl font-semibold mt-5 mb-2">Add a new item</h2>
        <form className="flex-grow flex flex-col justify-around" onSubmit={handleAddItem}>
          <div className="flex flex-col md:gap-2 2xl:gap-12 justify-center flex-grow">
            <div>
              <h3 className="font-semibold mb-2">Name</h3>
              <input
                type="text"
                className="border-2 border-borderColor rounded-lg md:py-3 2xl:py-4  pl-4 placeholder:ml-2 placeholder:text-smallText focus:outline-primary w-full"
                name=""
                id=""
                placeholder="Enter a name"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                required
              />
            </div>

            <div>
              <h3 className="font-semibold mb-2">Note (optional)</h3>
              <textarea
                className="border-2 border-borderColor rounded-lg md:py-3 2xl:py-4  pl-4 placeholder:ml-2 placeholder:text-smallText focus:outline-primary w-full resize-none"
                name=""
                id=""
                rows={4}
                placeholder="Enter a note"
                value={newItemNote}
                onChange={(e) => setNewItemNote(e.target.value)}
              ></textarea>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Image (optional)</h3>
              <input
                className="border-2 border-borderColor rounded-lg md:py-3 2xl:py-4  pl-4 placeholder:ml-2 placeholder:text-smallText focus:outline-primary active:outline-primar w-full"
                type="text"
                name=""
                id=""
                placeholder="Enter a url"
                value={newItemImage}
                onChange={(e) => setNewItemImage(e.target.value)}
              />
            </div>

            <div>
              <h3 className="font-semibold mb-2">Category</h3>
              <select
                className="border-2 border-borderColor rounded-lg md:py-3 2xl:py-4 pl-4 placeholder:ml-2 placeholder:text-smallText focus:outline-primary w-full"
                onChange={(e) => setNewItemCategory(e.target.value)}
                required
                value={newItemCategory}
              >
                <option value="" disabled defaultChecked>
                  Select a category
                </option>
                {list.categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
                <option value="new">New one (write below)</option>
              </select>
            </div>

            {newItemCategory === 'new' && (
              <div>
                <h3 className="font-semibold mb-2">New Category</h3>
                <input
                  placeholder="Enter a new category"
                  className="border-2 border-borderColor rounded-lg md:py-3 2xl:py-4 pl-4 placeholder:ml-2 placeholder:text-smallText focus:outline-primary w-full"
                  type="text"
                  onChange={(e) => setNewCustomCategory(e.target.value)}
                  value={newCustomCategory}
                  required
                />
              </div>
            )}
          </div>
          <div className="flex justify-evenly mb-8 mt-4 font-bold">
            <button onClick={() => setAddItemOption(false)}>Cancel</button>
            <button type="submit" className="py-4 px-6 bg-primary text-white rounded-lg">
              Save
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="w-1/4 h-screen bg-primaryBg flex flex-col gap-8 fixed right-0">
      <div className="bg-cardBg flex rounded-3xl gap-2 m-6 mb-0 py-3 px-2">
        <div className="absolute overflow-visible top-2">
          <LoadedImage />
        </div>
        <div className="text-white flex items-center flex-col font-semibold justify-center gap-2 pl-24 text-sm">
          <p>Dint find what you need?</p>
          <button
            className="bg-white text-black p-2 rounded-lg font-bold w-3/4 self-start"
            onClick={() => setAddItemOption(true)}
            disabled={!list}
          >
            Add item
          </button>
        </div>
      </div>
      <div className={`overflow-y-scroll ${styles.hideScrollbar} mx-6 grow`}>
        <div className="font-bold text-xl flex items-center justify-between">
          <h2>{cart ? cart.name : 'Shopping list'}</h2>
          <span className={`material-symbols-outlined ${styles.edit} cursor-pointer text-lg`}>
            edit
          </span>
        </div>
        <div className="flex flex-col mt-4 gap-5">
          {cart &&
            cart.categories.map((category) => (
              <div key={category.id} className="flex flex-col gap-3">
                <h3 className={`text-sm text-smallText font-medium ${styles.trackingInExpand}`}>
                  {category.name}
                </h3>
                {category.items.map((item) => {
                  if (item.id === editId) {
                    return (
                      <div
                        key={item.id}
                        className="flex justify-between items-center font-semibold"
                      >
                        <p>{item.name}</p>
                        <div className="bg-white flex gap-2 items-center p-1 rounded-xl">
                          <button onClick={() => handleRemoveItem(category, item)}>
                            <span className="material-symbols-outlined text-white bg-primary px-2 py-3 rounded-xl">
                              delete_sweep
                            </span>
                          </button>
                          <button
                            className="text-4xl text-primary font-light"
                            onClick={() => handleMinusItem(category, item)}
                          >
                            -
                          </button>
                          <div className="border-2 border-primary rounded-3xl text-primary py-1 px-4">
                            <p>{item.quantity}pcs</p>
                          </div>
                          <button
                            className="text-4xl text-primary font-light"
                            onClick={() => handlePlusItem(category, item)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div
                        key={item.id}
                        className={`flex justify-between items-center font-semibold ${styles.fadeIn}`}
                      >
                        <p>{item.name}</p>
                        <button
                          className="border-2 border-primary rounded-3xl text-primary py-1 px-4"
                          onClick={() => setEditId(item.id)}
                        >
                          <p>{item.quantity}pcs</p>
                        </button>
                      </div>
                    );
                  }
                })}
              </div>
            ))}
        </div>
      </div>
      <div className="bg-white h-32 flex items-center justify-center">
        <div className="relative w-full mx-5">
          <input
            type="text"
            className="border-2 border-primary rounded-lg px-5 py-3 placeholder:text-smallText placeholder:text-sm w-full outline-none focus:border-4"
            placeholder="Enter a name"
          />
          <button className="absolute right-0 bg-primary text-white h-full rounded-lg px-5">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
export default RightSidebar;
