/* ============================================================
   CARRITO + PRODUCTOS + MENU HAMBURGUESA
============================================================ */

// --- Variables ---
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const carritoLista = document.getElementById("carrito-lista");
const carritoCount = document.getElementById("carrito-count");
const btnCarrito = document.getElementById("btn-carrito");
const modalCarrito = new bootstrap.Modal(document.getElementById("modalCarrito"));

// --- Formato de precio ---
function formatoPrecio(valor) {
  return "$" + valor.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// --- Guardar carrito ---
function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// --- Render carrito ---
function renderCarrito() {
  carritoLista.innerHTML = "";

  carrito.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between";

    li.innerHTML = `
      ${item.name} - ${formatoPrecio(item.price)}
      <button class="btn btn-sm btn-danger" onclick="eliminarItem(${index})">X</button>
    `;

    carritoLista.appendChild(li);
  });
}

// --- Eliminar item ---
function eliminarItem(index) {
  carrito.splice(index, 1);
  guardarCarrito();
  actualizarContador();
  renderCarrito();
}

// --- Contador ---
function actualizarContador() {
  carritoCount.textContent = carrito.length;
}

// --- Abrir carrito ---
btnCarrito.addEventListener("click", () => {
  modalCarrito.show();
});

// --- Vaciar carrito ---
document.getElementById("vaciar-carrito").addEventListener("click", () => {
  carrito = [];
  guardarCarrito();
  actualizarContador();
  renderCarrito();
});

// ======================================================
//               CARGA DE PRODUCTOS JSON
// ======================================================
document.addEventListener("DOMContentLoaded", () => {
  cargarProductos();
  actualizarContador();
  renderCarrito();
});

function cargarProductos() {
  fetch("./productos.json")
    .then(response => response.json())
    .then(productos => {
      const container = document.getElementById("cards-container");
      container.innerHTML = "";

      productos.forEach(producto => {
        const div = document.createElement("div");
        div.className = "producto";

        div.innerHTML = `
          <img src="${producto.img}" alt="${producto.name}">
          <div class="productocardcontenido">
            <h3>${producto.name}</h3>
            <p>${producto.description}</p>
            <p class="precio">${formatoPrecio(producto.price)}</p>

            <button class="btn-agregar"
              data-name="${producto.name}"
              data-price="${producto.price}"
              data-img="${producto.img}">
              Agregar al carrito
            </button>
          </div>
        `;

        container.appendChild(div);
      });
    })
    .catch(error => console.error("Error cargando productos:", error));
}

// --- Evento agregar producto ---
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-agregar")) {

    const btn = e.target;

    const producto = {
      name: btn.dataset.name,
      price: parseInt(btn.dataset.price),
      img: btn.dataset.img
    };

    carrito.push(producto);
    guardarCarrito();
    actualizarContador();
    renderCarrito();
  }
});

// ======================================================
//                 MENÚ HAMBURGUESA
// ======================================================
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});
