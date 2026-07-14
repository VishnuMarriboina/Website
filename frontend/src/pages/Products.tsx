import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart, FiPackage } from "react-icons/fi";
import { useProducts, useAddToCart } from "../hooks/useServiceA";
import { useAuthStore } from "../store/authStore";
import type { GetProductsParams } from "../grpc/clients/types";
import CustomModal from "../components/CustomModal";

import a1 from "../Images/Product/60mm.jpg";
import a2 from "../Images/Product/40mm.png";
import a3 from "../Images/Product/20mm.png";
import a4 from "../Images/Product/12mm.png";
import a5 from "../Images/Product/6mm.png";
import a6 from "../Images/Product/Sand.webp";
import a7 from "../Images/Product/dust.webp";
import a8 from "../Images/Product/wet.jpeg";
import a9 from "../Images/Product/gsb.jpeg";
import a10 from "../Images/Product/gravels.jpg";

const IMAGE_MAP: [string, string][] = [
  ["60mm", a1],
  ["40mm", a2],
  ["20mm", a3],
  ["12mm", a4],
  ["6mm", a5],
  ["m-sand", a6],
  ["sand", a6],
  ["dust", a7],
  ["filler", a7],
  ["wetmix", a8],
  ["wet mix", a8],
  ["gsb", a9],
  ["gravel", a10],
];

function resolveImage(name: string): string {
  const lower = name.toLowerCase();
  const match = IMAGE_MAP.find(([key]) => lower.includes(key));
  return match ? match[1] : a3;
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
      <div className="h-56 bg-slate-200" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-100 rounded w-full" />
        <div className="h-3 bg-slate-100 rounded w-5/6" />
        <div className="h-8 bg-slate-200 rounded w-28 mt-4" />
      </div>
    </div>
  );
}

interface ModalState {
  isOpen: boolean;
  type: "success" | "error";
  title: string;
  message: string;
}

const CLOSED_MODAL: ModalState = {
  isOpen: false,
  type: "success",
  title: "",
  message: "",
};

function Products() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [addingId, setAddingId] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>(CLOSED_MODAL);

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const addToCart = useAddToCart();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    clearTimeout(
      (handleSearchChange as unknown as { _t?: ReturnType<typeof setTimeout> })
        ._t,
    );
    (
      handleSearchChange as unknown as { _t?: ReturnType<typeof setTimeout> }
    )._t = setTimeout(() => setDebouncedSearch(value), 400);
  };

  const queryParams: GetProductsParams = {
    limit: 50,
    status: "active",
    search: debouncedSearch,
  };

  const { data, isLoading, isError, refetch } = useProducts(queryParams);
  const products = data?.data ?? [];

  const handleAddToCart = async (productId: string, name: string) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setAddingId(productId);
    try {
      await addToCart.mutateAsync({ productId, quantity: 1 });
      setModal({
        isOpen: true,
        type: "success",
        title: "Added to Cart!",
        message: `${name} has been added to your cart.`,
      });
    } catch (err: unknown) {
      const msg =
        (err as { message?: string })?.message ??
        "Could not add item. Please try again.";
      setModal({
        isOpen: true,
        type: "error",
        title: "Failed to Add",
        message: msg,
      });
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* ── Modal ──────────────────────────────────────────────────────────── */}
      <CustomModal
        isOpen={modal.isOpen}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onClose={() => setModal(CLOSED_MODAL)}
      />

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="bg-slate-900 py-10">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <span className="text-xs font-bold tracking-widest text-orange-400 uppercase">
            Catalogue
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-white mt-2">
            Stone Aggregates on ServCrust
          </h1>
          <p className="text-slate-400 text-sm mt-3 max-w-xl mx-auto">
            Simplifying your construction aggregate supply — browse, add to
            cart, and track delivery all from one platform.
          </p>

          <div className="mt-6 flex justify-center">
            <div className="relative w-full max-w-md">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search products…"
                className="w-full bg-white/10 border border-white/20 text-white placeholder-slate-400 text-sm rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-orange-400 transition"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Products grid ────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {isError && !isLoading && (
          <div className="flex flex-col items-center py-20 gap-4">
            <p className="text-slate-500 text-sm">
              Failed to load products. Please try again.
            </p>
            <button
              onClick={() => refetch()}
              className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !isError && products.length === 0 && (
          <div className="flex flex-col items-center py-20 gap-3">
            <FiPackage className="w-12 h-12 text-slate-200" />
            <p className="text-slate-500 text-sm font-medium">
              {debouncedSearch
                ? `No products matching "${debouncedSearch}"`
                : "No products available yet."}
            </p>
            {debouncedSearch && (
              <button
                onClick={() => {
                  setSearch("");
                  setDebouncedSearch("");
                }}
                className="text-xs text-orange-500 hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {!isLoading && !isError && products.length > 0 && (
          <>
            <p className="text-xs text-slate-400 mb-6">
              {products.length} product{products.length !== 1 ? "s" : ""} found
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(
                ({ id, name, description, price, stock, category }) => {
                  const isAdding = addingId === id;
                  const outOfStock = stock === 0;
                  return (
                    <div
                      key={id}
                      className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
                    >
                      <div className="relative h-56 overflow-hidden bg-slate-100">
                        <img
                          src={resolveImage(name)}
                          alt={name}
                          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                        <span className="absolute top-3 left-3 bg-white/95 text-slate-700 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                          {category || "Aggregate"}
                        </span>
                        {outOfStock && (
                          <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                            Out of Stock
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col flex-1 p-5">
                        <h2 className="font-semibold text-slate-900 text-sm leading-snug">
                          {name}
                        </h2>
                        <p className="text-xs text-slate-500 mt-2 leading-relaxed flex-1">
                          {description}
                        </p>

                        <div className="mt-3 flex items-center justify-between">
                          {price > 0 ? (
                            <span className="text-base font-bold text-slate-800">
                              ₹{price.toLocaleString("en-IN")}
                              <span className="text-xs font-normal text-slate-400">
                                /unit
                              </span>
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400 italic">
                              Price on request
                            </span>
                          )}
                          <span
                            className={`text-xs font-medium ${stock > 0 ? "text-green-600" : "text-red-500"}`}
                          >
                            {stock > 0 ? `${stock} in stock` : "Unavailable"}
                          </span>
                        </div>

                        <button
                          disabled={outOfStock || isAdding}
                          onClick={() => handleAddToCart(id, name)}
                          className={`mt-4 flex items-center justify-center gap-2 text-xs font-semibold px-5 py-2.5 rounded-lg transition-all self-stretch shadow-sm
                          ${
                            outOfStock || isAdding
                              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                              : "bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white"
                          }`}
                        >
                          <FiShoppingCart size={14} />
                          {isAdding ? "Adding…" : "Add to Cart"}
                        </button>
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Products;
