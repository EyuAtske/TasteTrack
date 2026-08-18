import React from 'react';
import { useParams } from 'react-router-dom';

const RestaurantDetails = () => {
  const { id } = useParams();
  
  return (
    <div className="restaurant-details-page">
      <h2>Restaurant Details</h2>
      <p>Details for restaurant ID: {id}</p>
    </div>
  );
};

export default RestaurantDetails;
