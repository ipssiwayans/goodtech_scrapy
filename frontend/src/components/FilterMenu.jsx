import React from "react";

const FilterMenu = ({ search, onSearch, sort, onSort }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-gray-100 p-4 rounded-lg">
      <input
        type="text"
        placeholder="Rechercher par titre..."
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <select
        value={sort}
        onChange={(e) => onSort(e.target.value)}
        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="desc">Plus récent</option>
        <option value="asc">Plus ancien</option>
      </select>
    </div>
  );
};

export default FilterMenu;
