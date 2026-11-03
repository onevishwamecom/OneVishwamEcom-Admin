import React from 'react';
import ListingTable from '../../../../components/ui/ListingTable';

export default function ItemsTable({ items = [] }) {
  return (
    <div className="-m-5 overflow-hidden">
      <ListingTable
        items={items}
        columns={['product', 'category', 'location', 'date', 'status']}
        portal="admin"
        responsiveMode="scroll"
        getItemLink={(it) => {
          const type = it._type || it.category || 'properties';
          const id = it._id || it.id;
          return id ? `/admin/listings/${encodeURIComponent(type)}/${encodeURIComponent(id)}` : '#';
        }}
      />
    </div>
  );
}