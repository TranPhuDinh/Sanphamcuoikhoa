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

// callCategoriesApi();

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
    })
    .catch((error) => {
      // handle error
      console.log(error);
    });
}

callProductsApi();

// support functions -------------------------------------------------
function create_category_item(category) {
  // create category item
  const col = document.createElement("div");
  col.className = "col";
  col.textContent = category.Name;
  return col;
}

function create_category_children_list() {}

function create_product_item(product) {
  // create product item
  const article = document.createElement("article");
  article.className = "product";

  const img = document.createElement("img");
  img.src = product.DefaultProductImage;
  img.alt = product.DisplayName;
  article.appendChild(img);

  const product_info = document.createElement("div");
  product_info.className = "product-info";

  const h2 = document.createElement("h2");
  h2.textContent = product.DisplayName;
  product_info.appendChild(h2);

  const p = document.createElement("p");
  p.innerHTML = product.Description;
  product_info.appendChild(p);

  const price = document.createElement("div");
  price.className = "price";
  price.style = "display: flex; justify-content: space-between;";
  price.innerHTML = `<strong>$${product.ListPrice}</strong> <s>${product.OriginalPrice}</s>`;
  product_info.appendChild(price);

  const btn = document.createElement("button");
  btn.className = "btn btn-primary";
  btn.id = product.ItemCode;
  btn.textContent = "Thêm vào giỏ";
  product_info.appendChild(btn);

  article.appendChild(product_info);

  return article;
}
