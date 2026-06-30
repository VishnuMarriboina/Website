import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowLeft } from "react-icons/fi";
import { useCart, useUpdateCartItem, useRemoveFromCart, useClearCart, useCheckoutCart } from "../hooks/useServiceA";
import { useAuthStore } from "../store/authStore";
import type { CartItem } from "../grpc/clients/types";
import CustomModal from "../components/CustomModal";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ModalState {
  isOpen:    boolean;
  type:      "success" | "error";
  title:     string;
  message:   string;
  onClose?:  () => void;
}

const CLOSED_MODAL: ModalState = { isOpen: false, type: "success", title: "", message: "" };

// ── Cart item row ─────────────────────────────────────────────────────────────

function CartItemRow({ item, onUpdate, onRemove }: {
  item:     CartItem;
  onUpdate: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-5 py-4">
      <div className="min-w-0">
        <p className="font-semibold text-slate-800 text-sm truncate">{item.productName}</p>
        <p className="text-xs text-slate-400 mt-0.5">₹{item.price.toLocaleString("en-IN")} / unit</p>
      </div>

      <div className="flex items-center gap-2 w-24 justify-center">
        <button
          onClick={() => onUpdate(item.productId, item.quantity - 1)}
          className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
          aria-label="Decrease quantity"
        >
          <FiMinus size={12} />
        </button>
        <span className="w-6 text-center text-sm font-semibold text-slate-800">{item.quantity}</span>
        <button
          onClick={() => onUpdate(item.productId, item.quantity + 1)}
          className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
          aria-label="Increase quantity"
        >
          <FiPlus size={12} />
        </button>
      </div>

      <div className="w-20 text-right">
        <p className="text-sm font-bold text-slate-800">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
      </div>

      <div className="w-8 flex justify-center">
        <button
          onClick={() => onRemove(item.productId)}
          className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
          aria-label="Remove item"
        >
          <FiTrash2 size={15} />
        </button>
      </div>
    </div>
  );
}

// ── Cart page ─────────────────────────────────────────────────────────────────

function Cart() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [modal, setModal] = useState<ModalState>(CLOSED_MODAL);

  const { data, isLoading } = useCart();
  const updateItem   = useUpdateCartItem();
  const removeItem   = useRemoveFromCart();
  const clearCart    = useClearCart();
  const checkoutCart = useCheckoutCart();

  const closeModal = () => setModal(CLOSED_MODAL);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 px-4">
        <FiShoppingBag size={48} className="text-slate-200" />
        <p className="text-slate-500 font-medium">Please log in to view your cart</p>
        <Link to="/login"
          className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors">
          Log In
        </Link>
      </div>
    );
  }

  const cart  = data?.data;
  const items = cart?.items ?? [];

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleUpdate = async (productId: string, quantity: number) => {
    try {
      await updateItem.mutateAsync({ productId, quantity });
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? "Could not update quantity.";
      setModal({ isOpen: true, type: "error", title: "Update Failed", message: msg });
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      await removeItem.mutateAsync(productId);
      setModal({ isOpen: true, type: "success", title: "Item Removed", message: "Item has been removed from your cart." });
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? "Could not remove item.";
      setModal({ isOpen: true, type: "error", title: "Remove Failed", message: msg });
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart.mutateAsync();
      setModal({ isOpen: true, type: "success", title: "Cart Cleared", message: "All items have been removed from your cart." });
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? "Could not clear cart.";
      setModal({ isOpen: true, type: "error", title: "Clear Failed", message: msg });
    }
  };

  const handleCheckout = async () => {
    try {
      await checkoutCart.mutateAsync();
      setModal({
        isOpen:  true,
        type:    "success",
        title:   "Order Placed!",
        message: "Your order has been placed successfully. Redirecting to your orders…",
        onClose: () => { setModal(CLOSED_MODAL); navigate("/orders"); },
      });
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message ?? "Checkout failed. Please try again.";
      setModal({ isOpen: true, type: "error", title: "Order Failed", message: msg });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <CustomModal
        isOpen={modal.isOpen}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onClose={modal.onClose ?? closeModal}
      />

      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Header row */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link to="/products"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-500 hover:text-white bg-orange-50 hover:bg-orange-500 border border-orange-200 hover:border-orange-500 px-3 py-1.5 rounded-lg mb-2 transition-all">
              <FiArrowLeft size={13} />
              Continue Shopping
            </Link>
            <h1 className="text-2xl font-bold text-slate-900">Your Cart</h1>
          </div>
          {items.length > 0 && (
            <p className="text-sm text-slate-400">{items.length} item{items.length !== 1 ? "s" : ""}</p>
          )}
        </div>

        {isLoading && (
          <div className="grid lg:grid-cols-[1fr_340px] gap-6">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-1 h-4 bg-slate-100 rounded" />
                  <div className="w-20 h-4 bg-slate-100 rounded" />
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse h-52" />
          </div>
        )}

        {!isLoading && items.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 p-16 flex flex-col items-center gap-4">
            <FiShoppingBag size={44} className="text-slate-200" />
            <p className="text-slate-500 font-medium">Your cart is empty</p>
            <Link to="/products"
              className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors">
              Browse Products
            </Link>
          </div>
        )}

        {!isLoading && items.length > 0 && (
          <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">

            {/* ── Left: cart items ─────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              {/* Column headers */}
              <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3.5 bg-slate-800 text-xs font-bold text-white uppercase tracking-wider rounded-t-2xl">
                <span>Product</span>
                <span className="text-center w-24">Qty</span>
                <span className="text-right w-20">Price</span>
                <span className="w-8" />
              </div>
              <div className="divide-y divide-slate-50">
                {items.map((item) => (
                  <CartItemRow
                    key={item.productId}
                    item={item}
                    onUpdate={handleUpdate}
                    onRemove={handleRemove}
                  />
                ))}
              </div>
            </div>

            {/* ── Right: order summary (sticky) ─────────────────────────────── */}
            <div className="lg:sticky lg:top-6 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h2 className="font-bold text-slate-800 mb-4">Order Summary</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal ({items.length} item{items.length !== 1 ? "s" : ""})</span>
                    <span className="font-medium text-slate-700">₹{(cart?.totalAmount ?? 0).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Delivery</span>
                    <span className="text-green-600 font-semibold">Free</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Taxes</span>
                    <span className="text-slate-500">Included</span>
                  </div>
                </div>

                <div className="border-t border-slate-100 mt-4 pt-4 flex justify-between items-center">
                  <span className="font-bold text-slate-900">Total</span>
                  <span className="text-xl font-bold text-slate-900">₹{(cart?.totalAmount ?? 0).toLocaleString("en-IN")}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={checkoutCart.isPending}
                  className="mt-5 w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3 rounded-xl transition-colors text-sm shadow-sm"
                >
                  {checkoutCart.isPending ? "Placing Order…" : "Place Order →"}
                </button>

                <button
                  onClick={handleClearCart}
                  disabled={clearCart.isPending}
                  className="mt-2 w-full text-xs text-slate-400 hover:text-red-500 transition-colors py-1.5"
                >
                  {clearCart.isPending ? "Clearing…" : "Clear Cart"}
                </button>
              </div>

              {/* Trust badges */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-2.5">
                {[
                  { icon: "🚚", label: "Free Delivery", sub: "On all orders" },
                  { icon: "🔒", label: "Secure Checkout", sub: "Your data is safe" },
                  { icon: "📞", label: "Support", sub: "Mon–Sat, 9am–6pm" },
                ].map(({ icon, label, sub }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="text-lg">{icon}</span>
                    <div>
                      <p className="text-xs font-semibold text-slate-700">{label}</p>
                      <p className="text-[11px] text-slate-400">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
