import { firestore } from "../firebase.js";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  query,
  where,
  addDoc,
  updateDoc,
  arrayUnion,
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore-lite.js";

///////////////////////////////////////////////////////
// CART MODEL & FUNCTIONS
///////////////////////////////////////////////////////

// Constructor for simplified cart record
// export function CartItem(productId, quantity) {
//   return {
//     productId: productId,
//     quantity: quantity,
//   };
// }
export function Cart(email, products) {
  this.created_by = email;
  this.created_at = new Date().toISOString();
  this.products = products; // array of { productId, qty }
  return { ...this };
}

// Get cart by user email
export async function getCartByEmail(email) {
  const cartRef = doc(firestore, "carts", email);
  const cartSnap = await getDoc(cartRef);

  if (cartSnap.exists()) {
    return cartSnap.data();
  } else {
    const newCart = {
      created_by: email,
      created_at: new Date().toISOString(),
      products: [],
    };
    await setDoc(cartRef, newCart);
    return newCart;
  }
}

// Add product to cart
export async function addToCart(email, productId) {
  const cartRef = doc(firestore, "carts", email);
  const cart = await getCartByEmail(email);
  const products = cart.products || [];
  console.log(products);

  const existingProduct = products.find((p) => p.productId === productId);

  if (existingProduct) {
    // Update qty
    const updatedProducts = products.map((p) =>
      p.productId === productId ? { ...p, qty: p.qty + 1 } : p
    );
    await setDoc(cartRef, { products: updatedProducts }, { merge: true });
  } else {
    // Add new product
    await updateDoc(cartRef, {
      products: arrayUnion({ productId, qty: 1 }),
    });
  }
}

// ✅ Fix: Remove item from cart using `products`
export async function removeFromCart(email, productId) {
  const cart = await getCartByEmail(email);
  const updatedProducts = cart.products.filter(
    (product) => product.productId !== productId
  );
  await setDoc(
    doc(firestore, "carts", email),
    { products: updatedProducts },
    { merge: true }
  );
}

// ✅ Fix: Clear cart using `products`
export async function clearCart(email) {
  await setDoc(
    doc(firestore, "carts", email),
    { products: [] },
    { merge: true }
  );
}

// ✅ NEW: Increase quantity (max 10)
export async function increaseQty(email, productId) {
  const cartRef = doc(firestore, "carts", email);
  const cart = await getCartByEmail(email);
  const products = cart.products || [];

  const updatedProducts = products.map((product) => {
    if (product.productId === productId) {
      return {
        ...product,
        qty: Math.min(product.qty + 1, 10), // cap at 10
      };
    }
    return product;
  });

  await setDoc(cartRef, { products: updatedProducts }, { merge: true });
}

// ✅ NEW: Decrease quantity (remove if qty <= 0)
export async function decreaseQty(email, productId) {
  const cartRef = doc(firestore, "carts", email);
  const cart = await getCartByEmail(email);
  const products = cart.products || [];

  const updatedProducts = products
    .map((product) => {
      if (product.productId === productId) {
        return {
          ...product,
          qty: product.qty - 1,
        };
      }
      return product;
    })
    .filter((product) => product.qty > 0); // remove if qty <= 0

  await setDoc(cartRef, { products: updatedProducts }, { merge: true });
}
