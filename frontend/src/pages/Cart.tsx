import { useState } from "react";
import type { CSSProperties } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowLeft } from "react-icons/fi";
import { useCart, useUpdateCartItem, useRemoveFromCart, useClearCart, useCheckoutCart } from "../hooks/useServiceA";
import { useAuthStore } from "../store/authStore";
import type { CartItem } from "../grpc/clients/types";
import CustomModal from "../components/CustomModal";

// ── Styles ────────────────────────────────────────────────────────────────────
//
// Plain properties (color, spacing, layout that never changes) live in this
// `styles` object and are applied via the `style` prop — the web equivalent of
// React Native's StyleSheet.create. Rules that need something inline styles
// can't express — :hover, :disabled, @media breakpoints, sibling selectors,
// @keyframes — stay in the embedded <style> tag below and are applied via
// className instead.

const styles: Record<string, CSSProperties> = {
  page: { minHeight: "100vh", background: "#f8fafc" },
  container: { maxWidth: "72rem", margin: "0 auto", padding: "2.5rem 1rem" },

  loginGate: {
    minHeight: "100vh",
    background: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
    padding: "0 1rem",
  },
  loginIcon: { color: "#e2e8f0" },
  loginText: { color: "#64748b", fontWeight: 500 },

  headerRow: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" },
  title: { fontSize: "1.5rem", fontWeight: 700, color: "#0f172a" },
  count: { fontSize: "0.875rem", color: "#94a3b8" },

  skeletonRows: { display: "flex", flexDirection: "column", gap: "1rem" },
  skeletonRow: { display: "flex", gap: "1rem" },
  skeletonBar: { flex: "1 1 0%", height: "1rem", background: "#f1f5f9", borderRadius: "0.25rem" },
  skeletonBarNarrow: { width: "5rem", height: "1rem", background: "#f1f5f9", borderRadius: "0.25rem" },

  empty: {
    background: "#fff",
    borderRadius: "1rem",
    border: "1px solid #f1f5f9",
    padding: "4rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
  },
  emptyIcon: { color: "#e2e8f0" },
  emptyText: { color: "#64748b", fontWeight: 500 },

  itemsCard: {
    background: "#fff",
    borderRadius: "1rem",
    border: "1px solid #f1f5f9",
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    overflow: "hidden",
  },
  itemsHeader: {
    display: "grid",
    gridTemplateColumns: "1fr auto auto auto",
    gap: "1rem",
    padding: "0.875rem 1.25rem",
    background: "#1e293b",
    color: "#fff",
    fontSize: "0.75rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    borderRadius: "1rem 1rem 0 0",
  },
  itemsHeaderQty: { textAlign: "center", width: "6rem" },
  itemsHeaderPrice: { textAlign: "right", width: "5rem" },
  itemsHeaderSpacer: { width: "2rem" },

  itemInfo: { minWidth: 0 },
  itemName: {
    fontWeight: 600,
    color: "#1e293b",
    fontSize: "0.875rem",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  itemUnitPrice: { fontSize: "0.75rem", color: "#94a3b8", marginTop: "0.125rem" },
  itemQty: { display: "flex", alignItems: "center", gap: "0.5rem", width: "6rem", justifyContent: "center" },
  qtyValue: { width: "1.5rem", textAlign: "center", fontSize: "0.875rem", fontWeight: 600, color: "#1e293b" },
  itemTotal: { width: "5rem", textAlign: "right" },
  itemTotalValue: { fontSize: "0.875rem", fontWeight: 700, color: "#1e293b" },
  itemRemoveWrap: { width: "2rem", display: "flex", justifyContent: "center" },

  summaryCard: {
    background: "#fff",
    borderRadius: "1rem",
    border: "1px solid #f1f5f9",
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    padding: "1.25rem",
  },
  summaryTitle: { fontWeight: 700, color: "#1e293b", marginBottom: "1rem" },
  summaryLines: { display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.875rem" },
  summaryLine: { display: "flex", justifyContent: "space-between", color: "#64748b" },
  summaryLineValue: { fontWeight: 500, color: "#334155" },
  summaryFree: { color: "#16a34a", fontWeight: 600 },
  summaryDivider: {
    borderTop: "1px solid #f1f5f9",
    marginTop: "1rem",
    paddingTop: "1rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryTotalLabel: { fontWeight: 700, color: "#0f172a" },
  summaryTotalValue: { fontSize: "1.25rem", fontWeight: 700, color: "#0f172a" },

  trustCard: {
    background: "#fff",
    borderRadius: "1rem",
    border: "1px solid #f1f5f9",
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.625rem",
  },
  trustItem: { display: "flex", alignItems: "center", gap: "0.75rem" },
  trustIcon: { fontSize: "1.125rem" },
  trustLabel: { fontSize: "0.75rem", fontWeight: 600, color: "#334155" },
  trustSub: { fontSize: "11px", color: "#94a3b8" },
};

// Rules inline style objects can't express: hover/disabled states, the
// two-column breakpoint, the sibling divider between cart rows, and the
// skeleton pulse keyframes.
const CART_STYLES = `
.cart-login-btn {
  background: #f97316;
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.625rem 1.5rem;
  border-radius: 0.75rem;
  transition: background-color 0.15s ease;
  text-decoration: none;
}
.cart-login-btn:hover { background: #ea580c; }

.cart-back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #f97316;
  background: #fff7ed;
  border: 1px solid #fed7aa;
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  text-decoration: none;
  transition: color 0.15s ease, background-color 0.15s ease, border-color 0.15s ease;
}
.cart-back-link:hover { color: #fff; background: #f97316; border-color: #f97316; }

.cart-browse-btn {
  background: #f97316;
  color: #fff;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.625rem 1.5rem;
  border-radius: 0.75rem;
  transition: background-color 0.15s ease;
  text-decoration: none;
}
.cart-browse-btn:hover { background: #ea580c; }

.cart-grid,
.cart-skeleton-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: 1fr;
}
.cart-grid { align-items: start; }

@media (min-width: 1024px) {
  .cart-grid,
  .cart-skeleton-grid {
    grid-template-columns: 1fr 340px;
  }
  .cart-summary-col {
    position: sticky;
    top: 1.5rem;
  }
}

.cart-summary-col { display: flex; flex-direction: column; gap: 1rem; }

.cart-skeleton-card {
  background: #fff;
  border-radius: 1rem;
  border: 1px solid #f1f5f9;
  padding: 1.5rem;
  animation: cart-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
.cart-skeleton-summary {
  height: 13rem;
  animation: cart-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes cart-pulse {
  50% { opacity: 0.5; }
}

.cart-item-row {
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem 1.25rem;
}
.cart-items-list > .cart-item-row + .cart-item-row {
  border-top: 1px solid #f8fafc;
}

.cart-qty-btn {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 9999px;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #475569;
  border: none;
  cursor: pointer;
  transition: background-color 0.15s ease;
}
.cart-qty-btn:hover { background: #e2e8f0; }

.cart-item-remove-btn {
  padding: 0.375rem;
  border-radius: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #94a3b8;
  transition: color 0.15s ease, background-color 0.15s ease;
}
.cart-item-remove-btn:hover { background: #fef2f2; color: #ef4444; }

.cart-checkout-btn {
  margin-top: 1.25rem;
  width: 100%;
  background: #f97316;
  color: #fff;
  font-weight: 600;
  padding: 0.75rem;
  border-radius: 0.75rem;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  transition: background-color 0.15s ease;
}
.cart-checkout-btn:hover:not(:disabled) { background: #ea580c; }
.cart-checkout-btn:disabled { background: #fdba74; cursor: not-allowed; }

.cart-clear-btn {
  margin-top: 0.5rem;
  width: 100%;
  background: none;
  border: none;
  font-size: 0.75rem;
  color: #94a3b8;
  cursor: pointer;
  padding: 0.375rem 0;
  transition: color 0.15s ease;
}
.cart-clear-btn:hover:not(:disabled) { color: #ef4444; }
.cart-clear-btn:disabled { cursor: not-allowed; }
`;

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
    <div className="cart-item-row">
      <div style={styles.itemInfo}>
        <p style={styles.itemName}>{item.productName}</p>
        <p style={styles.itemUnitPrice}>₹{item.price.toLocaleString("en-IN")} / unit</p>
      </div>

      <div style={styles.itemQty}>
        <button
          onClick={() => onUpdate(item.productId, item.quantity - 1)}
          className="cart-qty-btn"
          aria-label="Decrease quantity"
        >
          <FiMinus size={12} />
        </button>
        <span style={styles.qtyValue}>{item.quantity}</span>
        <button
          onClick={() => onUpdate(item.productId, item.quantity + 1)}
          className="cart-qty-btn"
          aria-label="Increase quantity"
        >
          <FiPlus size={12} />
        </button>
      </div>

      <div style={styles.itemTotal}>
        <p style={styles.itemTotalValue}>₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
      </div>

      <div style={styles.itemRemoveWrap}>
        <button
          onClick={() => onRemove(item.productId)}
          className="cart-item-remove-btn"
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
      <>
        <style>{CART_STYLES}</style>
        <div style={styles.loginGate}>
          <FiShoppingBag size={48} style={styles.loginIcon} />
          <p style={styles.loginText}>Please log in to view your cart</p>
          <Link to="/login" className="cart-login-btn">
            Log In
          </Link>
        </div>
      </>
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
    <div style={styles.page}>
      <style>{CART_STYLES}</style>
      <CustomModal
        isOpen={modal.isOpen}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onClose={modal.onClose ?? closeModal}
      />

      <div style={styles.container}>

        {/* Header row */}
        <div style={styles.headerRow}>
          <div>
            <Link to="/products" className="cart-back-link">
              <FiArrowLeft size={13} />
              Continue Shopping
            </Link>
            <h1 style={styles.title}>Your Cart</h1>
          </div>
          {items.length > 0 && (
            <p style={styles.count}>{items.length} item{items.length !== 1 ? "s" : ""}</p>
          )}
        </div>

        {isLoading && (
          <div className="cart-skeleton-grid">
            <div className="cart-skeleton-card">
              <div style={styles.skeletonRows}>
                {[1, 2, 3].map((i) => (
                  <div key={i} style={styles.skeletonRow}>
                    <div style={styles.skeletonBar} />
                    <div style={styles.skeletonBarNarrow} />
                  </div>
                ))}
              </div>
            </div>
            <div className="cart-skeleton-card cart-skeleton-summary" />
          </div>
        )}

        {!isLoading && items.length === 0 && (
          <div style={styles.empty}>
            <FiShoppingBag size={44} style={styles.emptyIcon} />
            <p style={styles.emptyText}>Your cart is empty</p>
            <Link to="/products" className="cart-browse-btn">
              Browse Products
            </Link>
          </div>
        )}

        {!isLoading && items.length > 0 && (
          <div className="cart-grid">

            {/* ── Left: cart items ─────────────────────────────────────────── */}
            <div style={styles.itemsCard}>
              {/* Column headers */}
              <div style={styles.itemsHeader}>
                <span>Product</span>
                <span style={styles.itemsHeaderQty}>Qty</span>
                <span style={styles.itemsHeaderPrice}>Price</span>
                <span style={styles.itemsHeaderSpacer} />
              </div>
              <div className="cart-items-list">
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
            <div className="cart-summary-col">
              <div style={styles.summaryCard}>
                <h2 style={styles.summaryTitle}>Order Summary</h2>

                <div style={styles.summaryLines}>
                  <div style={styles.summaryLine}>
                    <span>Subtotal ({items.length} item{items.length !== 1 ? "s" : ""})</span>
                    <span style={styles.summaryLineValue}>₹{(cart?.totalAmount ?? 0).toLocaleString("en-IN")}</span>
                  </div>
                  <div style={styles.summaryLine}>
                    <span>Delivery</span>
                    <span style={styles.summaryFree}>Free</span>
                  </div>
                  <div style={styles.summaryLine}>
                    <span>Taxes</span>
                    <span>Included</span>
                  </div>
                </div>

                <div style={styles.summaryDivider}>
                  <span style={styles.summaryTotalLabel}>Total</span>
                  <span style={styles.summaryTotalValue}>₹{(cart?.totalAmount ?? 0).toLocaleString("en-IN")}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={checkoutCart.isPending}
                  className="cart-checkout-btn"
                >
                  {checkoutCart.isPending ? "Placing Order…" : "Place Order →"}
                </button>

                <button
                  onClick={handleClearCart}
                  disabled={clearCart.isPending}
                  className="cart-clear-btn"
                >
                  {clearCart.isPending ? "Clearing…" : "Clear Cart"}
                </button>
              </div>

              {/* Trust badges */}
              <div style={styles.trustCard}>
                {[
                  { icon: "🚚", label: "Free Delivery", sub: "On all orders" },
                  { icon: "🔒", label: "Secure Checkout", sub: "Your data is safe" },
                  { icon: "📞", label: "Support", sub: "Mon–Sat, 9am–6pm" },
                ].map(({ icon, label, sub }) => (
                  <div key={label} style={styles.trustItem}>
                    <span style={styles.trustIcon}>{icon}</span>
                    <div>
                      <p style={styles.trustLabel}>{label}</p>
                      <p style={styles.trustSub}>{sub}</p>
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
