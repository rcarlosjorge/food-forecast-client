import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductByIdWithPrice } from "../../../services/products.service";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { format, parseISO } from "date-fns";

const Product = () => {
  const { productId } = useParams();
  const [productWithPrice, setProduct] = useState({
    product: {
      _id: "",
      productName: "",
      category: "",
      imageUrl: "",
      productUrl: "",
      origin: "",
      extractionDate: "",
    },
    priceHistory: [],
  });

  const formatDateToMMDDYYYY = dateString => {
    const date = parseISO(dateString);
    return format(date, "MM-dd-yyyy");
  };

  const getProduct = () => {
    getProductByIdWithPrice(productId).then(response => {
      const productData = response.data;
      productData.priceHistory = productData.priceHistory.map(item => {
        return { ...item, date: formatDateToMMDDYYYY(item.date) };
      });
      setProduct(productData);
    });
  };

  useEffect(() => {
    getProduct();
  }, []);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`Date: ${payload[0].payload.date}`}</p>
          <p className="intro">{`Price: ${payload[0].value}`}</p>
        </div>
      );
    }

    return null;
  };

  const formatDate = inputDate => {
    const date = new Date(inputDate);

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();

    const formattedDate = `${day}-${month}-${year}`;

    return formattedDate;
  };

  const latestPrice =
    productWithPrice.priceHistory[productWithPrice.priceHistory.length - 1]
      ?.productPrice | 0;

  return (
    <div className="m-6">
      <div>
        <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white shadow">
          <img src={productWithPrice.product.imageUrl} alt="" />
          <div className="px-5 pb-5">
            <h5 className="mb-6 w-[141.11px] text-base font-bold leading-tight tracking-tight text-gray-700">
              Nombre: {productWithPrice.product.productName}
            </h5>
            <span className="text-lg font-bold text-gray-700">
              Precio actual: RD${latestPrice}
            </span>
            <div className="mb-3 mt-2.5 flex items-center">
              <p className="  text-lg font-bold leading-tight tracking-tight text-gray-700">
                Categoria: {productWithPrice.product.category}
              </p>
            </div>
            <div className="mb-3 mt-2.5 flex items-center">
              <p className=" text-lg font-bold leading-tight tracking-tight text-gray-700">
                Lugar: {productWithPrice.product.origin}
              </p>
            </div>
            <div className="mb-3 mt-2.5 flex items-center">
              <p className=" text-lg font-bold leading-tight tracking-tight text-gray-700">
                Fecha de extracción:{" "}
                {formatDate(productWithPrice.product.extractionDate)}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className=" mt-6">
        <h3 className="mb-6 w-[141.11px] text-base font-bold leading-tight tracking-tight text-gray-700">
          Historial de Precios
          <div>
            <LineChart
              width={500}
              height={300}
              data={productWithPrice.priceHistory}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis dataKey="productPrice" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="productPrice"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </div>
        </h3>
      </div>
    </div>
  );
};

export default Product;
