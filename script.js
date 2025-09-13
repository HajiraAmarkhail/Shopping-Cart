// ======= Product Data =======
// Array of product objects with id, name, price, and image
const products = [
    { id: 1, name: "Laptop", price: 1999, images: [ "img/loptoppink.jpg", "img/loptop2.jpg" , "img/loptop3.jpg"] },
    { id: 2, name: "Phone", price: 1199, images: ["img/iphone.jpg", "img/iphone2.jpeg", "img/iphone3.jpeg"] },
    { id: 3, name: "Ipad", price: 790, images: [ "img/ipad2.jpeg" ,"img/ipad3.jpeg" ]},
    { id: 4, name: "Headphones", price: 350, images: ["img/headphone.jpg" ]},
    { id: 5, name: "Smartwatch", price: 450, images: ["img/applewatch.jpg"] },
    { id: 6, name: "Cover", price: 20, images: ["img/cover.jpg", "img/cover2.jpeg","img/cover3.jpeg" ]},
    { id: 7, name: "Airpod", price: 299, images: ["img/airpod.jpg" ]},
  ];
  
  // ======= Cart Initialization =======
  // Load cart from localStorage or start with an empty array
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  
  // ======= Display Products =======
  // Function to dynamically show products on the page
  // Accepts an optional array for search filtering
  const displayProducts = (productArray = products) => {
    const productList = document.getElementById("product-list");
    productList.innerHTML = "";
  
    productArray.forEach(product => {
      const productDiv = document.createElement("div");
      productDiv.classList.add("product");
      productDiv.innerHTML = `
        <img src="${product.images[0]}" alt="${product.name}" width="100" class="product-img">
        <h3>${product.name}</h3>
        <p>Price: $${product.price}</p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
      `;
      productList.appendChild(productDiv);
  
      // Click event to open modal
      const img = productDiv.querySelector(".product-img");
      img.addEventListener("click", () => openImageModal(product));
    });
  };
  
  
  // ======= Add to Cart =======
  // Function to add a product to the cart
  const addToCart = (id) => {
    const product = products.find(p => p.id === id); // Find product by id
    const cartItem = cart.find(item => item.id === id); // Check if already in cart
  
    if (cartItem) {
      cartItem.quantity += 1; // Increase quantity if already in cart
    } else {
      cart.push({ ...product, quantity: 1 }); // Add new product with quantity 1
    }
  
    updateCart();        // Update cart display
    showSuccessMessage(); // Show success message
  };
  
  // ======= Update Cart =======
  // Function to render the cart on the page
  const updateCart = () => {
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    cartItems.innerHTML = ""; // Clear existing cart items
  
    // Loop through cart and create list items
    cart.forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${item.name} - $${item.price} x ${item.quantity} = $${item.price * item.quantity}
        <button onclick="changeQuantity(${item.id}, 1)">+</button>
        <button onclick="changeQuantity(${item.id}, -1)">-</button>
        <button onclick="removeFromCart(${item.id})">Remove</button>
      `;
      cartItems.appendChild(li);
    });
  
    // Calculate total using reduce
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotal.textContent = total;
  
    // Save cart to localStorage to persist after page refresh
    localStorage.setItem("cart", JSON.stringify(cart));
  };
  
  // ======= Change Quantity =======
  // Function to increase or decrease quantity of a cart item
  const changeQuantity = (id, delta) => {
    const cartItem = cart.find(item => item.id === id);
    if (!cartItem) return;
  
    cartItem.quantity += delta;
    if (cartItem.quantity <= 0) removeFromCart(id); // Remove if quantity <= 0
    updateCart(); // Update cart display
  };
  
  // ======= Remove Item =======
  // Function to remove a product from the cart
  const removeFromCart = (id) => {
    cart = cart.filter(item => item.id !== id); // Keep only items not matching id
    updateCart(); // Update cart display
  };
  
  // ======= Clear Cart =======
  // Button click to empty the cart
  document.getElementById("clear-cart").addEventListener("click", () => {
    cart = [];       // Clear array
    updateCart();    // Update display
  });
  
  // ======= Success Message =======
  // Show a temporary message when a product is added to the cart
  const showSuccessMessage = () => {
    const message = document.getElementById("success-message");
    message.style.display = "block"; // Show message
    setTimeout(() => {
      message.style.display = "none"; // Hide after 1.5 seconds
    }, 5000);
  };
  
  // ======= Search Products =======
  // Filter products based on search input
  const searchInput = document.getElementById("search");
  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm)
    );
    displayProducts(filteredProducts); // Show filtered products
  });
  
  // ======= Initial Render =======
  // Display products and cart when page loads
  displayProducts();
  updateCart();
  



  // Checkout button event with modal
document.getElementById("checkout").addEventListener("click", () => {
  const total = document.getElementById("cart-total").textContent;
  const modal = document.getElementById("checkout-modal");
  const message = document.getElementById("checkout-message");

  if (total === "0") {
      message.textContent = "🛒 Your cart is empty! Add some goodies first 💕";
  } else {
      message.textContent = "✨ Thank you for shopping with us! 💖 Your total is $" + total + ".";
  }

  modal.style.display = "flex"; // show modal
});

// Close modal on X click
document.querySelector(".close-btn").addEventListener("click", () => {
  document.getElementById("checkout-modal").style.display = "none";
});

// Close modal on outside click
window.addEventListener("click", (e) => {
  const modal = document.getElementById("checkout-modal");
  if (e.target === modal) {
      modal.style.display = "none";
  }
});


// Function to create floating hearts/sparkles
function createFloatingEmoji(container) {
  const emojiTypes = ["💖", "✨", "💝", "🌸"];
  const emoji = document.createElement("span");
  emoji.className = Math.random() > 0.5 ? "heart" : "sparkle";
  emoji.textContent = emojiTypes[Math.floor(Math.random() * emojiTypes.length)];

  // Random horizontal position
  emoji.style.left = Math.random() * 90 + "%";
  container.appendChild(emoji);

  // Remove after animation ends
  setTimeout(() => emoji.remove(), 3000);
}

// Trigger hearts/sparkles when modal opens
document.getElementById("checkout").addEventListener("click", () => {
  const modal = document.getElementById("checkout-modal");
  const heartsContainer = modal.querySelector(".hearts");

  // Create multiple floating emojis
  for (let i = 0; i < 8; i++) {
      setTimeout(() => createFloatingEmoji(heartsContainer), i * 300);
  }
});

// Image Modals 

let currentImages = [];
let currentIndex = 0;

function openImageModal(product) {
  currentImages = product.images;
  currentIndex = 0;
  const modal = document.getElementById("image-modal");
  const modalImg = document.getElementById("modal-img");
  modalImg.src = currentImages[currentIndex];
  modal.style.display = "flex";
}

document.getElementById("close-modal").addEventListener("click", () => {
  document.getElementById("image-modal").style.display = "none";
});

document.getElementById("prev-img").addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
  document.getElementById("modal-img").src = currentImages[currentIndex];
});

document.getElementById("next-img").addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % currentImages.length;
  document.getElementById("modal-img").src = currentImages[currentIndex];
});

// Close modal by clicking outside image
window.addEventListener("click", (e) => {
  const modal = document.getElementById("image-modal");
  if (e.target === modal) modal.style.display = "none";
});
