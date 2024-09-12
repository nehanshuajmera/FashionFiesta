import { useState } from "react";
import "./shop.styles.scss";
import SHOP_DATA from "./shop.data.js";
import { CollectionPreview } from "../../components/collection-preview/collection-preview.component.jsx";

export const ShopPage = () => {
  const [collections, setCollections] = useState(SHOP_DATA);

  return (
    <div className="shop-page">
      {collections.map(({ id, ...otherCollectionProps }) => (
        <CollectionPreview key={id} {...otherCollectionProps} />
      ))}
    </div>
  );
};