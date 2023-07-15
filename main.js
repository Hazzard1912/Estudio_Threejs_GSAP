import * as THREE from "three";

import gsap from "gsap";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Al trabajar con vite los estilos se importan aqui, no en el html
import "./style.css";

// Comencemos con esto:

/**
 * Cuando trabajamos con three.js debemos pensar en ello como una
 * pelicula.
 *
 * Una pelicula tiene elementos muy reconocibles tales como:
 *  Actores
 *  Camara
 *  Decoraciones y etc.
 *
 * En general, enfoquemonos en los actores y la camara. Sabemos
 * que las tomas en una pelicula hacen parte de una ESCENA. Razon
 * por la cual lo primero que debemos hacer es DEFINIR una escena
 */

const scene = new THREE.Scene();

/**
 * Ahora, podemos crear diferentes objetos, de los cuales vamos a
 * poder disponer y reutilizar a lo largo de la pelicula. Con el fin
 * de poder utilizar un objeto que creemos deberemos AGREGARLO a la
 * ESCENA en la que queremos que aparezca.
 */

/**
 * Creemos una esfera. Tengamos en cuenta que three.js tiene una
 * serie de objetos predefinidos que podemos utilizar, formas
 * basicas de las que podemos partir.
 */

// (radio, Segmentos a lo ancho, Segmentos a lo alto)
const geometry = new THREE.SphereGeometry(3, 64, 64);

/**
 * Ahora, pensar que la geometria solo es la forma, pero necesitamos
 * darle mas informacion sobre como queremos que luzca. Queremos que
 * sea opaca?, queremos que refleje mucho la luz como una pieza
 * metalica?, queremos que parezca de vidrio?
 *
 * Esto es el material de nuestro objeto, que tambien debemos
 * definir.
 */

// ({ atributos de nuestro material })
const material = new THREE.MeshStandardMaterial({
  color: "#00ff83",
  roughness: 0.4,
});

/**
 * Ahora creamos nuestro mesh, usando nuestro material y nuestro
 * objeto
 */

const mesh = new THREE.Mesh(geometry, material);

// Lo agregamos a nuestra escena:

scene.add(mesh);

// TAMAÑOS:
/**
 * Aqui podemos definir el tamaño del viewport:
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Necesitaremos LUCES:
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 10, 10);
light.intensity = 1.25;
scene.add(light);

/**
 * En este momento no veremos nada, esto es porque lo que ve el
 * usuario en pantalla debe ser una escena que hayamos definido
 * COMO SE VA A VER.
 *
 * Esto es: Se va a ver estatico? o el usuario podra 'mover su vista'.
 * Que perspectiva va tener?, Habra un movimiento de entrada
 * establecido?
 *
 * Para esto necesitaremos una CAMARA
 */

// Configuraciones de la camara que veremos despues:
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);

// Debemos darle a la camara una posicion en el eje Z:
camera.position.z = 20;

scene.add(camera);

/**
 * Finalmente necesitaremos renderizar la escena en nuestra pagina.
 * Esto lo logramos mediante el uso de un canvas en nuestro html.
 *
 * Esto es perfecto que lo hagamos asi porque podemos decidir en que
 * posicion exacta de nuestra pagina debe de estar nuestra escena, y
 * configurar otros detalles desde el mismo archivo html.
 */

// Escogemos nuestro canvas:
const canvas = document.querySelector(".webgl");

// Creamos y enlazamos nuesto Renderer:
const renderer = new THREE.WebGLRenderer({ canvas });

// Configuramos nuestro renderer:
renderer.setSize(sizes.width, sizes.height);

renderer.setPixelRatio(2);

/**
 * Que nos falta?, bueno, ya tenemos nuestra ESCENA, tenemos nuestro
 * OBJETO creado a partir de una FORMA y un MATERIAL. Tenemos nuestra
 * CAMARA. Tenemos nuestro RENDERER o DIBUJANTE asociado a nuestro
 * CANVAS y hemos definido el TAMAÑO.
 *
 * Pero pero pero... No le hemos dicho al dibujante que escena
 * dibujar.
 */

renderer.render(scene, camera);

// Que el tamaño se calculo cuando se modifique la pantalla:

window.addEventListener("resize", () => {
  // Re caulculamos el tamaño
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Actualizamos nuestra camara y escena:
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

// Agregemos unos controles de movimientos de Three.js:
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Desabilitamos el pan (mover) y el zoom:
controls.enablePan = false;
controls.enableZoom = false;

/**
 * Este control nos permite usar la camara en cierta escena, y, como
 * podemos usar la camara, podemos rotar la camara, definir con
 * que velocidad rota, hacer que rote automaticamente, etc.
 */

controls.autoRotate = true;
controls.autoRotateSpeed = 5;

/**
 * En Three.js, para crear una animación suave y eficiente, se
 * utiliza la función requestAnimationFrame del objeto window. Esta
 * función permite ejecutar una función específica antes de cada
 * repintado de la ventana, lo que generalmente ocurre alrededor
 * de 60 veces por segundo (60 FPS).
 *
 *  la función loop se define para realizar una tarea específica y
 * luego se invoca a sí misma utilizando requestAnimationFrame. Esto
 * crea un bucle infinito en el que la función loop se ejecuta
 * continuamente, permitiendo que la escena se renderice
 * constantemente en el lienzo.
 */
const loop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};
loop();

// Ahora es cuando entra GSAP en escena para agregar animaciones:

// Timeline magic:

// Esto nos permite sincronizar multiples animaciones juntas:
const tl = gsap.timeline({
  defaults: {
    duration: 1,
  },
});

tl.fromTo(
  mesh.scale,
  {
    z: 0,
    x: 0,
    y: 0,
  },
  {
    z: 1,
    x: 1,
    y: 1,
  }
);

tl.fromTo("nav", { y: "-100%" }, { y: "0%" });

// Probemos a animar el titulo:

// Primero, necesitamos una instancia del elemento:

const title = document.querySelector(".title");

// Ahora podemos animarlo tambien:

tl.fromTo(title, { opacity: 0 }, { opacity: 1 });

// Otro ejemplo de timeline:

// const tl = gsap.timeline();

// tl.to(element1, { opacity: 0, duration: 1 })
//   .to(element2, { x: 200, duration: 1 }, "-=0.5")
//   .to(element3, { scale: 1.5, duration: 0.5 }, "+=1");

// Mouse Animation Color:

let mouseDown = false;
let rgb = [];

// Cuando p
window.addEventListener("mousedown", () => {
  mouseDown = true;
});
window.addEventListener("mouseup", () => {
  mouseDown = false;
});

window.addEventListener("mousemove", (evento) => {
  if (mouseDown) {
    rgb = [
      Math.round((evento.pageX / sizes.width) * 255),
      Math.round((evento.pageY / sizes.height) * 255),
      150,
    ];

    // Animamos despues de obtener el color:
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`);
    gsap.to(mesh.material.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b,
    });
  }
});
