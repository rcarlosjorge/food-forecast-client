import { useState, useEffect } from "react";
import useUserContext from "../../../Contexts/useUserContext";
import BufferImage from "../../BufferImage/BufferImage";
import {
  addProduct,
  getUserProducts,
  deleteAllProducts,
  deleteProduct,
  getDownloadURLForTemplate,
  uploadUserProductsTemplate,
} from "../../../services/userProducts.service";
import CATEGORIES from "../../../categories/productCategories";
import Modal from "../../Layouts/Modal/Modal";
import "./MyProducts.css";
import DownloadButton from "../../Layouts/DownloadButton/DownloadButton";
import { Link } from "react-router-dom";
import { useProductContext } from "../../../Contexts/ProductContext";
import TemplateImage from "../../../images/TemplateImage.png";

const MyProducts = () => {
  const productInitialState = {
    productName: "",
    price: "",
    category: "",
    productImage: "",
    origin: "",
  };

  const [newProduct, setNewProduct] = useState(productInitialState);
  const [userProducts, setUserProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { userID } = useUserContext();
  const [isModalArchiveOpen, setModalArchiveOpen] = useState(false);
  const [isModalProductOpen, setModalProductOpen] = useState(false);
  const [file, setFile] = useState(null);
  const {
    selectedUserProductIds,
    addUserProductId,
    removeUserProductId,
    isUserProductIdSelected,
    clearUserProductIds,
  } = useProductContext();

  const getProducts = () => {
    getUserProducts(userID)
      .then(response => {
        setUserProducts(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const deleteAllUserProducts = () => {
    deleteAllProducts(userID)
      .then(response => {
        console.log(response.status);
        getProducts();
      })
      .catch(error => {
        console.log(error);
      });
  };

  const deleteOneUserProduct = productID => {
    deleteProduct(userID, productID)
      .then(response => {
        console.log(response.status);
        getProducts();
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleAddProduct = event => {
    event.preventDefault();

    let formData = new FormData();
    formData.append("productName", newProduct.productName);
    formData.append("price", newProduct.price);
    formData.append("category", newProduct.category);
    formData.append("productImage", newProduct.productImage);
    formData.append("origin", newProduct.origin);

    addProduct(userID, formData)
      .then(response => {
        console.log(response.status);
        getProducts();
        setNewProduct(productInitialState);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleChange = event => {
    if (event.target.name === "productImage") {
      // handle file
      setNewProduct({
        ...newProduct,
        [event.target.name]: event.target.files[0],
      });
    } else {
      setNewProduct({
        ...newProduct,
        [event.target.name]: event.target.value,
      });
    }
  };

  const productsFiltered = userProducts.filter(p => {
    return p.productName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleSearch = e => {
    setSearchTerm(e.target.value);
  };

  const handleFileChange = event => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = () => {
    uploadUserProductsTemplate(userID, file).then(() => {
      getProducts();
      alert("File uploaded successfully!");
      setModalOpen(false);
    });
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className=" mb-10 mt-4">
      <div className="my-2 py-2">
        <Modal
          isOpen={isModalProductOpen}
          onClose={() => setModalProductOpen(false)}
          classProps={"z-10 m-auto max-w-2xl rounded-lg bg-white p-4"}
        >
          <form className="mt-8 w-96">
            <p className="mb-6 text-2xl font-medium text-black">
              Añadir Productos
            </p>
            <div className="mb-6">
              <label
                type="text"
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                Nombre del Producto
              </label>
              <input
                type="text"
                name="productName"
                id="text"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                value={newProduct.productName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-6">
              <label
                type="number"
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                Precio
              </label>
              <input
                type="number"
                name="price"
                id="number"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                value={newProduct.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-6">
              <label
                type="number"
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                Origen
              </label>
              <input
                type="text"
                name="origin"
                id="number"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                value={newProduct.origin}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-6">
              <label
                type="products"
                className="mb-2 block text-sm font-medium text-gray-900"
              >
                Escoge una Categoria
              </label>
              <select
                id="products"
                name="category"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                value={newProduct.category}
                onChange={handleChange}
                required
              >
                <option defaultValue>Escoge la categoria</option>
                {CATEGORIES.map(({ categoryValue, text }) => (
                  <option key={categoryValue} value={categoryValue}>
                    {text}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                className="mb-2 block text-sm font-medium text-gray-900"
                htmlFor="default_size"
              >
                Foto del Producto
              </label>
              <input
                className="mb-5 block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none dark:text-gray-400"
                id="default_size"
                name="productImage"
                type="file"
                onChange={handleChange}
              />
            </div>
            <button
              type="submit"
              className="mt-[1.75rem] h-[53px] w-[229px] rounded-[32px] bg-lime-600 text-[17px] font-medium text-white shadow hover:bg-white hover:text-lime-600 hover:shadow-lg"
              onClick={event => handleAddProduct(event)}
            >
              Añadir Producto
            </button>
          </form>
        </Modal>
        <Modal
          isOpen={isModalArchiveOpen}
          onClose={() => setModalArchiveOpen(false)}
          classProps={"z-10 m-auto max-w-md rounded-lg bg-white p-4"}
        >
          <h2 className="mb-4 text-2xl font-bold">
            Pasos para añadir productos desde un archivo
          </h2>

          <h3 className="mb-4 text-lg font-bold">
            Paso 1: Descargar el archivo de plantilla
          </h3>

          <DownloadButton
            downloadUrl={getDownloadURLForTemplate()}
            fileName="productsTemplate.xlsx"
          >
            Descargar
          </DownloadButton>
          <div className="mt-2">
            <h3 className="mb-4 text-lg font-bold">
              Paso 2: Añadir los productos al archivo recien descargado
            </h3>

            <img src={TemplateImage} alt="templateImage" />
          </div>
          <div className="mt-5">
            <h3 className="mb-4 text-lg font-bold">
              Paso 3: Subir el archivo con los productos añadidos
            </h3>

            <label
              className="mb-2 block text-sm font-medium text-gray-900"
              htmlFor="file_input"
            >
              Subir Archivo
            </label>
            <input
              className="block w-[75%] cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none"
              id="file_input"
              type="file"
              onChange={handleFileChange}
            />
            <div className=" mt-3 flex justify-center">
              <button
                type="button"
                className="mb-2 mr-2 rounded-lg bg-green-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300"
                onClick={handleFileUpload}
              >
                Subir Archivo
              </button>
            </div>
          </div>
        </Modal>
        <div>
          <div className="m-0 p-0 pt-5 text-center">
            <div className="container mx-auto px-6 py-20 text-center">
              <h1 className="mb-6 text-4xl font-bold text-gray-800 md:text-6xl">
                Mis <span className="text-green-600">Productos</span>
              </h1>
              <p className="mb-8 text-base text-gray-600 md:text-lg">
                Aqui podrás administrar tus productos.
              </p>
            </div>
          </div>
          <div className=" ml-[3.88rem] w-96">
            <label
              htmlFor="default-search"
              className="sr-only mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Buscar
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="h-4 w-4 text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                value={searchTerm}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Buscar"
                onChange={handleSearch}
                required
              />
            </div>
          </div>
          <div className="ml-[3.88rem] mt-6">
            <button
              onClick={() => setModalProductOpen(true)}
              className=" mr-6 transform rounded bg-lime-600 px-4 py-2 font-medium text-white shadow transition duration-300 ease-in-out hover:scale-105 hover:bg-white hover:text-lime-600 hover:shadow-lg"
            >
              Añadir Producto
            </button>
            <button
              onClick={() => setModalArchiveOpen(true)}
              className="transform rounded bg-lime-600 px-4 py-2 font-medium text-white shadow transition duration-300 ease-in-out hover:scale-105 hover:bg-white hover:text-lime-600 hover:shadow-lg"
            >
              Añadir productos desde archivo
            </button>
          </div>
          <button
            className="ml-[3.88rem] mt-6 inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            onClick={() => deleteAllUserProducts()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete All
          </button>
          <div className=" grid grid-cols-6 justify-items-center gap-6 pl-[3.88rem] pt-10">
            {productsFiltered.map(product => (
              <div
                key={product._id}
                className="w-full rounded-lg border border-gray-200 bg-white shadow"
              >
                <div className="px-5 pb-5">
                  <div>
                    <Link to={`/admin/myproducts/${product._id}`}>
                      <BufferImage
                        bufferImage={product.productImage}
                        className="rounded-t-lg p-8"
                      />
                      <h5 className="w-[141.11px] text-base font-bold leading-tight tracking-tight text-gray-700">
                        {product.productName}
                      </h5>
                      <div className="mb-3 mt-2.5 flex items-center">
                        <p className=" w-[141.11px] text-lg font-bold leading-tight tracking-tight text-gray-700">
                          Categoria: {product.category}
                        </p>
                      </div>
                      <span className="text-lg font-bold text-gray-700">
                        Precio: RD${product.price}
                      </span>
                    </Link>
                  </div>
                  <div className=" mt-4">
                    {isUserProductIdSelected(product._id) ? (
                      <button
                        onClick={() => removeUserProductId(product._id)}
                        className="mb-3 rounded-lg bg-green-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
                      >
                        Eliminar de Comparación
                      </button>
                    ) : (
                      <button
                        onClick={() => addUserProductId(product._id)}
                        className=" mb-3 rounded-lg bg-green-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
                      >
                        Comparar
                      </button>
                    )}
                    <button
                      className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                      onClick={() => deleteOneUserProduct(product._id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-2 h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProducts;
