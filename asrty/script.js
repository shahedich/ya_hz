const U = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=80`;

const menu = [
  { id: 1, name: "Еспресо", desc: "Насичений, з легкою кислинкою", price: 65, img: U("photo-1510707577719-ae7c14805e3a") },
  { id: 2, name: "Капучино", desc: "Шовковиста пінка та подвійний шот", price: 95, img: U("photo-1572442388796-11668a67e53d") },
  { id: 3, name: "Лате", desc: "М'який, з ніжним молоком", price: 105, img: U("photo-1495474472287-4d71bcdd2085") },
  { id: 4, name: "Колд брю", desc: "12 годин холодної екстракції", price: 110, img: U("photo-1461023058943-07fcbe16d735") },
  { id: 5, name: "Круасан", desc: "Масляний, випечений щоранку", price: 85, img: U("photo-1555507036-ab1f4038808a") },
  { id: 6, name: "Чізкейк", desc: "Класичний, з ягідним соусом", price: 130, img: U("photo-1533134242443-d4fd215305ad") },
];

const cart = {};
const grid = document.getElementById("menuGrid");
const list = document.getElementById("cartList");
const totalEl = document.getElementById("total");
const msg = document.getElementById("msg");

grid.innerHTML = menu.map((m) => `
  <article class="card">
    <img src="${m.img}" alt="${m.name}" loading="lazy" onerror="this.style.visibility='hidden'">
    <div class="card-body">
      <h3>${m.name}</h3>
      <p>${m.desc}</p>
      <div class="card-bottom">
        <span class="price">${m.price} ₴</span>
        <button class="add" data-id="${m.id}">Додати</button>
      </div>
    </div>
  </article>`).join("");

grid.addEventListener("click", (e) => {
  const btn = e.target.closest(".add");
  if (!btn) return;
  const id = btn.dataset.id;
  cart[id] = (cart[id] || 0) + 1;
  render();
});

list.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const id = btn.dataset.id;
  cart[id] += btn.dataset.d === "+" ? 1 : -1;
  if (cart[id] <= 0) delete cart[id];
  render();
});

function render() {
  const ids = Object.keys(cart);
  if (!ids.length) {
    list.innerHTML = '<li class="empty">Додайте позиції з меню</li>';
    totalEl.textContent = "0 ₴";
    return;
  }
  let total = 0;
  list.innerHTML = ids.map((id) => {
    const item = menu.find((m) => m.id == id);
    total += item.price * cart[id];
    return `<li><span>${item.name}</span>
      <span class="qty">
        <button data-id="${id}" data-d="-" aria-label="Менше">−</button>
        <span>${cart[id]}</span>
        <button data-id="${id}" data-d="+" aria-label="Більше">+</button>
      </span>
      <strong>${item.price * cart[id]} ₴</strong></li>`;
  }).join("");
  totalEl.textContent = total + " ₴";
}

document.getElementById("orderForm").addEventListener("submit", (e) => {
  e.preventDefault();
  if (!Object.keys(cart).length) {
    msg.textContent = "Спочатку додайте щось із меню.";
    return;
  }
  const name = new FormData(e.target).get("name");
  msg.textContent = `Дякуємо, ${name}! Ваше замовлення прийнято.`;
  for (const k in cart) delete cart[k];
  render();
  e.target.reset();
});