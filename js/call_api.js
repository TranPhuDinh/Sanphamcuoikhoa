// call api (https://rapidapi.com/apidojo/api/forever21/)
async function callCategoriesApi() {
  // get list of categories
  const ui_list = document.getElementById("categories_list");
  // call api
  await fetch(
    "https://apidojo-forever21-v1.p.rapidapi.com/categories/v2/list",
    {
      method: "GET",
      headers: {
        "x-rapidapi-key": "045843d499mshc419aa052b4cdf7p12177bjsn8df1b409cbeb",
        "x-rapidapi-host": "apidojo-forever21-v1.p.rapidapi.com",
      },
    }
  )
    .then((response) => {
      // get response (chuyen kieu du lieu tu json => js type)
      return response.json();
    })
    .then((data) => {
      // load data on UI
      const categories = data.menuItemList[0].ChildMenus;
      categories.forEach((category) => {
        ui_list.appendChild(create_category_item(category));
      });
    })
    .catch((error) => {
      // handle error
      console.log(error);
    });
}

// call products api
async function callProductsApi() {
  // get list of categories
  const ui_list = document.getElementById("products_list");
  // call api
  await fetch(
    "https://apidojo-forever21-v1.p.rapidapi.com/products/v2/list?pageSize=10&pageNumber=1&sortby=0&category=new",
    {
      method: "GET",
      headers: {
        "x-rapidapi-key": "045843d499mshc419aa052b4cdf7p12177bjsn8df1b409cbeb",
        "x-rapidapi-host": "apidojo-forever21-v1.p.rapidapi.com",
      },
    }
  )
    .then((response) => {
      // get response (chuyen kieu du lieu tu json => js type)
      return response.json();
    })
    .then((data) => {
      // load data on UI
      const product = data.CatalogProducts;
      product.forEach((product) => {
        ui_list.appendChild(create_product_item(product));
      });
      
      // Initialize add to cart buttons after products are loaded
      if (typeof setupAddToCartButtons === 'function') {
        setupAddToCartButtons();
      }
    })
    .catch((error) => {
      // handle error
      console.log(error);
      
      // If API fails, load some sample products
      loadSampleProducts();
    });
}

// Load sample products if API fails
function loadSampleProducts() {
  const ui_list = document.getElementById("products_list");
  if (!ui_list) return;
  
  const sampleProducts = [
    {
      ItemCode: "prod1",
      DisplayName: "Áo thun basic",
      Description: "Áo thun cotton chất lượng cao",
      DefaultProductImage: "/api/placeholder/300/300",
      ListPrice: "15.99",
      OriginalPrice: "$19.99"
    },
    {
      ItemCode: "prod2",
      DisplayName: "Quần jean nam",
      Description: "Quần jean nam cao cấp",
      DefaultProductImage: "/api/placeholder/300/300",
      ListPrice: "29.99",
      OriginalPrice: "$39.99"
    },
    {
      ItemCode: "prod3",
      DisplayName: "Váy nữ mùa hè",
      Description: "Váy nữ thời thượng",
      DefaultProductImage: "/api/placeholder/300/300",
      ListPrice: "24.99",
      OriginalPrice: "$34.99"
    }
  ];
  
  sampleProducts.forEach(product => {
    ui_list.appendChild(create_product_item(product));
  });
  
  // Initialize add to cart buttons after sample products are loaded
  if (typeof setupAddToCartButtons === 'function') {
    setupAddToCartButtons();
  }
}

// Try to load products when the page loads
document.addEventListener('DOMContentLoaded', function() {
  callProductsApi();
});

// support functions -------------------------------------------------
function create_category_item(category) {
  // create category item
  const col = document.createElement("div");
  col.className = "col";
  col.textContent = category.Name;
  return col;
}

function create_product_item(product) {
  // create product item
  const article = document.createElement("article");
  article.className = "product";

  const img = document.createElement("img");
  img.src = product.DefaultProductImage;
  img.alt = product.DisplayName