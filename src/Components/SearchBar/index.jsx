import { useContext, useState, useRef, useEffect } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { ShoppingCartContext } from "../../Context";

const SearchBar = () => {
  const context = useContext(ShoppingCartContext);
  const [searchInput, setSearchInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const searchRef = useRef(null);

  // Generate suggestions based on input
  useEffect(() => {
    if (searchInput.trim().length > 0 && context.items) {
      const filtered = context.items
        .filter((item) =>
          item.title.toLowerCase().includes(searchInput.toLowerCase())
        )
        .slice(0, 6);

      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchInput, context.items]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    context.setSearchByTitle(value || null);
  };

  const handleSuggestionClick = (product) => {
    setSearchInput(product.title);
    context.setSearchByTitle(product.title);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setSearchInput("");
    context.setSearchByTitle(null);
    setSuggestions([]);
  };

  return (
    <div className="w-full" ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search by product name..."
          value={searchInput}
          onChange={handleSearchChange}
          onFocus={() => searchInput && setShowSuggestions(true)}
          className="w-full px-4 py-3 sm:py-3 pr-10 rounded-lg bg-white border border-black/10 focus:outline-none focus:border-black focus:ring-1 focus:ring-black/10 text-sm sm:text-base placeholder:text-black/40 transition-all shadow-sm hover:shadow-md"
        />
        {searchInput ? (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-3.5 sm:top-3.5 p-1 hover:bg-black/5 rounded-full transition"
          >
            <XMarkIcon className="h-5 w-5 text-black/60" />
          </button>
        ) : (
          <MagnifyingGlassIcon className="h-5 w-5 text-black/40 absolute right-3 top-3.5 sm:top-3.5 pointer-events-none" />
        )}

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-black/10 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
            <div className="py-2">
              {suggestions.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleSuggestionClick(product)}
                  className="w-full px-4 py-3 text-left hover:bg-black/5 transition flex items-center gap-3 border-b border-black/5 last:border-0"
                >
                  <img
                    src={product.images?.[0]}
                    alt={product.title}
                    className="w-10 h-10 rounded object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-black">
                      {product.title}
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-black/60">
                        {product.category?.name}
                      </p>
                      <span className="text-sm font-semibold text-black/80">
                        ${product.price}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
