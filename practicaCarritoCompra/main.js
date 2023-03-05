document.addEventListener('DOMContentLoaded', () => {


//CONTSTANTES Y DOM
const cardContainer = document.querySelector('#cardContainer');

const borrarCarritoButton = document.getElementById("borrar-carrito");


//alert('funciona')

///EVENTOS

//evento click para boton compra
 //evento click para carrito
 //evento click para




 // Obtener el botón y el contenedor del card
const carrito = document.getElementById("movida");
const tablaContainer = document.getElementById("tabla-container");

// Agregar un event listener al botón para que al hacer clic se muestre u oculte el card-container y la tabla-container
carrito.addEventListener("click", function() {
  // Si ambos contenedores están ocultos, los mostramos
  if (tablaContainer.style.display === "none") {
   
    tablaContainer.style.display = "block";
  // Si ambos contenedores están mostrados, los ocultamos
  } else {
    
    tablaContainer.style.display = "none";
  }
});

/////FUNCIONES

  // función para pintar estrellas
const pintarEstrellas = async(rating, card) => {
  const estrellaAmarilla = 'star1.png';
  const estrellaGris = 'star2.png';
  const estrellasContainer = document.createElement('div');
  estrellasContainer.classList.add('estrellas-container');
  for (let i = 1; i <= 5; i++) {
    const estrella = document.createElement('img');
    estrella.src = i <= Math.ceil(rating) ? estrellaAmarilla : estrellaGris;
    estrella.alt = `estrella ${i}`;
    estrellasContainer.append(estrella);
  }
  card.append(estrellasContainer);
};

// función para crear tarjeta
const createCard = async () => {
    const productos = await obtenerProductos();
    productos.products.forEach(producto => {
      const card = document.createElement('div');
      card.classList.add('card');
    
      const imagen = document.createElement('img');
      imagen.src = producto.thumbnail;
      imagen.alt = producto.title;
    
      const titulo = document.createElement('h2');
      titulo.textContent = producto.title;
    
      const precio = document.createElement('p');
      precio.textContent = `${producto.price.toLocaleString()} €`;
    
      const boton = document.createElement('button');
      boton.textContent = 'COMPRAR';
      boton.id = `boton-${producto.id}`; // Agrega un id único para cada botón
      boton.addEventListener('click', () => {
        onComprarClick(producto, 1); // Llama a la función onComprarClick() con una cantidad de 1
      });
    
      //const carritoItem = JSON.parse(localStorage.getItem(producto.id));
      // if (carritoItem) {
      //   boton.textContent = `COMPRAR (${carritoItem.cantidad})`; // Actualiza el botón con la cantidad en el carrito para el producto dado
      // }
    
      card.append(imagen, titulo, precio, boton);
      cardContainer.append(card);
      pintarEstrellas(producto.rating, card);
    });
  };

  //funcion boton compra


  

  const onComprarClick = async (producto, cantidad) => {
    addLocal(producto, cantidad); // Agrega el producto al carrito con la cantidad dada
  //   const carritoItem = JSON.parse(localStorage.getItem(producto.id));
  //   const boton = document.querySelector(`#boton-${producto.id}`);
  //  boton.textContent = `COMPRAR (${carritoItem.cantidad})`; // Actualiza el botón con la cantidad en el carrito para el producto dado
    rellenarTabla(); // Actualiza la tabla del carrito
  };
  

  //funcion pintar tabla
  const rellenarTabla = () => {
    const tabla = document.getElementById("tabla");
   
    const tbody = tabla.querySelector("tbody");
    tbody.innerHTML = "";
    Object.keys(localStorage).forEach((key) => {
      const item = JSON.parse(localStorage.getItem(key));
      const row = tbody.insertRow();
      const imagen = row.insertCell();
      imagen.innerHTML = `<img src="${item.thumbnail}" alt="${item.title}" width="50">`;
      const nombre = row.insertCell();
      nombre.textContent = item.title;
      const precio = row.insertCell();
      precio.textContent = `${item.price.toLocaleString()} €`;
      const cantidad = row.insertCell();
      cantidad.textContent = item.cantidad;
      const subtotal = row.insertCell();
      subtotal.textContent = `${item.subtotal.toLocaleString()} €`;
      const borrar = row.insertCell();
      const botonBorrar = document.createElement("button");
      botonBorrar.textContent = "Borrar";
      botonBorrar.addEventListener("click", () => {
        disminuirCantidad(key);
      });
      borrar.appendChild(botonBorrar);
    });
    //tabla.style.display = "none";
  };
  




  
  const disminuirCantidad = (key) => {
    const item = JSON.parse(localStorage.getItem(key));
    item.cantidad--;
    item.subtotal -= item.price;
    if (item.cantidad === 0) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(item));
    }
    rellenarTabla();
  };
  
  
  const imagen = document.getElementById("movida");
  imagen.addEventListener("click", rellenarTabla);
  

  //funcion mutar y subir al local (aumentar el precio y la cantidad)
  const addLocal = async(producto, cantidad) => {
    const item = JSON.parse(localStorage.getItem(producto.id)) || {
      thumbnail: producto.thumbnail,
      title: producto.title,
      price: producto.price,
      cantidad: 0,
      subtotal: 0
    };
    item.cantidad += cantidad;
    item.subtotal += producto.price * cantidad;
    localStorage.setItem(producto.id, JSON.stringify(item));
  };


  //funcion borrar
  const borrarCarrito = () => {
    localStorage.clear(); // borra todo el local storage
    rellenarTabla(); // actualiza la tabla del carrito
  };
  borrarCarritoButton.addEventListener("click", borrarCarrito);

///obtener productos PRUEBA
const obtenerProductos = async () => {
  try {
    const respuesta = await fetch('https://dummyjson.com/products');
    const productos = await respuesta.json();
   // console.log(productos);
    return productos;
  } catch (error) {
    console.log(error);
  }
};



createCard();
const botonComprar = document.getElementById("comprar");

botonComprar.addEventListener("click", () => {
  location.href = 'http://127.0.0.1:5500/practicaCarritoCompra/compras.html';
  rellenarTabla();
});

});