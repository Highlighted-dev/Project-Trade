import React from 'react';
import { useParams } from 'react-router-dom';

const ProductWebsiteTemplate = () => {
  const { productId } = useParams();

  return (
    <div>
      <h2>{productId}</h2>
    </div>
  );
};

export default ProductWebsiteTemplate;
