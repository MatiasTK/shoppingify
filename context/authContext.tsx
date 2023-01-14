import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase/init';
import {
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { List } from '../components/Homepage';
import { v4 as uuidv4 } from 'uuid';

type authProviderProps = {
  children: React.ReactNode;
};

type userContext = {
  user: null | User;
  userData: List | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  registerWithEmailAndPassword: (email: string, password: string) => Promise<void>;
  loginWithEmailAndPassword: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  authStatus: string;
  getUserData: () => Promise<void>;
  addItem: (
    itemName: string,
    itemNote: string,
    itemImage: string,
    categoryName: string
  ) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
};

const authContext = createContext<userContext>({
  user: null,
  userData: null,
  loading: true,
  loginWithGoogle: async () => {},
  registerWithEmailAndPassword: async () => {},
  loginWithEmailAndPassword: async () => {},
  logout: async () => {},
  authStatus: 'Ok',
  getUserData: async () => {},
  addItem: async () => {},
  removeItem: async () => {},
});

export function AuthProvider({ children }: authProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<List | null>(null);
  const [loading, setLoading] = useState(true);
  const [authStatus, setAuthStatus] = useState<string>('Ok');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();

    setPersistence(auth, browserLocalPersistence);
    const res = await signInWithPopup(auth, provider);
    setUser(res.user);
    setAuthStatus('Ok');
  };

  const registerWithEmailAndPassword = async (email: string, password: string) => {
    try {
      setPersistence(auth, browserLocalPersistence);
      const res = await createUserWithEmailAndPassword(auth, email, password);
      setUser(res.user);
      setAuthStatus('Ok');
    } catch (error) {
      console.error(error);
      if (error instanceof FirebaseError) {
        const errorCode = error.code;
        setAuthStatus(errorCode);
      }
    }
  };

  const loginWithEmailAndPassword = async (email: string, password: string) => {
    try {
      setPersistence(auth, browserLocalPersistence);
      const res = await signInWithEmailAndPassword(auth, email, password);
      setUser(res.user);
      setAuthStatus('Ok');
    } catch (error) {
      console.error(error);
      if (error instanceof FirebaseError) {
        const errorCode = error.code;
        setAuthStatus(errorCode);
      }
    }
  };

  const logout = async () => {
    await auth.signOut();
    setUser(null);
  };

  const getUserData = async () => {
    if (!user) {
      return;
    }

    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setUserData(docSnap.data().lists[0]);
    }
  };

  const checkIfCategoryExists = (categoryName: string) => {
    const exists = userData!.categories.find((category) => category.name === categoryName);

    if (exists) {
      return true;
    }

    return false;
  };

  const addItem = async (
    itemName: string,
    itemNote: string,
    itemImage: string,
    categoryName: string
  ) => {
    if (!user) {
      return;
    }

    if (!userData) {
      await getUserData();
      return;
    }

    if (!checkIfCategoryExists(categoryName)) {
      setUserData((prevData) => {
        if (!prevData) {
          return null;
        }

        const newData = { ...prevData };

        newData.categories.push({
          name: categoryName,
          id: uuidv4(),
          items: [
            {
              id: uuidv4(),
              name: itemName,
              note: itemNote,
              image: itemImage,
              quantity: 0,
            },
          ],
        });

        return newData;
      });

      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { lists: [userData] }, { merge: false });
      return;
    }

    setUserData((prevData) => {
      if (!prevData) {
        return null;
      }

      const newData = { ...prevData };

      newData.categories.forEach((category) => {
        if (category.name === categoryName) {
          category.items.push({
            id: uuidv4(),
            name: itemName,
            note: itemNote,
            image: itemImage,
            quantity: 0,
          });
        }

        return category;
      });

      return newData;
    });

    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, { lists: [userData] }, { merge: false });
  };

  const removeItem = async (itemId: string) => {
    if (!userData || !user) {
      return;
    }

    const newData = { ...userData };

    newData.categories.forEach((category) => {
      category.items = category.items.filter((item) => item.id !== itemId);
    });

    newData.categories = newData.categories.filter((category) => category.items.length > 0);

    setUserData(newData);

    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, { lists: [newData] }, { merge: false });
  };

  return (
    <authContext.Provider
      value={{
        user,
        userData,
        loading,
        loginWithGoogle,
        registerWithEmailAndPassword,
        loginWithEmailAndPassword,
        logout,
        authStatus,
        getUserData,
        addItem,
        removeItem,
      }}
    >
      {children}
    </authContext.Provider>
  );
}

export const useAuth = () => useContext(authContext);
