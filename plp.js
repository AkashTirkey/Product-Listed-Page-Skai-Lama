//IIFE - IMMEDIATELY INVOKED FUNCTION EXPRESSION!
(function () {
  //step1 - Double Guard check

  //check if script already loaded or not if yes return immediately if THEN no mark it true.
  if (window.__plpLoaded) return;
  window.__plpLoaded = true;

  var plp = {
    state: {
      products: [],
      cart: new Map(),
      isDrawerOpen: false,
    },

    selectors: {
      gridMount: "[data-grid-mount]",
      cartCount: "[data-cart-count]",
      drawer: "[data-drawer]",
      drawerBody: ".plpDrawerBody",
      cartBtn: ".plpCartBtn",
      cartSubtotal: "[data-cart-subtotal]",
      toast: "[data-toast]",
    },

    init: function () {
      // load full object
      console.log("Full Data", window.shopifyLiquidValuesPLP);

      //load products
      console.log("Products:", window.shopifyLiquidValuesPLP.products);

      //assign to state
      plp.state.products = window.shopifyLiquidValuesPLP.products;

      console.log("Products:", plp.state.products);

      //trigger render
      plp.render();

      document
        .querySelector(plp.selectors.gridMount)
        .addEventListener("click", function (e) {
          //ignore if not add button
          if (!e.target.closest(".plpBtn")) return;

          //find product card
          var card = e.target.closest(".plpCard");

          //get product id from dataset
          var productId = card.dataset.productId;

          //get selected variant
          var select = card.querySelector(".plpVariantSelect");
          var variantId = select.value;

          //create cart key
          var key = productId + "::" + variantId;

          var cart = plp.state.cart;

          //update Map
          if (cart.has(key)) {
            cart.get(key).qty += 1;
          } else {
            // cart.set(key, {
            //   productId: productId,
            //   variantId: variantId,
            //   qty: 1,
            // });
            //find product from state
            var product = plp.state.products.find(function (p) {
              return p.id == productId;
            });

            //find selected variant
            var variant = product.variants.find(function (v) {
              return v.id == variantId;
            });

            cart.set(key, {
              productId: product.id,
              variantId: variantId,
              title: product.title,
              variantTitle: variant.title,
              price: product.price,
              qty: 1,
            });
          }

          //debug
          console.log("Cart state:", plp.state.cart);

          //update UI
          plp.rendercartCount();
          plp.renderDrawer();
          plp.renderSubtotal();
          plp.showToast();
        });

      // cart button click
      document
        .querySelector(plp.selectors.cartBtn)
        .addEventListener("click", function () {
          plp.openDrawer();
        });

      // Cart close button click
      document
        .querySelector(".plpDrawerClose")
        .addEventListener("click", function () {
          plp.closeDrawer();
        });

      //ESc key support
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && plp.state.isDrawerOpen) {
          plp.closeDrawer();
        }
      });

      //drawer controls(-/+)
      document
        .querySelector(plp.selectors.drawerBody)
        .addEventListener("click", function (e) {
          var btn = e.target;

          // only handle buttons
          if (btn.tagName !== "BUTTON") return;

          var key = btn.dataset.key;
          if (!key) return;

          var cart = plp.state.cart;
          var item = cart.get(key);

          // PLUS
          if (btn.textContent === "+") {
            item.qty += 1;
          }

          // MINUS
          if (btn.textContent === "-") {
            item.qty -= 1;

            if (item.qty <= 0) {
              cart.delete(key);
            }
          }

          if (btn.textContent === "Remove") {
            cart.delete(key);
          }

          // re-render UI
          plp.renderDrawer();
          plp.rendercartCount();
          plp.renderSubtotal();
        });
    },

    render: function () {
      var root = document.querySelector(plp.selectors.gridMount);
      root.innerHTML = "";

      plp.state.products.forEach(function (product) {
        // CARD
        var card = document.createElement("div");
        card.className = "plpCard";
        card.dataset.productId = product.id;

        // IMAGE
        var img = document.createElement("img");
        img.className = "plpCardImg";
        img.src = product.image;
        img.alt = product.title;

        // INFO WRAPPER
        var info = document.createElement("div");
        info.className = "plpCardInfo";

        // TITLE
        var title = document.createElement("div");
        title.className = "plpCardTitle";
        title.textContent = product.title;

        // CATEGORY
        var category = document.createElement("div");
        category.className = "plpCardCategory";
        category.textContent = product.product_type;

        // PRICE
        var price = document.createElement("div");
        price.className = "plpCardPrice";

        var formattedPrice = "₹" + product.price / 100;

        if (product.compare_at_price) {
          var compare = document.createElement("span");
          compare.style.textDecoration = "line-through";
          compare.style.marginLeft = "8px";
          compare.textContent = "₹" + product.compare_at_price / 100;

          price.textContent = formattedPrice;
          price.appendChild(compare);
        } else {
          price.textContent = formattedPrice;
        }

        // VARIANT SELECT
        var select = document.createElement("select");
        select.className = "plpVariantSelect";

        var defaultOption = document.createElement("option");
        defaultOption.textContent = "Select Variant";
        defaultOption.value = "";
        select.appendChild(defaultOption);

        product.variants.forEach(function (variant) {
          var option = document.createElement("option");
          option.textContent = variant.title;
          option.value = variant.id;
          select.appendChild(option);
        });

        // BUTTON
        var btn = document.createElement("button");
        btn.className = "plpBtn";
        btn.textContent = "Add";

        // ASSEMBLE
        info.appendChild(title);
        info.appendChild(category);
        info.appendChild(price);
        info.appendChild(select);
        info.appendChild(btn);

        card.appendChild(img);
        card.appendChild(info);

        root.appendChild(card);
      });
    },

    rendercartCount: function () {
      var cart = plp.state.cart;
      var total = 0;

      cart.forEach(function (item) {
        total += item.qty;
      });

      var el = document.querySelector(plp.selectors.cartCount);
      el.textContent = total;

      // plp.rendercartCount();
    },

    openDrawer: function () {
      var drawer = document.querySelector(plp.selectors.drawer);
      drawer.style.display = "block";
      plp.state.isDrawerOpen = true;

      plp.renderDrawer();
    },

    closeDrawer: function () {
      var drawer = document.querySelector(plp.selectors.drawer);
      drawer.style.display = "none";
      plp.state.isDrawerOpen = false;
    },
    showToast: function () {
      var el = document.querySelector(plp.selectors.toast);

      el.style.display = "block";

      setTimeout(function () {
        el.style.display = "none";
      }, 1500);
    },

    renderDrawer: function () {
      var body = document.querySelector(plp.selectors.drawerBody);
      body.innerHTML = "";
      var cart = plp.state.cart;

      if (cart.size === 0) {
        var empty = document.createElement("div");
        empty.textContent = "Your cart is empty";
        body.appendChild(empty);
        return;
      }

      cart.forEach(function (item, key) {
        var row = document.createElement("div");
        row.className = "plpCartRow";

        // Title
        var title = document.createElement("div");
        title.textContent = item.title;

        // variant
        var variant = document.createElement("div");
        variant.textContent = "Variant: " + item.variantTitle;

        //Controls WRAPPER
        var controls = document.createElement("div");
        controls.className = "plpQtyControls";

        //Minus
        var minus = document.createElement("button");
        minus.textContent = "-";
        minus.dataset.key = key;

        // Qty
        var qty = document.createElement("span");
        qty.textContent = item.qty;

        // Plus
        var plus = document.createElement("button");
        plus.textContent = "+";
        plus.dataset.key = key;

        //Remove
        var remove = document.createElement("button");
        remove.textContent = "Remove";
        remove.dataset.key = key;

        controls.appendChild(minus);
        controls.appendChild(qty);
        controls.appendChild(plus);
        controls.appendChild(remove);

        row.appendChild(title);
        row.appendChild(variant);
        row.appendChild(controls);

        body.appendChild(row);
      });
    },
    renderSubtotal: function () {
      var cart = plp.state.cart;
      var total = 0;

      cart.forEach(function (item) {
        total += item.price * item.qty;
      });

      var el = document.querySelector(plp.selectors.cartSubtotal);
      el.textContent = "₹" + total / 100;
    },
  };

  plp.init();
})();
