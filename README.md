# Product List Page with Cart Drawer

## Time spent
I worked on this over around 2 days. It took some time to figure out the cart logic, UI updates, and getting the drawer + state flow working properly together.

---

## What I built
This is a simple product listing page made using only HTML, CSS, and vanilla JavaScript.

Main things included:
- Product grid rendered from JS data
- Variant selection for each product
- Add to cart functionality with quantity handling
- Cart drawer that slides in from the side
- Live cart count in the header
- Subtotal calculation in cart
- Toast message when item is added
- Basic responsive layout

---

## What I would improve if I had more time
- Add smoother animations for drawer open/close and toast
- Improve UI spacing and overall polish a bit more
- Handle edge cases more cleanly (like no variant selected)
- Improve accessibility (keyboard focus inside drawer etc.)
- Refactor some repeated render logic if this scales further

---

## If I had to persist cart across refresh
Right now everything is in memory using a Map.

If I had to persist it, I would store it in localStorage.

Since Map cannot be stored directly, I would convert it into a normal object or array before saving, and then rebuild the Map when the page loads.

One issue I think would come up is keeping the stored cart in sync with updated product data (like price or variant changes). That would need some kind of validation step when loading cart back.

---

## How I think this would change in a Shopify-like environment
Most of the structure would stay same like:
- Vanilla JS module pattern
- Central state object
- Event delegation for clicks
- Render based updates instead of direct DOM manipulation

But data would not be hardcoded — it would come from backend / Liquid variables.

Also cart would not be just in memory — it would likely integrate with actual cart APIs.

CSS isolation would also be more important because it runs inside existing theme pages.

---

## Note
Built without any frameworks or external libraries, just vanilla JS as required.
